package com.anime.guessgame.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Google reCAPTCHA v3 Service
 * 
 * Verifies that users are human, not bots
 */
@Service
public class RecaptchaService {

    private static final Logger logger = LoggerFactory.getLogger(RecaptchaService.class);
    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @Value("${recaptcha.secret-key:}")
    private String secretKey;

    @Value("${recaptcha.enabled:false}")
    private boolean enabled;

    @Value("${recaptcha.threshold:0.5}")
    private double threshold;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Verify reCAPTCHA token
     * 
     * @param token Token from frontend
     * @param action Expected action (e.g., "register", "login")
     * @return true if verification succeeds
     */
    public boolean verify(String token, String action) {
        // Skip if reCAPTCHA is disabled (for development)
        if (!enabled) {
            logger.info("reCAPTCHA verification skipped (disabled)");
            return true;
        }

        // Validate secret key is configured when reCAPTCHA is enabled
        if (secretKey == null || secretKey.isEmpty() || secretKey.trim().isEmpty()) {
            logger.error("reCAPTCHA is enabled but secret key is not configured. Please set RECAPTCHA_SECRET_KEY environment variable.");
            return false;
        }

        if (token == null || token.isEmpty()) {
            logger.warn("reCAPTCHA token is missing");
            return false;
        }

        try {
            // Prepare request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("secret", secretKey);
            map.add("response", token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            // Call Google API
            String response = restTemplate.postForObject(RECAPTCHA_VERIFY_URL, request, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            boolean success = jsonNode.get("success").asBoolean();
            double score = jsonNode.has("score") ? jsonNode.get("score").asDouble() : 0.0;
            String responseAction = jsonNode.has("action") ? jsonNode.get("action").asText() : "";

            logger.info("reCAPTCHA verification - Success: {}, Score: {}, Action: {}, Expected Action: {}", 
                       success, score, responseAction, action);

            // Check success, score threshold, and action match
            if (!success) {
                // Log error codes if present for better debugging
                if (jsonNode.has("error-codes")) {
                    logger.warn("reCAPTCHA verification failed: success=false. Error codes: {}. Response: {}", 
                               jsonNode.get("error-codes").toString(), response);
                } else {
                    logger.warn("reCAPTCHA verification failed: success=false. Response: {}", response);
                }
                return false;
            }
            if (score < threshold) {
                logger.warn("reCAPTCHA verification failed: score {} is below threshold {}. Response: {}", 
                           score, threshold, response);
                return false;
            }
            if (!action.equals(responseAction)) {
                logger.warn("reCAPTCHA verification failed: action mismatch. Expected: {}, Got: {}. Response: {}", 
                           action, responseAction, response);
                return false;
            }
            
            return true;

        } catch (Exception e) {
            logger.error("reCAPTCHA verification failed with exception: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Verify without action check (for backward compatibility)
     * Note: This skips action validation and only checks success and score
     */
    public boolean verifyWithoutAction(String token) {
        // Skip if reCAPTCHA is disabled
        if (!enabled) {
            logger.info("reCAPTCHA verification skipped (disabled)");
            return true;
        }

        if (token == null || token.isEmpty()) {
            logger.warn("reCAPTCHA token is missing");
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
            map.add("secret", secretKey);
            map.add("response", token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

            String response = restTemplate.postForObject(RECAPTCHA_VERIFY_URL, request, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);

            boolean success = jsonNode.get("success").asBoolean();
            double score = jsonNode.has("score") ? jsonNode.get("score").asDouble() : 0.0;

            logger.info("reCAPTCHA verification (no action check) - Success: {}, Score: {}", success, score);

            return success && score >= threshold;

        } catch (Exception e) {
            logger.error("reCAPTCHA verification failed", e);
            return false;
        }
    }
}

