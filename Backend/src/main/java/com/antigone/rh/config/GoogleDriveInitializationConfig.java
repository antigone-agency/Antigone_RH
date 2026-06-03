package com.antigone.rh.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import jakarta.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;

/**
 * Initializes Google Drive service account credentials from base64-encoded
 * environment variable.
 * 
 * In production (Render), set GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_B64 env var with
 * the base64-encoded JSON.
 * Locally, use the service-account.json file directly in the classpath.
 */
@Configuration
@Slf4j
public class GoogleDriveInitializationConfig {

    private static final String KEY_B64_ENV = "GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY_B64";
    private static final String KEY_FILE = "service-account.json";

    @PostConstruct
    public void initializeServiceAccountKey() {
        String b64Key = System.getenv(KEY_B64_ENV);

        if (b64Key == null || b64Key.trim().isEmpty()) {
            log.info("No base64-encoded Google service account key found. Using local file (if exists): {}", KEY_FILE);
            return;
        }

        try {
            log.info("Decoding base64 Google service account key from env var: {}", KEY_B64_ENV);

            // Decode base64
            byte[] decodedBytes = Base64.getDecoder().decode(b64Key);
            String jsonContent = new String(decodedBytes);

            // Write to file
            Files.write(Paths.get(KEY_FILE), jsonContent.getBytes());
            log.info("Service account key written to: {}", KEY_FILE);

        } catch (IllegalArgumentException e) {
            log.error("Invalid base64 encoding for {}: {}", KEY_B64_ENV, e.getMessage());
        } catch (Exception e) {
            log.error("Failed to initialize Google Drive service account key: {}", e.getMessage(), e);
        }
    }
}
