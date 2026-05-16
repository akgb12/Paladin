package com.paladin.textract;

public interface ReceiptExtractionService {

    ExtractedReceipt extract(byte[] imageBytes, String contentType);
}
