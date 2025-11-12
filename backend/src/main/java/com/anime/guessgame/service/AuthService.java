package com.anime.guessgame.service;

import com.anime.guessgame.dto.AuthResponse;
import com.anime.guessgame.dto.LoginRequest;
import com.anime.guessgame.dto.RegisterRequest;
import com.anime.guessgame.dto.MessageResponse;
import com.anime.guessgame.entity.User;
import com.anime.guessgame.exception.BadRequestException;
import com.anime.guessgame.exception.ResourceAlreadyExistsException;
import com.anime.guessgame.repository.UserRepository;
import com.anime.guessgame.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Transactional
    public MessageResponse register(RegisterRequest request) {
        logger.info("Registering new user: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResourceAlreadyExistsException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);
        logger.info("User registered successfully: {}", user.getUsername());

        emailVerificationService.sendVerificationEmail(user);

        return new MessageResponse("Registration successful! Please check your email to verify your account.");
    }

    public AuthResponse login(LoginRequest request) {
        logger.info("User login attempt: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            logger.warn("User {} attempted login without verifying email", user.getUsername());
            SecurityContextHolder.clearContext();
            throw new BadRequestException("Please verify your email before signing in.");
        }

        logger.info("User logged in successfully: {}", user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

}

