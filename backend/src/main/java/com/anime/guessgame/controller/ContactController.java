package com.anime.guessgame.controller;

import com.anime.guessgame.dto.ContactRequest;
import com.anime.guessgame.dto.MessageResponse;
import com.anime.guessgame.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@Tag(name = "Contact", description = "Contact form endpoint")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    @Operation(summary = "Submit contact form", description = "Sends a contact form submission via email")
    public ResponseEntity<MessageResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        emailService.sendContactEmail(request.getName(), request.getEmail(), request.getMessage());
        return ResponseEntity.ok(new MessageResponse("Thank you for your message! We'll get back to you soon."));
    }
}

