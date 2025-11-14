package com.anime.guessgame.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * SendGrid Email Service
 * 
 * Handles sending emails for:
 * - Welcome emails
 * - Password resets
 * - Game notifications
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Value("${sendgrid.api-key:}")
    private String apiKey;

    @Value("${sendgrid.from-email:noreply@animeguessgame.com}")
    private String fromEmail;

    @Value("${sendgrid.from-name:Anime Guess Game}")
    private String fromName;

    @Value("${sendgrid.enabled:false}")
    private boolean enabled;

    @Value("${app.frontend-url:https://your-frontend-url.vercel.app}")
    private String frontendUrl;

    /**
     * Send welcome email to new user
     */
    public void sendWelcomeEmail(String toEmail, String username) {
        String subject = "Welcome to Anime Guess Game! 🎌";
        String htmlContent = buildWelcomeEmailHtml(username);
        
        sendEmail(toEmail, subject, htmlContent);
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String subject = "Reset Your Password - Anime Guess Game";
        String htmlContent = buildPasswordResetEmailHtml(resetToken);
        
        sendEmail(toEmail, subject, htmlContent);
    }

    /**
     * Send email verification link
     */
    public void sendEmailVerificationEmail(String toEmail, String username, String verificationToken) {
        String subject = "Verify Your Email - Anime Guess Game";
        String htmlContent = buildEmailVerificationHtml(username, verificationToken);

        sendEmail(toEmail, subject, htmlContent);
    }

    /**
     * Send game achievement notification
     */
    public void sendAchievementEmail(String toEmail, String username, String achievement) {
        String subject = "🎉 New Achievement Unlocked!";
        String htmlContent = buildAchievementEmailHtml(username, achievement);
        
        sendEmail(toEmail, subject, htmlContent);
    }

    /**
     * Send contact form submission email
     */
    public void sendContactEmail(String fromName, String fromEmail, String message) {
        String subject = "New Contact Form Submission - Anime Guess Game";
        String htmlContent = buildContactEmailHtml(fromName, fromEmail, message);
        
        // Send to the configured from-email (your email where you receive contacts)
        sendEmail(this.fromEmail, subject, htmlContent);
    }

    /**
     * Generic email sending method
     */
    private void sendEmail(String toEmail, String subject, String htmlContent) {
        // Skip if SendGrid is disabled
        if (!enabled) {
            logger.info("Email sending skipped (disabled): {} to {}", subject, toEmail);
            return;
        }

        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(apiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);
            
            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                logger.info("Email sent successfully: {} to {}", subject, toEmail);
            } else {
                logger.error("Failed to send email. Status: {}, Body: {}", 
                           response.getStatusCode(), response.getBody());
            }

        } catch (IOException e) {
            logger.error("Error sending email to: " + toEmail, e);
        }
    }

    private String buildWelcomeEmailHtml(String username) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px; }
                    .content { padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
                    .button { background: #667eea; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎌 Welcome to Anime Guess Game!</h1>
                    </div>
                    <div class="content">
                        <h2>Hey %s! 👋</h2>
                        <p>Thanks for joining Anime Guess Game! You're now part of our awesome community.</p>
                        
                        <h3>🎮 How to Play:</h3>
                        <ul>
                            <li>Start a new game</li>
                            <li>Ask questions about the secret character</li>
                            <li>Make your guess when ready</li>
                            <li>See if you got it right!</li>
                        </ul>
                        
                        <p>Ready to test your anime knowledge?</p>
                        <a href="%s/game" class="button">Start Playing Now!</a>
                        
                        <p style="margin-top: 30px; color: #666;">
                            Happy gaming!<br>
                            The Anime Guess Game Team
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, username, frontendUrl);
    }

    private String buildPasswordResetEmailHtml(String resetToken) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔐 Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>You requested to reset your password.</p>
                        <p>Click the button below to reset your password:</p>
                        <a href="%s/reset-password?token=%s" class="button">
                            Reset Password
                        </a>
                        <p style="margin-top: 20px; color: #666;">
                            This link expires in 1 hour.<br>
                            If you didn't request this, please ignore this email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, frontendUrl, resetToken);
    }

    private String buildEmailVerificationHtml(String username, String verificationToken) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px; }
                    .content { padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
                    .button { background: #667eea; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📬 Verify Your Email</h1>
                    </div>
                    <div class="content">
                        <p>Hey %s!</p>
                        <p>Thanks for signing up for Anime Guess Game. Before you jump in, please confirm your email address:</p>
                        <a href="%s/verify-email?token=%s" class="button">
                            Verify Email
                        </a>
                        <p style="margin-top: 20px; color: #666;">
                            This link expires in 24 hours.<br>
                            If you didn't create this account, you can safely ignore this message.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, username, frontendUrl, verificationToken);
    }

    private String buildAchievementEmailHtml(String username, String achievement) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Achievement Unlocked!</h1>
                    </div>
                    <div class="content">
                        <h2>Congratulations %s!</h2>
                        <p>You've unlocked a new achievement:</p>
                        <h3 style="color: #667eea;">%s</h3>
                        <p>Keep playing to unlock more achievements!</p>
                        <a href="https://your-frontend-url.vercel.app/profile" class="button">
                            View Your Profile
                        </a>
                    </div>
                </div>
            </body>
            </html>
            """, username, achievement);
    }

    private String buildContactEmailHtml(String fromName, String fromEmail, String message) {
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); 
                              color: white; padding: 30px; text-align: center; border-radius: 10px; }
                    .content { padding: 30px; background: #f9f9f9; border-radius: 10px; margin-top: 20px; }
                    .info { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
                    .info-label { font-weight: bold; color: #667eea; }
                    .message-box { background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #667eea; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📧 New Contact Form Submission</h1>
                    </div>
                    <div class="content">
                        <p>You have received a new message from your Anime Guess Game contact form:</p>
                        
                        <div class="info">
                            <p><span class="info-label">Name:</span> %s</p>
                            <p><span class="info-label">Email:</span> <a href="mailto:%s">%s</a></p>
                        </div>
                        
                        <div class="message-box">
                            <p><span class="info-label">Message:</span></p>
                            <p>%s</p>
                        </div>
                        
                        <p style="margin-top: 30px; color: #666; font-size: 12px;">
                            This email was sent from the contact form on Anime Guess Game.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """, fromName, fromEmail, fromEmail, message.replace("\n", "<br>"));
    }
}

