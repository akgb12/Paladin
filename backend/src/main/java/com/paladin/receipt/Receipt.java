package com.paladin.receipt;

import java.util.ArrayList;
import java.util.List;

public class Receipt {

    private String id;
    private String merchantRaw;
    private String merchantNormalized;
    private String receiptDate;
    private String uploadTimestamp;
    private Double subtotal;
    private Double tax;
    private Double total;
    private String currency;
    private String imageUrl;
    private String imageStorageKey;
    private ReceiptStatus status;
    private Double confidence;
    private boolean manuallyCorrected;
    private List<ReceiptItem> items = new ArrayList<>();

    public Receipt() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMerchantRaw() { return merchantRaw; }
    public void setMerchantRaw(String merchantRaw) { this.merchantRaw = merchantRaw; }

    public String getMerchantNormalized() { return merchantNormalized; }
    public void setMerchantNormalized(String merchantNormalized) { this.merchantNormalized = merchantNormalized; }

    public String getReceiptDate() { return receiptDate; }
    public void setReceiptDate(String receiptDate) { this.receiptDate = receiptDate; }

    public String getUploadTimestamp() { return uploadTimestamp; }
    public void setUploadTimestamp(String uploadTimestamp) { this.uploadTimestamp = uploadTimestamp; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getImageStorageKey() { return imageStorageKey; }
    public void setImageStorageKey(String imageStorageKey) { this.imageStorageKey = imageStorageKey; }

    public ReceiptStatus getStatus() { return status; }
    public void setStatus(ReceiptStatus status) { this.status = status; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public boolean isManuallyCorrected() { return manuallyCorrected; }
    public void setManuallyCorrected(boolean manuallyCorrected) { this.manuallyCorrected = manuallyCorrected; }

    public List<ReceiptItem> getItems() { return items; }
    public void setItems(List<ReceiptItem> items) { this.items = items; }
}
