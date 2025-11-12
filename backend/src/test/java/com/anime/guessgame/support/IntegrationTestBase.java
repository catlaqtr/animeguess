package com.anime.guessgame.support;

import com.anime.guessgame.repository.EmailVerificationTokenRepository;
import com.anime.guessgame.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
@SpringBootTest
@ActiveProfiles("test")
public abstract class IntegrationTestBase {

    @Container
    private static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("anime_guess_game")
            .withUsername("test")
            .withPassword("test");

    @MockBean
    protected ChatModel chatModel;

    @Autowired
    private EmailVerificationTokenRepository verificationTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @DynamicPropertySource
    static void registerPostgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
        registry.add("spring.flyway.url", POSTGRES::getJdbcUrl);
        registry.add("spring.flyway.user", POSTGRES::getUsername);
        registry.add("spring.flyway.password", POSTGRES::getPassword);
    }

    @AfterEach
    protected void cleanDatabase() {
        verificationTokenRepository.deleteAll();
        userRepository.deleteAll();
    }
}

