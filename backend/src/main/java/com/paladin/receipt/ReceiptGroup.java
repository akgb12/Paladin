package com.paladin.receipt;

import java.util.List;

public class ReceiptGroup {

    private String merchantNormalized;
    private List<Receipt> receipts;
    private int count;
    private double totalSpend;

    public ReceiptGroup(String merchantNormalized, List<Receipt> receipts) {
        this.merchantNormalized = merchantNormalized;
        this.receipts = receipts;
        this.count = receipts.size();
        double sum = 0.0;
        for (Receipt r : receipts) {
            if (r.getTotal() != null) sum += r.getTotal();
        }
        this.totalSpend = sum;
    }

    public String getMerchantNormalized() { return merchantNormalized; }
    public List<Receipt> getReceipts() { return receipts; }
    public int getCount() { return count; }
    public double getTotalSpend() { return totalSpend; }
}
