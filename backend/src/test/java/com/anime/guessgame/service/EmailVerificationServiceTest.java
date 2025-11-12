package com.anime.guessgame.service;

import com.anime.guessgame.entity.EmailVerificationToken;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.repository.EmailVerificationTokenRepository;
import com.anime.guessgame.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceTest {

    @Mock
    private EmailVerificationTokenRepository verificationTokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmailVerificationService emailVerificationService;

    private User user;
    private StubEmailService emailService;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .build();

        emailService = new StubEmailService();
        ReflectionTestUtils.setField(emailVerificationService, "emailService", emailService);
    }

    @Test
    void sendVerificationEmailPersistsTokenAndSendsEmail() {
        emailVerificationService.sendVerificationEmail(user);

        ArgumentCaptor<EmailVerificationToken> tokenCaptor = ArgumentCaptor.forClass(EmailVerificationToken.class);
        org.mockito.Mockito.verify(verificationTokenRepository).deleteByUser(user);
        org.mockito.Mockito.verify(verificationTokenRepository).save(tokenCaptor.capture());

        EmailVerificationToken savedToken = tokenCaptor.getValue();
        assertThat(savedToken.getUser()).isEqualTo(user);
        assertThat(savedToken.getToken()).isNotBlank();
        assertThat(savedToken.isExpired()).isFalse();

        assertThat(emailService.toEmail).isEqualTo("test@example.com");
        assertThat(emailService.username).isEqualTo("testuser");
        assertThat(emailService.token).isNotBlank();
    }

    @Test
    void sendVerificationEmailSkipsWhenEmailServiceUnavailable() {
        ReflectionTestUtils.setField(emailVerificationService, "emailService", null);

        emailVerificationService.sendVerificationEmail(user);

        verifyNoInteractions(verificationTokenRepository);
    }

    private static class StubEmailService extends EmailService {
        private String toEmail;
        private String username;
        private String token;

        @Override
        public void sendEmailVerificationEmail(String toEmail, String username, String verificationToken) {
            this.toEmail = toEmail;
            this.username = username;
            this.token = verificationToken;
        }
    }
}

