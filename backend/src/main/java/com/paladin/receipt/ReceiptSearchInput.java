package com.paladin.receipt;

public class ReceiptSearchInput {

    private String merchant;
    private String itemName;
    private String startDate;
    private String endDate;
    private Double minTotal;
    private Double maxTotal;

    public String getMerchant() { return merchant; }
    public void setMerchant(String merchant) { this.merchant = merchant; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public Double getMinTotal() { return minTotal; }
    public void setMinTotal(Double minTotal) { this.minTotal = minTotal; }

    public Double getMaxTotal() { return maxTotal; }
    public void setMaxTotal(Double maxTotal) { this.maxTotal = maxTotal; }
}
