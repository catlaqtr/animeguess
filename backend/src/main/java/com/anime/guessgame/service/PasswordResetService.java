package com.anime.guessgame.service;

import com.anime.guessgame.entity.PasswordResetToken;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.exception.BadRequestException;
import com.anime.guessgame.repository.PasswordResetTokenRepository;
import com.anime.guessgame.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final int TOKEN_EXPIRY_MINUTES = 60;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);

        optionalUser.ifPresent(user -> {
            passwordResetTokenRepository.deleteByUser(user);

            String token = UUID.randomUUID().toString();
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(TOKEN_EXPIRY_MINUTES);

            PasswordResetToken resetToken = new PasswordResetToken(token, expiresAt, user);
            passwordResetTokenRepository.save(resetToken);

            emailService.sendPasswordResetEmail(user.getEmail(), token);
            logger.info("Password reset token generated for user {}", user.getEmail());
        });
    }

    @Transactional(readOnly = true)
    public void validateResetToken(String token) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token."));

        if (resetToken.isExpired()) {
            throw new BadRequestException("Password reset token has expired.");
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired password reset token."));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BadRequestException("Password reset token has expired.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
        logger.info("Password reset successfully for {}", user.getEmail());
    }

    @Transactional
    public void purgeExpiredTokens() {
        passwordResetTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}


