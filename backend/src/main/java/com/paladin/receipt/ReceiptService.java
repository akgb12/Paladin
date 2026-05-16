package com.paladin.receipt;

import com.paladin.dynamodb.ReceiptDynamoDbRepository;
import com.paladin.storage.StorageService;
import com.paladin.textract.ExtractedReceipt;
import com.paladin.textract.ReceiptExtractionService;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.*;

@Service
public class ReceiptService {

    private final ReceiptDynamoDbRepository repository;
    private final StorageService storageService;
    private final ReceiptExtractionService extractionService;

    public ReceiptService(ReceiptDynamoDbRepository repository,
                          StorageService storageService,
                          ReceiptExtractionService extractionService) {
        this.repository = repository;
        this.storageService = storageService;
        this.extractionService = extractionService;
    }

    public Receipt upload(UploadReceiptInput input) {
        byte[] imageBytes = Base64.getDecoder().decode(input.getBase64Image());
        ExtractedReceipt extracted = extractionService.extract(imageBytes, input.getContentType());
        String tempId = "rec_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String storageKey = storageService.store(tempId, input.getContentType(), imageBytes);
        Receipt receipt = ReceiptMapper.fromUpload(input, extracted, storageKey);
        receipt.setId(tempId);
        receipt.setImageUrl("/api/images/" + storageKey.substring(storageKey.lastIndexOf('/') + 1));
        return repository.save(receipt);
    }

    public List<Receipt> getAllReceipts() {
        return repository.findAll();
    }

    public Optional<Receipt> getReceiptById(String id) {
        return repository.findById(id);
    }

    public List<Receipt> getReceiptsByMerchant(String merchant) {
        return repository.findByMerchant(merchant);
    }

    public List<ReceiptGroup> getReceiptGroups() {
        List<Receipt> all = repository.findAll();
        Map<String, List<Receipt>> grouped = new LinkedHashMap<>();
        for (Receipt r : all) {
            grouped.computeIfAbsent(r.getMerchantNormalized(), k -> new ArrayList<>()).add(r);
        }
        List<ReceiptGroup> groups = new ArrayList<>();
        for (Map.Entry<String, List<Receipt>> entry : grouped.entrySet()) {
            List<Receipt> sorted = new ArrayList<>(entry.getValue());
            sorted.sort(Comparator.comparing(
                    r -> r.getReceiptDate() != null ? r.getReceiptDate() : "",
                    Comparator.reverseOrder()));
            groups.add(new ReceiptGroup(entry.getKey(), sorted));
        }
        return groups;
    }

    public List<Receipt> searchReceipts(ReceiptSearchInput input) {
        List<Receipt> all = repository.findAll();
        List<Receipt> result = new ArrayList<>();
        for (Receipt r : all) {
            if (!matchesSearch(r, input)) continue;
            result.add(r);
        }
        return result;
    }

    public Receipt update(UpdateReceiptInput input) {
        Receipt existing = repository.findById(input.getId())
                .orElseThrow(() -> new RuntimeException("Receipt not found: " + input.getId()));
        Receipt updated = ReceiptMapper.applyUpdate(existing, input);
        return repository.save(updated);
    }

    public boolean delete(String id) {
        repository.delete(id);
        return true;
    }

    public DashboardSummary getDashboardSummary() {
        List<Receipt> all = repository.findAll();
        Set<String> merchants = new HashSet<>();
        double totalSpend = 0.0;
        Map<String, Double> monthMap = new TreeMap<>();
        Map<String, Double> merchantMap = new LinkedHashMap<>();

        for (Receipt r : all) {
            merchants.add(r.getMerchantNormalized());
            double t = r.getTotal() != null ? r.getTotal() : 0.0;
            totalSpend += t;

            if (r.getReceiptDate() != null && r.getReceiptDate().length() >= 7) {
                String month = r.getReceiptDate().substring(0, 7);
                monthMap.merge(month, t, Double::sum);
            }

            merchantMap.merge(r.getMerchantNormalized(), t, Double::sum);
        }

        List<DashboardSummary.MonthlySpend> monthly = new ArrayList<>();
        for (Map.Entry<String, Double> e : monthMap.entrySet()) {
            monthly.add(new DashboardSummary.MonthlySpend(e.getKey(), e.getValue()));
        }

        List<DashboardSummary.MerchantSpend> merchantSpend = new ArrayList<>();
        for (Map.Entry<String, Double> e : merchantMap.entrySet()) {
            merchantSpend.add(new DashboardSummary.MerchantSpend(e.getKey(), e.getValue()));
        }
        merchantSpend.sort(Comparator.comparingDouble(DashboardSummary.MerchantSpend::getTotal).reversed());

        return new DashboardSummary(all.size(), merchants.size(), totalSpend, monthly, merchantSpend);
    }

    private boolean matchesSearch(Receipt r, ReceiptSearchInput input) {
        if (input.getMerchant() != null && !input.getMerchant().isEmpty()) {
            String m = input.getMerchant().toLowerCase();
            boolean nameMatch = r.getMerchantNormalized().toLowerCase().contains(m)
                    || (r.getMerchantRaw() != null && r.getMerchantRaw().toLowerCase().contains(m));
            if (!nameMatch) return false;
        }
        if (input.getItemName() != null && !input.getItemName().isEmpty()) {
            String itemSearch = input.getItemName().toLowerCase();
            boolean found = false;
            for (ReceiptItem item : r.getItems()) {
                if (item.getName().toLowerCase().contains(itemSearch)) { found = true; break; }
            }
            if (!found) return false;
        }
        if (input.getStartDate() != null && r.getReceiptDate() != null
                && r.getReceiptDate().compareTo(input.getStartDate()) < 0) return false;
        if (input.getEndDate() != null && r.getReceiptDate() != null
                && r.getReceiptDate().compareTo(input.getEndDate()) > 0) return false;
        if (input.getMinTotal() != null && (r.getTotal() == null || r.getTotal() < input.getMinTotal())) return false;
        if (input.getMaxTotal() != null && (r.getTotal() == null || r.getTotal() > input.getMaxTotal())) return false;
        return true;
    }
}
