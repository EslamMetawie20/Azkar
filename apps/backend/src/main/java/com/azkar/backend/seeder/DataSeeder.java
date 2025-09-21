package com.azkar.backend.seeder;

import com.azkar.backend.entity.Category;
import com.azkar.backend.entity.Zikr;
import com.azkar.backend.repository.CategoryRepository;
import com.azkar.backend.repository.ZikrRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ZikrRepository zikrRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        if (categoryRepository.count() > 0) {
            log.info("Database already seeded, skipping data import");
            return;
        }

        log.info("Starting data seeding from hisn_almuslim.json");
        seedData();
        log.info("Data seeding completed successfully");
    }

    private void seedData() throws IOException {
        ClassPathResource resource = new ClassPathResource("data/hisn_almuslim.json");
        JsonNode rootNode = objectMapper.readTree(resource.getInputStream());

        // Create categories for morning and evening azkar
        Category morningCategory = createCategory("أذكار الصباح", "morning", 1);
        Category eveningCategory = createCategory("أذكار المساء", "evening", 2);

        // Find the combined morning/evening azkar section
        JsonNode azkarSection = rootNode.get("أذكار الصباح والمساء");
        if (azkarSection != null && azkarSection.has("text")) {
            processAzkarTexts(azkarSection, morningCategory, eveningCategory);
        }

        log.info("Created {} categories and {} azkar",
                categoryRepository.count(), zikrRepository.count());
    }

    private Category createCategory(String nameAr, String slug, int orderIndex) {
        Category category = new Category();
        category.setNameAr(nameAr);
        category.setSlug(slug);
        category.setOrderIndex(orderIndex);
        return categoryRepository.save(category);
    }

    private void processAzkarTexts(JsonNode azkarSection, Category morningCategory, Category eveningCategory) {
        JsonNode textArray = azkarSection.get("text");
        JsonNode footnoteArray = azkarSection.get("footnote");

        List<Zikr> morningAzkar = new ArrayList<>();
        List<Zikr> eveningAzkar = new ArrayList<>();

        int orderIndex = 1;
        for (JsonNode textNode : textArray) {
            String text = textNode.asText().trim();
            if (text.isEmpty()) continue;

            String footnote = getFootnoteForIndex(footnoteArray, orderIndex - 1);
            int repeatCount = extractRepeatCount(text);

            // Clean the text by removing repeat indicators
            String cleanText = cleanText(text);

            // Create zikr for both morning and evening
            Zikr morningZikr = createZikr(morningCategory, cleanText, footnote, repeatCount, orderIndex);
            Zikr eveningZikr = createZikr(eveningCategory, cleanText, footnote, repeatCount, orderIndex);

            morningAzkar.add(morningZikr);
            eveningAzkar.add(eveningZikr);
            orderIndex++;
        }

        zikrRepository.saveAll(morningAzkar);
        zikrRepository.saveAll(eveningAzkar);

        log.info("Processed {} azkar for morning and evening", orderIndex - 1);
    }

    private String getFootnoteForIndex(JsonNode footnoteArray, int index) {
        if (footnoteArray != null && footnoteArray.isArray() && index < footnoteArray.size()) {
            return footnoteArray.get(index).asText();
        }
        return null;
    }

    private int extractRepeatCount(String text) {
        // Look for Arabic or English numbers followed by "مرات" or "مرة"
        Pattern arabicPattern = Pattern.compile("([٠-٩]+)\\s*مرا?ت?");
        Pattern englishPattern = Pattern.compile("(\\d+)\\s*مرا?ت?");
        Pattern parenthesesPattern = Pattern.compile("\\(\\s*(.*?)\\s*مرا?ت?\\s*\\)");

        // Try parentheses pattern first
        Matcher parenthesesMatcher = parenthesesPattern.matcher(text);
        if (parenthesesMatcher.find()) {
            String numberText = parenthesesMatcher.group(1).trim();
            return parseArabicNumber(numberText);
        }

        // Try Arabic numbers
        Matcher arabicMatcher = arabicPattern.matcher(text);
        if (arabicMatcher.find()) {
            return parseArabicNumber(arabicMatcher.group(1));
        }

        // Try English numbers
        Matcher englishMatcher = englishPattern.matcher(text);
        if (englishMatcher.find()) {
            try {
                return Integer.parseInt(englishMatcher.group(1));
            } catch (NumberFormatException e) {
                // Continue to default
            }
        }

        // Check for specific text patterns
        if (text.contains("ثلاث مرات") || text.contains("ثلاث")) {
            return 3;
        }
        if (text.contains("سبع مرات") || text.contains("سبع")) {
            return 7;
        }
        if (text.contains("عشر مرات") || text.contains("عشر")) {
            return 10;
        }
        if (text.contains("مائة مرة") || text.contains("مائة")) {
            return 100;
        }
        if (text.contains("أربع مرات") || text.contains("أربع")) {
            return 4;
        }

        return 1; // Default
    }

    private int parseArabicNumber(String arabicNumber) {
        // Convert Arabic numerals to regular numbers
        String englishNumber = arabicNumber
                .replace("٠", "0")
                .replace("١", "1")
                .replace("٢", "2")
                .replace("٣", "3")
                .replace("٤", "4")
                .replace("٥", "5")
                .replace("٦", "6")
                .replace("٧", "7")
                .replace("٨", "8")
                .replace("٩", "9");

        // Handle written numbers
        switch (englishNumber.trim()) {
            case "ثلاث": case "ثلاثة": return 3;
            case "أربع": case "أربعة": return 4;
            case "خمس": case "خمسة": return 5;
            case "ست": case "ستة": return 6;
            case "سبع": case "سبعة": return 7;
            case "ثمان": case "ثمانية": return 8;
            case "تسع": case "تسعة": return 9;
            case "عشر": case "عشرة": return 10;
            case "مائة": return 100;
            default:
                try {
                    return Integer.parseInt(englishNumber);
                } catch (NumberFormatException e) {
                    return 1;
                }
        }
    }

    private String cleanText(String text) {
        // Remove repeat count patterns
        text = text.replaceAll("\\(\\s*.*?\\s*مرا?ت?\\s*\\)", "").trim();
        text = text.replaceAll("([٠-٩]+|\\d+)\\s*مرا?ت?", "").trim();
        text = text.replaceAll("(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر|مائة)\\s*مرا?ت?", "").trim();

        // Clean extra whitespace
        text = text.replaceAll("\\s+", " ").trim();

        return text;
    }

    private Zikr createZikr(Category category, String text, String footnote, int repeatCount, int orderIndex) {
        Zikr zikr = new Zikr();
        zikr.setCategory(category);
        zikr.setTextAr(text);
        zikr.setFootnoteAr(footnote);
        zikr.setRepeatMin(repeatCount);
        zikr.setOrderIndex(orderIndex);
        return zikr;
    }
}