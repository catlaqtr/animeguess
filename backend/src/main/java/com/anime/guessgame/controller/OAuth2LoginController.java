package com.anime.guessgame.controller;

import com.anime.guessgame.dto.AuthResponse;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.repository.UserRepository;
import com.anime.guessgame.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * OAuth2 Login Controller
 * 
 * Handles "Sign in with Google" flow
 */
@RestController
@RequestMapping("/api/auth/oauth2")
@Tag(name = "OAuth2 Authentication", description = "Social login endpoints")
public class OAuth2LoginController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * OAuth2 login success handler
     * 
     * Called after successful Google login
     * Creates or updates user and returns JWT
     */
    @GetMapping("/success")
    @Operation(summary = "OAuth2 login success", description = "Returns JWT after successful social login")
    public ResponseEntity<AuthResponse> oauth2LoginSuccess(@AuthenticationPrincipal OAuth2User principal) {
        // Extract user info from OAuth2 provider
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        String googleId = principal.getAttribute("sub");

        // Find or create user
        User user = userRepository.findByEmail(email)
                .map(existing -> ensureVerified(existing))
                .orElseGet(() -> createOAuth2User(email, name, googleId));

        // Generate JWT token
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        java.util.Collections.emptyList()
                );

        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authentication =
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );

        String token = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build());
    }

    /**
     * Create new user from OAuth2 data
     */
    private User createOAuth2User(String email, String name, String providerId) {
        // Generate username from email or name
        String username = email.split("@")[0];
        
        // Check if username exists, append number if needed
        String finalUsername = username;
        int counter = 1;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = username + counter++;
        }

        // Create user with random password (won't be used for OAuth login)
        User user = User.builder()
                .username(finalUsername)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .emailVerified(true)
                .verifiedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    private User ensureVerified(User user) {
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            user = userRepository.save(user);
        }
        return user;
    }
}

