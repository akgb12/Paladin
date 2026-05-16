package com.paladin.textract;

import java.util.List;

public class ExtractedReceipt {

    private String merchantRaw;
    private String receiptDate;
    private Double subtotal;
    private Double tax;
    private Double total;
    private String currency;
    private Double confidence;
    private List<ExtractedItem> items;

    public String getMerchantRaw() { return merchantRaw; }
    public void setMerchantRaw(String merchantRaw) { this.merchantRaw = merchantRaw; }

    public String getReceiptDate() { return receiptDate; }
    public void setReceiptDate(String receiptDate) { this.receiptDate = receiptDate; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public List<ExtractedItem> getItems() { return items; }
    public void setItems(List<ExtractedItem> items) { this.items = items; }

    public static class ExtractedItem {
        private String name;
        private Double quantity;
        private Double unitPrice;
        private Double totalPrice;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public Double getQuantity() { return quantity; }
        public void setQuantity(Double quantity) { this.quantity = quantity; }

        public Double getUnitPrice() { return unitPrice; }
        public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

        public Double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    }
}
