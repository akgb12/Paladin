package com.paladin.receipt;

import com.paladin.textract.ExtractedReceipt;
import com.paladin.common.MerchantNormalizer;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ReceiptMapper {

    // Builds a new Receipt from an upload input and extracted data
    public static Receipt fromUpload(UploadReceiptInput input, ExtractedReceipt extracted, String storageKey) {
        Receipt r = new Receipt();
        r.setId("rec_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12));
        r.setUploadTimestamp(Instant.now().toString());
        r.setImageStorageKey(storageKey);
        r.setManuallyCorrected(false);
        r.setCurrency(extracted.getCurrency() != null ? extracted.getCurrency() : "USD");

        if (extracted.getMerchantRaw() != null) {
            r.setMerchantRaw(extracted.getMerchantRaw());
            r.setMerchantNormalized(MerchantNormalizer.normalize(extracted.getMerchantRaw()));
        } else {
            r.setMerchantRaw("Unknown");
            r.setMerchantNormalized("Unknown");
        }

        r.setReceiptDate(extracted.getReceiptDate());
        r.setSubtotal(extracted.getSubtotal());
        r.setTax(extracted.getTax());
        r.setTotal(extracted.getTotal());
        r.setConfidence(extracted.getConfidence());

        if (extracted.getConfidence() != null && extracted.getConfidence() < 0.75) {
            r.setStatus(ReceiptStatus.NEEDS_REVIEW);
        } else {
            r.setStatus(ReceiptStatus.EXTRACTED);
        }

        List<ReceiptItem> items = new ArrayList<>();
        if (extracted.getItems() != null) {
            for (ExtractedReceipt.ExtractedItem ei : extracted.getItems()) {
                items.add(new ReceiptItem(ei.getName(), ei.getQuantity(), ei.getUnitPrice(), ei.getTotalPrice()));
            }
        }
        r.setItems(items);
        return r;
    }

    public static Receipt applyUpdate(Receipt existing, UpdateReceiptInput input) {
        if (input.getMerchantNormalized() != null) existing.setMerchantNormalized(input.getMerchantNormalized());
        if (input.getReceiptDate() != null) existing.setReceiptDate(input.getReceiptDate());
        if (input.getSubtotal() != null) existing.setSubtotal(input.getSubtotal());
        if (input.getTax() != null) existing.setTax(input.getTax());
        if (input.getTotal() != null) existing.setTotal(input.getTotal());
        if (input.getCurrency() != null) existing.setCurrency(input.getCurrency());
        if (input.getItems() != null) {
            List<ReceiptItem> items = new ArrayList<>();
            for (ReceiptItemInput ii : input.getItems()) {
                items.add(new ReceiptItem(ii.getName(), ii.getQuantity(), ii.getUnitPrice(), ii.getTotalPrice()));
            }
            existing.setItems(items);
        }
        existing.setManuallyCorrected(true);
        existing.setStatus(ReceiptStatus.CORRECTED);
        return existing;
    }
}
