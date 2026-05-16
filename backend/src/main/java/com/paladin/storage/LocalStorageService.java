package com.paladin.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@Profile("local")
public class LocalStorageService implements StorageService {

    private final Path storageRoot;

    public LocalStorageService(@Value("${paladin.local-storage-dir:./local-data/receipts}") String dir) throws IOException {
        this.storageRoot = Paths.get(dir);
        Files.createDirectories(storageRoot);
    }

    @Override
    public String store(String receiptId, String contentType, byte[] imageBytes) {
        String ext = extensionFor(contentType);
        String filename = receiptId + ext;
        Path target = storageRoot.resolve(filename);
        try {
            Files.write(target, imageBytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to write image to local storage", e);
        }
        return "receipts/local/" + filename;
    }

    @Override
    public byte[] retrieve(String storageKey) {
        String filename = storageKey.substring(storageKey.lastIndexOf('/') + 1);
        try {
            return Files.readAllBytes(storageRoot.resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image from local storage", e);
        }
    }

    @Override
    public void delete(String storageKey) {
        String filename = storageKey.substring(storageKey.lastIndexOf('/') + 1);
        try {
            Files.deleteIfExists(storageRoot.resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from local storage", e);
        }
    }

    private String extensionFor(String contentType) {
        if (contentType == null) return ".jpg";
        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/gif" -> ".gif";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }
}
