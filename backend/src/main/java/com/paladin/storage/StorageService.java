package com.paladin.storage;

public interface StorageService {

    String store(String receiptId, String contentType, byte[] imageBytes);

    byte[] retrieve(String storageKey);

    void delete(String storageKey);
}
