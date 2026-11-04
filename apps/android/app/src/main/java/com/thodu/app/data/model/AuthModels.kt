package com.thodu.app.data.model

import com.google.gson.annotations.SerializedName

data class AppUser(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String,
    @SerializedName("avatarUrl") val avatarUrl: String?,
    @SerializedName("role") val role: String, // BENEFICIARY, CAREGIVER, FREELANCER, ADMIN
    @SerializedName("provider") val provider: String, // GOOGLE, APPLE, DIRECT
    @SerializedName("phone") val phone: String?,
    @SerializedName("createdAt") val createdAt: String?,
    @SerializedName("lastLoginAt") val lastLoginAt: String?
)

data class CredentialLoginRequest(
    @SerializedName("credential") val credential: String,
    @SerializedName("password") val password: String? = null,
    @SerializedName("role") val role: String = "BENEFICIARY"
)

data class OAuthLoginRequest(
    @SerializedName("provider") val provider: String,
    @SerializedName("email") val email: String,
    @SerializedName("name") val name: String,
    @SerializedName("role") val role: String,
    @SerializedName("photoUrl") val photoUrl: String? = null,
    @SerializedName("idToken") val idToken: String? = null
)

data class OAuthLoginResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("user") val user: AppUser?,
    @SerializedName("token") val token: String?,
    @SerializedName("message") val message: String? = null
)

data class UsersListResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("count") val count: Int,
    @SerializedName("users") val users: List<AppUser>
)
