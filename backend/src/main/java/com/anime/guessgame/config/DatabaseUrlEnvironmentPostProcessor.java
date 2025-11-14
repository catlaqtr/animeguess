package com.anime.guessgame.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.Profiles;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * EnvironmentPostProcessor that converts Render's PostgreSQL connection string
 * to JDBC format before Spring Boot's auto-configuration reads it.
 * 
 * This runs very early in the Spring Boot lifecycle, before any beans are created.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Only process in production profile
        if (!environment.acceptsProfiles(Profiles.of("prod"))) {
            return;
        }

        String databaseUrl = environment.getProperty("DATABASE_URL");
        
        System.out.println("DatabaseUrlEnvironmentPostProcessor: DATABASE_URL = " + 
            (databaseUrl != null ? databaseUrl.replaceAll(":[^:@]+@", ":****@") : "null"));
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Check if it's in postgresql:// format (Render format)
            if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
                System.out.println("DatabaseUrlEnvironmentPostProcessor: Detected postgresql:// format, converting...");
                try {
                    URI uri = new URI(databaseUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String dbName = path.startsWith("/") ? path.substring(1) : path;
                    
                    System.out.println("DatabaseUrlEnvironmentPostProcessor: Parsed - host=" + host + ", port=" + port + ", dbName=" + dbName);
                    
                    // Extract username and password from userInfo
                    String userInfo = uri.getUserInfo();
                    if (userInfo != null && userInfo.contains(":")) {
                        String[] credentials = userInfo.split(":", 2);
                        String username = credentials[0];
                        String password = credentials[1];
                        
                        // Convert to JDBC format
                        String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
                        
                        System.out.println("DatabaseUrlEnvironmentPostProcessor: Converted JDBC URL = " + 
                            jdbcUrl.replaceAll(":[^:@]+@", ":****@"));
                        
                        Map<String, Object> properties = new HashMap<>();
                        // Set DataSource properties
                        properties.put("spring.datasource.url", jdbcUrl);
                        properties.put("spring.datasource.username", username);
                        properties.put("spring.datasource.password", password);
                        
                        // Also set Flyway properties to use the converted JDBC URL
                        properties.put("spring.flyway.url", jdbcUrl);
                        properties.put("spring.flyway.user", username);
                        properties.put("spring.flyway.password", password);
                        
                        // Override DATABASE_URL to prevent direct reads
                        properties.put("DATABASE_URL", jdbcUrl);
                        
                        environment.getPropertySources().addFirst(
                            new MapPropertySource("databaseUrlConversion", properties)
                        );
                        
                        System.out.println("DatabaseUrlEnvironmentPostProcessor: Conversion completed successfully");
                    } else {
                        // If no userInfo, try to use DATABASE_USERNAME and DATABASE_PASSWORD
                        String username = environment.getProperty("DATABASE_USERNAME", "");
                        String password = environment.getProperty("DATABASE_PASSWORD", "");
                        
                        if (!username.isEmpty() && !password.isEmpty()) {
                            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
                            
                            System.out.println("DatabaseUrlEnvironmentPostProcessor: Using DATABASE_USERNAME/PASSWORD, JDBC URL = " + 
                                jdbcUrl.replaceAll(":[^:@]+@", ":****@"));
                            
                            Map<String, Object> properties = new HashMap<>();
                            properties.put("spring.datasource.url", jdbcUrl);
                            properties.put("spring.datasource.username", username);
                            properties.put("spring.datasource.password", password);
                            properties.put("spring.flyway.url", jdbcUrl);
                            properties.put("spring.flyway.user", username);
                            properties.put("spring.flyway.password", password);
                            properties.put("DATABASE_URL", jdbcUrl);
                            
                            environment.getPropertySources().addFirst(
                                new MapPropertySource("databaseUrlConversion", properties)
                            );
                        } else {
                            System.err.println("DatabaseUrlEnvironmentPostProcessor: No credentials found in URL or environment variables");
                        }
                    }
                } catch (Exception e) {
                    System.err.println("DatabaseUrlEnvironmentPostProcessor: Failed to parse DATABASE_URL: " + e.getMessage());
                    System.err.println("DatabaseUrlEnvironmentPostProcessor: DATABASE_URL value: " + databaseUrl);
                    e.printStackTrace();
                }
            } else if (databaseUrl.startsWith("jdbc:postgresql://")) {
                System.out.println("DatabaseUrlEnvironmentPostProcessor: DATABASE_URL already in JDBC format, no conversion needed");
            }
        } else {
            System.err.println("DatabaseUrlEnvironmentPostProcessor: DATABASE_URL is null or empty");
        }
    }
}

