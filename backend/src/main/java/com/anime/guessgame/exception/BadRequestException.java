package com.anime.guessgame.exception;

/**
 * Exception thrown when a request fails validation or business rules.
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    public BadRequestException(String message, Throwable cause) {
        super(message, cause);
    }
}

