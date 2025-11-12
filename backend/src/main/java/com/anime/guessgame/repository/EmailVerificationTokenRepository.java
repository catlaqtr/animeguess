package com.anime.guessgame.repository;

import com.anime.guessgame.entity.EmailVerificationToken;
import com.anime.guessgame.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);

    void deleteByUser(User user);

    void deleteByExpiresAtBefore(LocalDateTime cutoff);
}


