package io.github.aidenkoog.image_viewer.data

import androidx.paging.Pager
import androidx.paging.PagingConfig
import androidx.paging.PagingData
import kotlinx.coroutines.flow.Flow
import io.github.aidenkoog.image_viewer.api.NaverImageSearchService
import io.github.aidenkoog.image_viewer.model.Item
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class NaverImageSearchRepository {
    private val service: NaverImageSearchService

    init {
        val logger = HttpLoggingInterceptor()
        logger.level = HttpLoggingInterceptor.Level.BASIC

        val client = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val request = chain.request().newBuilder()
                    .addHeader("X-Naver-Client-Id", "cjsB1l28Vh7tgocuhPuS")
                    .addHeader("X-Naver-Client-Secret", "MHNlSOdBJu")
                    .build()
                chain.proceed(request)
            }
            .addInterceptor(logger)
            .build()

        service = Retrofit.Builder()
            .baseUrl("https://openapi.naver.com")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(NaverImageSearchService::class.java)
    }

    fun getImageSearch(query: String): Flow<PagingData<Item>> {
        return Pager(
            config = PagingConfig(
                pageSize = NaverImageSearchDataSource.defaultDisplay,
                enablePlaceholders = false
            ),
            pagingSourceFactory = {
                NaverImageSearchDataSource(query, service)
            }
        ).flow
    }
}