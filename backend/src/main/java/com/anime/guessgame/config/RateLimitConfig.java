package com.anime.guessgame.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bucket4j Rate Limiting Configuration
 * 
 * Protects API from abuse by limiting requests per user
 */
@Configuration
public class RateLimitConfig {

    /**
     * Store buckets per user/IP
     * In production, use Redis or similar distributed cache
     */
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    /**
     * Get or create bucket for a user
     * 
     * Limits:
     * - 20 requests per minute for asking questions
     * - 100 requests per hour for other endpoints
     */
    public Bucket resolveBucket(String key, BucketType type) {
        return cache.computeIfAbsent(key, k -> createBucket(type));
    }

    private Bucket createBucket(BucketType type) {
        Bandwidth limit;
        
        switch (type) {
            case QUESTION:
                // 20 questions per minute (prevent OpenAI API spam)
                limit = Bandwidth.classic(20, Refill.intervally(20, Duration.ofMinutes(1)));
                break;
            case AUTH:
                // 5 login/register attempts per minute (prevent brute force)
                limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
                break;
            case GENERAL:
            default:
                // 100 requests per hour for other endpoints
                limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofHours(1)));
                break;
        }
        
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    public enum BucketType {
        QUESTION,   // For /game/ask endpoint
        AUTH,       // For login/register
        GENERAL     // For other endpoints
    }
}

