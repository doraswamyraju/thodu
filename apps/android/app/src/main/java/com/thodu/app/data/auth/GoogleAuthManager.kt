package com.thodu.app.data.auth

import android.app.Activity
import android.content.Context
import android.content.Intent
import androidx.activity.result.ActivityResultLauncher
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import java.security.MessageDigest
import java.util.UUID

object GoogleAuthManager {
    // Web / Server Client ID from google-services.json
    const val WEB_CLIENT_ID = "814572872575-a6av64egoid154idv7f6kj78829fb5pv.apps.googleusercontent.com"

    sealed class GoogleAuthResult {
        data class Success(
            val idToken: String,
            val email: String,
            val displayName: String?,
            val profilePictureUri: String?
        ) : GoogleAuthResult()

        data class Error(val message: String) : GoogleAuthResult()
        object Cancelled : GoogleAuthResult()
    }

    /**
     * Gets standard GoogleSignInClient for Play Services OAuth 2.0 account chooser
     */
    fun getGoogleSignInClient(activity: Activity): GoogleSignInClient {
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(WEB_CLIENT_ID)
            .requestEmail()
            .requestProfile()
            .build()
        return GoogleSignIn.getClient(activity, gso)
    }

    /**
     * Parses the result intent from Google Play Services account chooser
     */
    fun parseSignInResult(data: Intent?): GoogleAuthResult {
        return try {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val account: GoogleSignInAccount = task.getResult(Exception::class.java)
            val idToken = account.idToken
            val email = account.email
            if (idToken != null && email != null) {
                GoogleAuthResult.Success(
                    idToken = idToken,
                    email = email,
                    displayName = account.displayName,
                    profilePictureUri = account.photoUrl?.toString()
                )
            } else {
                GoogleAuthResult.Error("Google account details were incomplete")
            }
        } catch (e: Exception) {
            val msg = e.localizedMessage ?: "Failed to sign in with Google"
            if (msg.contains("12501") || msg.contains("16") || msg.contains("cancel", ignoreCase = true)) {
                GoogleAuthResult.Cancelled
            } else {
                GoogleAuthResult.Error("Google Play Services: $msg")
            }
        }
    }

    /**
     * Attempts CredentialManager first; if "No credentials available" (fresh device / no passkey saved),
     * launches standard Google Play Services account chooser.
     */
    suspend fun signInWithCredentialManager(
        context: Context,
        onFallbackToPlayServices: () -> Unit
    ): GoogleAuthResult? {
        return try {
            val credentialManager = CredentialManager.create(context)

            val rawNonce = UUID.randomUUID().toString()
            val md = MessageDigest.getInstance("SHA-256")
            val digest = md.digest(rawNonce.toByteArray())
            val hashedNonce = digest.fold("") { str, it -> str + "%02x".format(it) }

            val googleIdOption = GetGoogleIdOption.Builder()
                .setFilterByAuthorizedAccounts(false)
                .setServerClientId(WEB_CLIENT_ID)
                .setAutoSelectEnabled(false)
                .setNonce(hashedNonce)
                .build()

            val request = GetCredentialRequest.Builder()
                .addCredentialOption(googleIdOption)
                .build()

            val result = credentialManager.getCredential(
                request = request,
                context = context
            )

            when (val credential = result.credential) {
                is CustomCredential -> {
                    if (credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                        val tokenCred = GoogleIdTokenCredential.createFrom(credential.data)
                        GoogleAuthResult.Success(
                            idToken = tokenCred.idToken,
                            email = tokenCred.id,
                            displayName = tokenCred.displayName,
                            profilePictureUri = tokenCred.profilePictureUri?.toString()
                        )
                    } else {
                        onFallbackToPlayServices()
                        null
                    }
                }
                else -> {
                    onFallbackToPlayServices()
                    null
                }
            }
        } catch (e: GetCredentialCancellationException) {
            GoogleAuthResult.Cancelled
        } catch (e: GetCredentialException) {
            // "No credentials available" -> launch standard Google Play Services account chooser
            onFallbackToPlayServices()
            null
        } catch (e: Exception) {
            onFallbackToPlayServices()
            null
        }
    }
}
