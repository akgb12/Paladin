package com.paladin.dynamodb;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.paladin.receipt.Receipt;
import com.paladin.receipt.ReceiptItem;
import com.paladin.receipt.ReceiptStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import jakarta.annotation.PostConstruct;
import java.util.*;

@Repository
public class ReceiptDynamoDbRepository {

    private static final String USER_PK = "USER#demo";
    private static final String RECEIPT_SK_PREFIX = "RECEIPT#";

    private final DynamoDbClient dynamoDb;
    private final String tableName;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ReceiptDynamoDbRepository(DynamoDbClient dynamoDb,
                                     @Value("${paladin.dynamodb.table:PaladinReceipts}") String tableName) {
        this.dynamoDb = dynamoDb;
        this.tableName = tableName;
    }

    @PostConstruct
    public void ensureTableExists() {
        try {
            dynamoDb.describeTable(DescribeTableRequest.builder().tableName(tableName).build());
        } catch (ResourceNotFoundException e) {
            createTable();
        }
    }

    private void createTable() {
        dynamoDb.createTable(CreateTableRequest.builder()
                .tableName(tableName)
                .keySchema(
                        KeySchemaElement.builder().attributeName("PK").keyType(KeyType.HASH).build(),
                        KeySchemaElement.builder().attributeName("SK").keyType(KeyType.RANGE).build())
                .attributeDefinitions(
                        AttributeDefinition.builder().attributeName("PK").attributeType(ScalarAttributeType.S).build(),
                        AttributeDefinition.builder().attributeName("SK").attributeType(ScalarAttributeType.S).build(),
                        AttributeDefinition.builder().attributeName("GSI1PK").attributeType(ScalarAttributeType.S).build(),
                        AttributeDefinition.builder().attributeName("GSI1SK").attributeType(ScalarAttributeType.S).build())
                .globalSecondaryIndexes(GlobalSecondaryIndex.builder()
                        .indexName("GSI1")
                        .keySchema(
                                KeySchemaElement.builder().attributeName("GSI1PK").keyType(KeyType.HASH).build(),
                                KeySchemaElement.builder().attributeName("GSI1SK").keyType(KeyType.RANGE).build())
                        .projection(Projection.builder().projectionType(ProjectionType.ALL).build())
                        .provisionedThroughput(ProvisionedThroughput.builder().readCapacityUnits(5L).writeCapacityUnits(5L).build())
                        .build())
                .provisionedThroughput(ProvisionedThroughput.builder().readCapacityUnits(5L).writeCapacityUnits(5L).build())
                .build());
    }

    public Receipt save(Receipt receipt) {
        String sk = RECEIPT_SK_PREFIX + safe(receipt.getReceiptDate()) + "#" + receipt.getId();
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("PK", s(USER_PK));
        item.put("SK", s(sk));
        item.put("receiptId", s(receipt.getId()));
        item.put("merchantRaw", s(receipt.getMerchantRaw()));
        item.put("merchantNormalized", s(receipt.getMerchantNormalized()));
        item.put("receiptDate", s(receipt.getReceiptDate()));
        item.put("uploadTimestamp", s(receipt.getUploadTimestamp()));
        item.put("imageStorageKey", s(receipt.getImageStorageKey()));
        item.put("status", s(receipt.getStatus().name()));
        item.put("manuallyCorrected", bool(receipt.isManuallyCorrected()));
        item.put("currency", s(receipt.getCurrency() != null ? receipt.getCurrency() : "USD"));
        item.put("GSI1PK", s("MERCHANT#" + receipt.getMerchantNormalized()));
        item.put("GSI1SK", s("DATE#" + safe(receipt.getReceiptDate()) + "#" + receipt.getId()));

        if (receipt.getSubtotal() != null) item.put("subtotal", n(receipt.getSubtotal()));
        if (receipt.getTax() != null) item.put("tax", n(receipt.getTax()));
        if (receipt.getTotal() != null) item.put("total", n(receipt.getTotal()));
        if (receipt.getConfidence() != null) item.put("confidence", n(receipt.getConfidence()));

        try {
            item.put("items", s(objectMapper.writeValueAsString(receipt.getItems())));
        } catch (JsonProcessingException e) {
            item.put("items", s("[]"));
        }

        dynamoDb.putItem(PutItemRequest.builder().tableName(tableName).item(item).build());
        return receipt;
    }

    public List<Receipt> findAll() {
        QueryRequest request = QueryRequest.builder()
                .tableName(tableName)
                .keyConditionExpression("PK = :pk AND begins_with(SK, :skPrefix)")
                .expressionAttributeValues(Map.of(
                        ":pk", s(USER_PK),
                        ":skPrefix", s(RECEIPT_SK_PREFIX)))
                .scanIndexForward(false)
                .build();
        List<Map<String, AttributeValue>> items = dynamoDb.query(request).items();
        List<Receipt> receipts = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            receipts.add(toReceipt(item));
        }
        return receipts;
    }

    public Optional<Receipt> findById(String receiptId) {
        List<Receipt> all = findAll();
        for (Receipt r : all) {
            if (receiptId.equals(r.getId())) return Optional.of(r);
        }
        return Optional.empty();
    }

    public List<Receipt> findByMerchant(String merchantNormalized) {
        QueryRequest request = QueryRequest.builder()
                .tableName(tableName)
                .indexName("GSI1")
                .keyConditionExpression("GSI1PK = :gsi1pk")
                .expressionAttributeValues(Map.of(":gsi1pk", s("MERCHANT#" + merchantNormalized)))
                .scanIndexForward(false)
                .build();
        List<Map<String, AttributeValue>> items = dynamoDb.query(request).items();
        List<Receipt> receipts = new ArrayList<>();
        for (Map<String, AttributeValue> item : items) {
            receipts.add(toReceipt(item));
        }
        return receipts;
    }

    public void delete(String receiptId) {
        Optional<Receipt> found = findById(receiptId);
        found.ifPresent(r -> {
            String sk = RECEIPT_SK_PREFIX + safe(r.getReceiptDate()) + "#" + r.getId();
            dynamoDb.deleteItem(DeleteItemRequest.builder()
                    .tableName(tableName)
                    .key(Map.of("PK", s(USER_PK), "SK", s(sk)))
                    .build());
        });
    }

    private Receipt toReceipt(Map<String, AttributeValue> item) {
        Receipt r = new Receipt();
        r.setId(str(item, "receiptId"));
        r.setMerchantRaw(str(item, "merchantRaw"));
        r.setMerchantNormalized(str(item, "merchantNormalized"));
        r.setReceiptDate(str(item, "receiptDate"));
        r.setUploadTimestamp(str(item, "uploadTimestamp"));
        r.setImageStorageKey(str(item, "imageStorageKey"));
        r.setCurrency(str(item, "currency"));
        r.setManuallyCorrected(item.containsKey("manuallyCorrected") && item.get("manuallyCorrected").bool());

        String statusStr = str(item, "status");
        if (statusStr != null) r.setStatus(ReceiptStatus.valueOf(statusStr));

        if (item.containsKey("subtotal")) r.setSubtotal(Double.parseDouble(item.get("subtotal").n()));
        if (item.containsKey("tax")) r.setTax(Double.parseDouble(item.get("tax").n()));
        if (item.containsKey("total")) r.setTotal(Double.parseDouble(item.get("total").n()));
        if (item.containsKey("confidence")) r.setConfidence(Double.parseDouble(item.get("confidence").n()));

        String itemsJson = str(item, "items");
        if (itemsJson != null && !itemsJson.isEmpty()) {
            try {
                List<ReceiptItem> items = objectMapper.readValue(itemsJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, ReceiptItem.class));
                r.setItems(items);
            } catch (Exception e) {
                r.setItems(new ArrayList<>());
            }
        }
        return r;
    }

    private AttributeValue s(String v) { return AttributeValue.builder().s(v != null ? v : "").build(); }
    private AttributeValue n(Double v) { return AttributeValue.builder().n(String.valueOf(v)).build(); }
    private AttributeValue bool(boolean v) { return AttributeValue.builder().bool(v).build(); }
    private String str(Map<String, AttributeValue> item, String key) {
        AttributeValue v = item.get(key);
        return (v != null && v.s() != null) ? v.s() : null;
    }
    private String safe(String v) { return v != null ? v : "0000-00-00"; }
}
