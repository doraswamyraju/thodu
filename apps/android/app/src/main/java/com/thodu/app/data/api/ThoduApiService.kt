package com.thodu.app.data.api

import com.thodu.app.data.model.*
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import java.util.concurrent.TimeUnit

interface ThoduApiService {
    // Auth
    @POST("/api/v1/auth/login")
    suspend fun loginWithCredentials(@Body request: CredentialLoginRequest): OAuthLoginResponse

    @POST("/api/v1/auth/oauth")
    suspend fun loginWithOAuth(@Body request: OAuthLoginRequest): OAuthLoginResponse

    @GET("/api/v1/auth/users")
    suspend fun getUsers(): UsersListResponse

    // Beneficiary Module - Fetch only the logged in user's loved ones
    @GET("/api/v1/beneficiaries")
    suspend fun getBeneficiaries(
        @Query("email") email: String? = null,
        @Query("phone") phone: String? = null
    ): BeneficiariesResponse

    @GET("/api/v1/bookings")
    suspend fun getBookings(): BookingsResponse

    @POST("/api/v1/bookings")
    suspend fun createBooking(@Body request: CreateBookingRequest): GenericResponse

    @GET("/api/v1/services")
    suspend fun getServices(): ServicesResponse

    @POST("/api/v1/sos/queue")
    suspend fun triggerSos(@Body request: SosRequest): GenericResponse
}

object ApiClient {
    // Live Cloud Server Domain for Thodu Platform (HTTPS)
    private const val BASE_URL = "https://thodu.sriddha.com/"

    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .build()

    val apiService: ThoduApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ThoduApiService::class.java)
    }
}
