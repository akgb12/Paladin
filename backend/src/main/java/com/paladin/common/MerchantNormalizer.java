package com.paladin.common;

import java.util.Map;
import java.util.regex.Pattern;

public class MerchantNormalizer {

    private static final Pattern STORE_NUMBER = Pattern.compile("\\s*[#@]\\s*\\d+.*$");
    private static final Pattern EXTRA_SPACES = Pattern.compile("\\s+");

    private static final Map<String, String> ALIASES = Map.of(
            "WAL-MART", "Walmart",
            "WALMART SUPERCENTER", "Walmart",
            "WM SUPERCENTER", "Walmart",
            "WALMART", "Walmart",
            "TARGET", "Target",
            "H-E-B", "H-E-B",
            "HEB", "H-E-B"
    );

    // Strips store numbers, applies alias map, converts to title case
    public static String normalize(String raw) {
        if (raw == null || raw.isBlank()) return "Unknown";

        String upper = raw.trim().toUpperCase();

        for (Map.Entry<String, String> entry : ALIASES.entrySet()) {
            if (upper.startsWith(entry.getKey())) return entry.getValue();
        }

        String cleaned = STORE_NUMBER.matcher(raw.trim()).replaceAll("");
        cleaned = EXTRA_SPACES.matcher(cleaned).replaceAll(" ").trim();
        return toTitleCase(cleaned);
    }

    private static String toTitleCase(String input) {
        if (input == null || input.isEmpty()) return input;
        String[] words = input.toLowerCase().split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String word : words) {
            if (!word.isEmpty()) {
                sb.append(Character.toUpperCase(word.charAt(0)));
                sb.append(word.substring(1));
                sb.append(" ");
            }
        }
        return sb.toString().trim();
    }
}
