package com.anime.guessgame.filter;

import com.anime.guessgame.config.RateLimitConfig;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rate Limiting Filter using Bucket4j
 * 
 * Applies different limits based on endpoint
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

    @Autowired
    private RateLimitConfig rateLimitConfig;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        
        // Skip rate limiting for public endpoints
        if (isPublicEndpoint(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get user identifier (username or IP)
        String key = getUserKey(request);
        
        // Determine bucket type based on endpoint
        RateLimitConfig.BucketType bucketType = getBucketType(path);
        
        // Get bucket for this user
        Bucket bucket = rateLimitConfig.resolveBucket(key, bucketType);
        
        // Try to consume 1 token
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        
        if (probe.isConsumed()) {
            // Add rate limit headers
            response.addHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000;
            
            logger.warn("Rate limit exceeded for user: {} on endpoint: {}", key, path);
            
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(String.format(
                "{\"error\":\"Rate limit exceeded\",\"message\":\"Too many requests. Try again in %d seconds.\",\"retryAfter\":%d}",
                waitForRefill, waitForRefill
            ));
        }
    }

    private String getUserKey(HttpServletRequest request) {
        // Try to get authenticated username
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        
        // Fall back to IP address
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null) {
            ipAddress = request.getRemoteAddr();
        }
        return ipAddress;
    }

    private RateLimitConfig.BucketType getBucketType(String path) {
        if (path.contains("/game/ask")) {
            return RateLimitConfig.BucketType.QUESTION;
        } else if (path.contains("/auth/")) {
            return RateLimitConfig.BucketType.AUTH;
        }
        return RateLimitConfig.BucketType.GENERAL;
    }

    private boolean isPublicEndpoint(String path) {
        return path.contains("/swagger") || 
               path.contains("/api-docs") ||
               path.contains("/actuator/health");
    }
}

