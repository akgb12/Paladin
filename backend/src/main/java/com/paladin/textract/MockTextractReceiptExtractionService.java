package com.paladin.textract;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Profile("local")
public class MockTextractReceiptExtractionService implements ReceiptExtractionService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private List<ExtractedReceipt> samples;
    private final AtomicInteger counter = new AtomicInteger(0);

    @PostConstruct
    public void loadSamples() throws IOException {
        ClassPathResource resource = new ClassPathResource("mock-textract/samples.json");
        samples = objectMapper.readValue(resource.getInputStream(), new TypeReference<>() {});
    }

    @Override
    public ExtractedReceipt extract(byte[] imageBytes, String contentType) {
        // Round-robin through sample receipts for deterministic variety
        int index = counter.getAndIncrement() % samples.size();
        return samples.get(index);
    }
}
