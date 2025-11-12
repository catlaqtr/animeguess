package com.anime.guessgame.service;

import com.anime.guessgame.dto.LoginRequest;
import com.anime.guessgame.dto.MessageResponse;
import com.anime.guessgame.dto.RegisterRequest;
import com.anime.guessgame.entity.EmailVerificationToken;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.exception.BadRequestException;
import com.anime.guessgame.repository.EmailVerificationTokenRepository;
import com.anime.guessgame.repository.UserRepository;
import com.anime.guessgame.support.IntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthServiceIntegrationTest extends IntegrationTestBase {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailVerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Test
    void registerPersistsUserAndCreatesVerificationToken() {
        RegisterRequest request = new RegisterRequest(
                "integrationUser",
                "integration@example.com",
                "Password123!"
        );

        MessageResponse response = authService.register(request);

        assertThat(response.getMessage()).contains("Registration successful");

        List<User> users = userRepository.findAll();
        assertThat(users)
                .hasSize(1)
                .first()
                .satisfies(user -> {
                    assertThat(user.getUsername()).isEqualTo("integrationUser");
                    assertThat(user.isEmailVerified()).isFalse();
                });

        List<EmailVerificationToken> tokens = verificationTokenRepository.findAll();
        assertThat(tokens)
                .hasSize(1)
                .first()
                .satisfies(token -> {
                    Long userId = token.getUser().getId();
                    User tokenOwner = userRepository.findById(userId).orElseThrow();
                    assertThat(tokenOwner.getEmail()).isEqualTo("integration@example.com");
                    assertThat(token.isExpired()).isFalse();
                });
    }

    @Test
    void loginRejectsUnverifiedAccount() {
        RegisterRequest request = new RegisterRequest(
                "unverifiedUser",
                "unverified@example.com",
                "Password123!"
        );
        authService.register(request);

        LoginRequest loginRequest = new LoginRequest("unverifiedUser", "Password123!");

        BadRequestException exception =
                assertThrows(BadRequestException.class, () -> authService.login(loginRequest));

        assertThat(exception.getMessage()).isEqualTo("Please verify your email before signing in.");
    }

    @Test
    void verifyEmailTokenMarksUserAsVerifiedAndRemovesToken() {
        RegisterRequest request = new RegisterRequest(
                "verifyFlowUser",
                "verify-flow@example.com",
                "Password123!"
        );
        authService.register(request);

        Long userId = userRepository.findByUsername("verifyFlowUser")
                .orElseThrow()
                .getId();

        EmailVerificationToken token = verificationTokenRepository.findAll()
                .stream()
                .filter(t -> t.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow();

        emailVerificationService.verifyEmailToken(token.getToken());

        User verifiedUser = userRepository.findById(token.getUser().getId()).orElseThrow();
        assertThat(verifiedUser.isEmailVerified()).isTrue();
        assertThat(verifiedUser.getVerifiedAt()).isNotNull();
        assertThat(verificationTokenRepository.findById(token.getId())).isEmpty();
    }

    @Test
    void verifyEmailTokenThrowsForExpiredToken() {
        RegisterRequest request = new RegisterRequest(
                "expiredTokenUser",
                "expired@example.com",
                "Password123!"
        );
        authService.register(request);

        Long userId = userRepository.findByUsername("expiredTokenUser")
                .orElseThrow()
                .getId();

        EmailVerificationToken token = verificationTokenRepository.findAll()
                .stream()
                .filter(t -> t.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow();

        token.setExpiresAt(token.getExpiresAt().minusHours(48));
        verificationTokenRepository.save(token);

        assertThatThrownBy(() -> emailVerificationService.verifyEmailToken(token.getToken()))
                .isInstanceOf(BadRequestException.class)
                .hasMessage("Verification token has expired. Please request a new one.");

        assertThat(verificationTokenRepository.findById(token.getId())).isPresent();
        User user = userRepository.findById(token.getUser().getId()).orElseThrow();
        assertThat(user.isEmailVerified()).isFalse();
        assertThat(user.getVerifiedAt()).isNull();
    }
}

