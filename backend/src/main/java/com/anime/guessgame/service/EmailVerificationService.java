package com.anime.guessgame.service;

import com.anime.guessgame.entity.EmailVerificationToken;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.exception.BadRequestException;
import com.anime.guessgame.repository.EmailVerificationTokenRepository;
import com.anime.guessgame.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private static final Logger logger = LoggerFactory.getLogger(EmailVerificationService.class);
    private static final int TOKEN_EXPIRY_HOURS = 24;

    @Autowired
    private EmailVerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private EmailService emailService;

    @Transactional
    public void sendVerificationEmail(User user) {
        if (emailService == null) {
            logger.warn("Email service not configured; skipping verification email for {}", user.getEmail());
            return;
        }

        verificationTokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(TOKEN_EXPIRY_HOURS);

        EmailVerificationToken verificationToken = new EmailVerificationToken(token, expiresAt, user);
        verificationTokenRepository.save(verificationToken);

        emailService.sendEmailVerificationEmail(user.getEmail(), user.getUsername(), token);
        logger.info("Verification email sent to {}", user.getEmail());
    }

    @Transactional
    public void verifyEmailToken(String token) {
        EmailVerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification token."));

        if (verificationToken.isExpired()) {
            verificationTokenRepository.delete(verificationToken);
            throw new BadRequestException("Verification token has expired. Please request a new one.");
        }

        User user = verificationToken.getUser();
        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            user.setVerifiedAt(LocalDateTime.now());
            userRepository.save(user);
            logger.info("Email verified for user {}", user.getEmail());

            if (emailService != null) {
                try {
                    emailService.sendWelcomeEmail(user.getEmail(), user.getUsername());
                } catch (Exception e) {
                    logger.error("Failed to send welcome email after verification", e);
                }
            }
        }

        verificationTokenRepository.delete(verificationToken);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("No account found with that email address."));

        if (user.isEmailVerified()) {
            throw new BadRequestException("Account is already verified.");
        }

        sendVerificationEmail(user);
    }

    @Transactional
    public void purgeExpiredTokens() {
        verificationTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}


