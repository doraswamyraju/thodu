package com.thodu.app.data.auth

import android.content.Context
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import java.security.MessageDigest
import java.util.UUID

object GoogleAuthManager {
    // Server / Web Client ID from google-services.json
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

    suspend fun signInWithGoogle(context: Context): GoogleAuthResult {
        return try {
            val credentialManager = CredentialManager.create(context)

            // Random raw nonce
            val rawNonce = UUID.randomUUID().toString()
            val md = MessageDigest.getInstance("SHA-256")
            val digest = md.digest(rawNonce.toByteArray())
            val hashedNonce = digest.fold("") { str, it -> str + "%02x".format(it) }

            val googleIdOption = GetGoogleIdOption.Builder()
                .setFilterByAuthorizedAccounts(false) // Show all logged-in accounts on device
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
                        val googleIdTokenCredential = GoogleIdTokenCredential.createFrom(credential.data)
                        GoogleAuthResult.Success(
                            idToken = googleIdTokenCredential.idToken,
                            email = googleIdTokenCredential.id,
                            displayName = googleIdTokenCredential.displayName,
                            profilePictureUri = googleIdTokenCredential.profilePictureUri?.toString()
                        )
                    } else {
                        GoogleAuthResult.Error("Unsupported credential type: ${credential.type}")
                    }
                }
                else -> {
                    GoogleAuthResult.Error("Unexpected credential format received")
                }
            }
        } catch (e: GetCredentialCancellationException) {
            GoogleAuthResult.Cancelled
        } catch (e: GetCredentialException) {
            GoogleAuthResult.Error(e.localizedMessage ?: "Google sign in failed")
        } catch (e: Exception) {
            GoogleAuthResult.Error(e.localizedMessage ?: "Authentication error")
        }
    }
}

