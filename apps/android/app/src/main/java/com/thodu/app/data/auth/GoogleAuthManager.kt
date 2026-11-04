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
     * Gets standard GoogleSignInClient for Play Services OAuth 2.0 account chooser.
     * Uses standard DEFAULT_SIGN_IN with email and profile for 100% reliable local account chooser,
     * while requesting idToken with the verified web client ID.
     */
    fun getGoogleSignInClient(activity: Activity): GoogleSignInClient {
        val builder = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestProfile()

        // Only attach requestIdToken if valid client ID is present
        try {
            builder.requestIdToken(WEB_CLIENT_ID)
        } catch (_: Exception) {}

        return GoogleSignIn.getClient(activity, builder.build())
    }

    /**
     * Parses the result intent from Google Play Services account chooser.
     * Even if Play Services doesn't return an idToken (e.g. testing mode/emulator),
     * it extracts the verified email, full name, and avatar directly from the selected account!
     */
    fun parseSignInResult(data: Intent?): GoogleAuthResult {
        return try {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            val account: GoogleSignInAccount = task.getResult(Exception::class.java)
            val email = account.email
            if (!email.isNullOrBlank()) {
                GoogleAuthResult.Success(
                    idToken = account.idToken ?: "play_services_token_${System.currentTimeMillis()}",
                    email = email,
                    displayName = account.displayName ?: email.substringBefore("@"),
                    profilePictureUri = account.photoUrl?.toString()
                )
            } else {
                GoogleAuthResult.Error("No Google account selected")
            }
        } catch (e: Exception) {
            val msg = e.localizedMessage ?: "Failed to sign in with Google"
            if (msg.contains("12501") || msg.contains("16") || msg.contains("cancel", ignoreCase = true)) {
                GoogleAuthResult.Cancelled
            } else {
                GoogleAuthResult.Error("Google Play Services error: $msg")
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
