package com.paladin.receipt;

import java.util.List;

public class UpdateReceiptInput {

    private String id;
    private String merchantNormalized;
    private String receiptDate;
    private Double subtotal;
    private Double tax;
    private Double total;
    private String currency;
    private List<ReceiptItemInput> items;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMerchantNormalized() { return merchantNormalized; }
    public void setMerchantNormalized(String merchantNormalized) { this.merchantNormalized = merchantNormalized; }

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

    public List<ReceiptItemInput> getItems() { return items; }
    public void setItems(List<ReceiptItemInput> items) { this.items = items; }
}
