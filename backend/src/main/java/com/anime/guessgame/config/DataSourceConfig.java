package com.anime.guessgame.config;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.lang.NonNull;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * DataSource Configuration
 * 
 * Handles conversion of Render's PostgreSQL connection string format
 * (postgresql://user:pass@host:port/dbname) to JDBC format
 * (jdbc:postgresql://host:port/dbname)
 * 
 * This listener runs early in the application startup to convert the connection
 * string before Spring Boot's DataSource auto-configuration reads it.
 */
@Configuration
@Profile("prod")
public class DataSourceConfig implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    @Override
    public void onApplicationEvent(@NonNull ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment environment = event.getEnvironment();
        String databaseUrl = environment.getProperty("DATABASE_URL");
        
        System.out.println("DataSourceConfig: DATABASE_URL = " + (databaseUrl != null ? databaseUrl.replaceAll(":[^:@]+@", ":****@") : "null"));
        
        if (databaseUrl != null && !databaseUrl.isEmpty()) {
            // Check if it's in postgresql:// format (Render format)
            if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
                System.out.println("DataSourceConfig: Detected postgresql:// format, converting...");
                try {
                    URI uri = new URI(databaseUrl);
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String path = uri.getPath();
                    String dbName = path.startsWith("/") ? path.substring(1) : path;
                    
                    System.out.println("DataSourceConfig: Parsed - host=" + host + ", port=" + port + ", dbName=" + dbName);
                    
                    // Extract username and password from userInfo
                    String userInfo = uri.getUserInfo();
                    if (userInfo != null && userInfo.contains(":")) {
                        String[] credentials = userInfo.split(":", 2);
                        String username = credentials[0];
                        String password = credentials[1];
                        
                        // Convert to JDBC format and set as properties
                        String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
                        
                        Map<String, Object> properties = new HashMap<>();
                        // Set DataSource properties
                        properties.put("spring.datasource.url", jdbcUrl);
                        properties.put("spring.datasource.username", username);
                        properties.put("spring.datasource.password", password);
                        
                        // Also set Flyway properties to use the converted JDBC URL
                        properties.put("spring.flyway.url", jdbcUrl);
                        properties.put("spring.flyway.user", username);
                        properties.put("spring.flyway.password", password);
                        
                        System.out.println("DataSourceConfig: Converted JDBC URL = " + jdbcUrl.replaceAll(":[^:@]+@", ":****@"));
                        System.out.println("DataSourceConfig: Setting properties for DataSource and Flyway");
                        
                        // Also override DATABASE_URL to prevent any direct reads
                        properties.put("DATABASE_URL", jdbcUrl);
                        
                        environment.getPropertySources().addFirst(
                            new MapPropertySource("databaseUrlConversion", properties)
                        );
                        
                        System.out.println("DataSourceConfig: Conversion completed successfully");
                    } else {
                        // If no userInfo, try to use DATABASE_USERNAME and DATABASE_PASSWORD
                        String username = environment.getProperty("DATABASE_USERNAME", "");
                        String password = environment.getProperty("DATABASE_PASSWORD", "");
                        
                        if (!username.isEmpty() && !password.isEmpty()) {
                            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
                            
                            Map<String, Object> properties = new HashMap<>();
                            properties.put("spring.datasource.url", jdbcUrl);
                            properties.put("spring.datasource.username", username);
                            properties.put("spring.datasource.password", password);
                            properties.put("spring.flyway.url", jdbcUrl);
                            properties.put("spring.flyway.user", username);
                            properties.put("spring.flyway.password", password);
                            
                            environment.getPropertySources().addFirst(
                                new MapPropertySource("databaseUrlConversion", properties)
                            );
                        }
                    }
                } catch (Exception e) {
                    // If parsing fails, log and continue with original values
                    System.err.println("Failed to parse DATABASE_URL: " + e.getMessage());
                    System.err.println("DATABASE_URL value: " + databaseUrl);
                    e.printStackTrace();
                }
            }
            // If already in jdbc: format, no conversion needed
        }
    }
}

