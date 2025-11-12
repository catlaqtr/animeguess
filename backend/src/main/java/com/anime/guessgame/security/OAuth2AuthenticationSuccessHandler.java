package com.anime.guessgame.security;

import com.anime.guessgame.entity.User;
import com.anime.guessgame.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.UUID;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final String frontendUrl;

    public OAuth2AuthenticationSuccessHandler(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            @Value("${app.frontend-url}") String frontendUrl
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.frontendUrl = frontendUrl != null ? frontendUrl.replaceAll("/$", "") : "";
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();

        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");
        if (email == null || email.isBlank()) {
            throw new IllegalStateException("OAuth2 provider did not return an email address.");
        }

        User user = userRepository.findByEmail(email)
                .map(existing -> updateVerification(existing))
                .orElseGet(() -> createOAuth2User(email, name));

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList()
        );

        Authentication jwtAuthentication = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        String token = tokenProvider.generateToken(jwtAuthentication);

        String redirectUrl = UriComponentsBuilder
                .fromHttpUrl(resolveFrontendUrl(request))
                .path("/oauth/callback")
                .queryParam("token", token)
                .queryParam("type", "Bearer")
                .queryParam("userId", user.getId())
                .queryParam("username", user.getUsername())
                .queryParam("email", user.getEmail())
                .build(true)
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private User updateVerification(User user) {
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            user = userRepository.save(user);
        }
        return user;
    }

    private User createOAuth2User(String email, String name) {
        String baseUsername = deriveUsername(email, name);
        String finalUsername = baseUsername;
        int counter = 1;
        while (userRepository.existsByUsername(finalUsername)) {
            finalUsername = baseUsername + counter++;
        }

        User user = User.builder()
                .username(finalUsername)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .emailVerified(true)
                .verifiedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    private String deriveUsername(String email, String name) {
        if (name != null && !name.isBlank()) {
            String sanitized = name.trim().toLowerCase()
                    .replaceAll("[^a-z0-9]", "-")
                    .replaceAll("-{2,}", "-")
                    .replaceAll("(^-|-$)", "");
            if (!sanitized.isBlank()) {
                return sanitized;
            }
        }
        return email.split("@")[0];
    }

    private String resolveFrontendUrl(HttpServletRequest request) {
        if (frontendUrl != null && !frontendUrl.isBlank()) {
            return frontendUrl;
        }
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        if ((scheme.equals("http") && serverPort == 80) || (scheme.equals("https") && serverPort == 443)) {
            return scheme + "://" + serverName;
        }
        return scheme + "://" + serverName + ":" + serverPort;
    }
}

