package com.paladin.receipt;

import com.paladin.auth.CurrentUserProvider;
import com.paladin.auth.User;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ReceiptGraphQLController {

    private final ReceiptService receiptService;
    private final CurrentUserProvider currentUserProvider;

    public ReceiptGraphQLController(ReceiptService receiptService, CurrentUserProvider currentUserProvider) {
        this.receiptService = receiptService;
        this.currentUserProvider = currentUserProvider;
    }

    @QueryMapping
    public User me() {
        return currentUserProvider.getCurrentUser();
    }

    @QueryMapping
    public List<Receipt> receipts() {
        return receiptService.getAllReceipts();
    }

    @QueryMapping
    public Receipt receipt(@Argument String id) {
        return receiptService.getReceiptById(id).orElse(null);
    }

    @QueryMapping
    public List<Receipt> receiptsByMerchant(@Argument String merchant) {
        return receiptService.getReceiptsByMerchant(merchant);
    }

    @QueryMapping
    public List<ReceiptGroup> receiptGroups() {
        return receiptService.getReceiptGroups();
    }

    @QueryMapping
    public List<Receipt> searchReceipts(@Argument ReceiptSearchInput input) {
        return receiptService.searchReceipts(input);
    }

    @QueryMapping
    public DashboardSummary dashboardSummary() {
        return receiptService.getDashboardSummary();
    }

    @MutationMapping
    public Receipt uploadReceipt(@Argument UploadReceiptInput input) {
        return receiptService.upload(input);
    }

    @MutationMapping
    public Receipt updateReceipt(@Argument UpdateReceiptInput input) {
        return receiptService.update(input);
    }

    @MutationMapping
    public Boolean deleteReceipt(@Argument String id) {
        return receiptService.delete(id);
    }
}
