package com.anime.guessgame.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;

/**
 * OAuth2/OIDC Configuration
 * 
 * Enables "Sign in with Google/GitHub"
 * 
 * Setup Required:
 * 1. Get credentials from Google Cloud Console
 * 2. Add redirect URI: http://localhost:8080/login/oauth2/code/google
 * 3. Set environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 * 
 * NOTE: This configuration is OPTIONAL. The app works without OAuth2.
 * Set oauth2.enabled=true in application.yml to enable.
 */
@Configuration
@ConditionalOnProperty(name = "oauth2.enabled", havingValue = "true", matchIfMissing = false)
public class OAuth2Config {

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;

    @Value("${GOOGLE_CLIENT_SECRET:}")
    private String googleClientSecret;

    /**
     * Configure OAuth2 providers
     * 
     * Currently supports:
     * - Google
     * - GitHub (add if needed)
     */
    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        ClientRegistration google = googleClientRegistration();
        if (google == null) {
            throw new IllegalStateException("OAuth2 is enabled but GOOGLE_CLIENT_ID/SECRET are not set");
        }
        return new InMemoryClientRegistrationRepository(google);
    }

    /**
     * Google OAuth2 Configuration
     */
    private ClientRegistration googleClientRegistration() {
        if (googleClientId == null || googleClientId.isEmpty()) {
            return null;
        }
        if (googleClientSecret == null || googleClientSecret.isEmpty()) {
            return null;
        }
        
        return ClientRegistration.withRegistrationId("google")
                .clientId(googleClientId)
                .clientSecret(googleClientSecret)
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("openid", "profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .clientName("Google")
                .build();
    }

    /**
     * GitHub OAuth2 Configuration (optional)
     * 
     * Uncomment to enable GitHub login
     */
    /*
    private ClientRegistration githubClientRegistration() {
        return ClientRegistration.withRegistrationId("github")
                .clientId(System.getenv("GITHUB_CLIENT_ID"))
                .clientSecret(System.getenv("GITHUB_CLIENT_SECRET"))
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("read:user", "user:email")
                .authorizationUri("https://github.com/login/oauth/authorize")
                .tokenUri("https://github.com/login/oauth/access_token")
                .userInfoUri("https://api.github.com/user")
                .userNameAttributeName("id")
                .clientName("GitHub")
                .build();
    }
    */
}

