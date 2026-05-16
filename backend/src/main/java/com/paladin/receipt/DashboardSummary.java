package com.paladin.receipt;

import java.util.List;

public class DashboardSummary {

    private int receiptCount;
    private int merchantCount;
    private double totalSpend;
    private List<MonthlySpend> monthlySpend;
    private List<MerchantSpend> merchantSpend;

    public DashboardSummary(int receiptCount, int merchantCount, double totalSpend,
                            List<MonthlySpend> monthlySpend, List<MerchantSpend> merchantSpend) {
        this.receiptCount = receiptCount;
        this.merchantCount = merchantCount;
        this.totalSpend = totalSpend;
        this.monthlySpend = monthlySpend;
        this.merchantSpend = merchantSpend;
    }

    public int getReceiptCount() { return receiptCount; }
    public int getMerchantCount() { return merchantCount; }
    public double getTotalSpend() { return totalSpend; }
    public List<MonthlySpend> getMonthlySpend() { return monthlySpend; }
    public List<MerchantSpend> getMerchantSpend() { return merchantSpend; }

    public static class MonthlySpend {
        private String month;
        private double total;
        public MonthlySpend(String month, double total) { this.month = month; this.total = total; }
        public String getMonth() { return month; }
        public double getTotal() { return total; }
    }

    public static class MerchantSpend {
        private String merchantNormalized;
        private double total;
        public MerchantSpend(String merchantNormalized, double total) { this.merchantNormalized = merchantNormalized; this.total = total; }
        public String getMerchantNormalized() { return merchantNormalized; }
        public double getTotal() { return total; }
    }
}
