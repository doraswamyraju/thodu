package com.thodu.app.data.api

import com.thodu.app.data.model.OAuthLoginRequest
import com.thodu.app.data.model.OAuthLoginResponse
import com.thodu.app.data.model.UsersListResponse
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

interface ThoduApiService {
    @POST("/api/v1/auth/oauth")
    suspend fun loginWithOAuth(@Body request: OAuthLoginRequest): OAuthLoginResponse

    @GET("/api/v1/auth/users")
    suspend fun getUsers(): UsersListResponse
}

object ApiClient {
    // Live Cloud Server for Thodu Platform
    private const val BASE_URL = "http://147.93.107.21/"

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
