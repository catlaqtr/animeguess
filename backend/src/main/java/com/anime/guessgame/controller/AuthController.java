package com.anime.guessgame.controller;

import com.anime.guessgame.dto.AuthResponse;
import com.anime.guessgame.dto.LoginRequest;
import com.anime.guessgame.dto.MessageResponse;
import com.anime.guessgame.dto.PasswordResetConfirmRequest;
import com.anime.guessgame.dto.PasswordResetRequest;
import com.anime.guessgame.dto.RegisterRequest;
import com.anime.guessgame.dto.RegisterWithRecaptchaRequest;
import com.anime.guessgame.dto.ResendVerificationRequest;
import com.anime.guessgame.exception.BadRequestException;
import com.anime.guessgame.service.AuthService;
import com.anime.guessgame.service.PasswordResetService;
import com.anime.guessgame.service.RecaptchaService;
import com.anime.guessgame.service.EmailVerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private RecaptchaService recaptchaService;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and sends a verification email")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterWithRecaptchaRequest request) {
        boolean isHuman = recaptchaService.verify(request.getRecaptchaToken(), "register");

        if (!isHuman) {
            throw new BadRequestException("reCAPTCHA verification failed. Please refresh the page and try again.");
        }

        RegisterRequest registerRequest = new RegisterRequest(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
        );

        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify email", description = "Confirms the email address using the verification token sent via email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam("token") String token) {
        emailVerificationService.verifyEmailToken(token);
        return ResponseEntity.ok(new MessageResponse("Email verified successfully! You can now sign in."));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend verification email", description = "Resends the email verification link for unverified accounts")
    public ResponseEntity<MessageResponse> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        emailVerificationService.resendVerificationEmail(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("If the account exists and is not verified, a new verification email has been sent."));
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates user and returns JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/password-reset/request")
    @Operation(summary = "Request password reset", description = "Sends password reset email if account exists")
    public ResponseEntity<MessageResponse> requestPasswordReset(@Valid @RequestBody PasswordResetRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("If an account with that email exists, password reset instructions have been sent."));
    }

    @GetMapping("/password-reset/validate")
    @Operation(summary = "Validate reset token", description = "Checks whether a reset token is still valid")
    public ResponseEntity<MessageResponse> validateResetToken(@RequestParam("token") String token) {
        passwordResetService.validateResetToken(token);
        return ResponseEntity.ok(new MessageResponse("Token is valid."));
    }

    @PostMapping("/password-reset/confirm")
    @Operation(summary = "Reset password", description = "Resets password using a valid reset token")
    public ResponseEntity<MessageResponse> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequest request) {
        passwordResetService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password has been reset successfully."));
    }

}

