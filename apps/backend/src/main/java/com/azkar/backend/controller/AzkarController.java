package com.azkar.backend.controller;

import com.azkar.backend.entity.Zikr;
import com.azkar.backend.service.ZikrService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/azkar")
@RequiredArgsConstructor
@Tag(name = "Azkar", description = "Azkar and Duas management endpoints")
@CrossOrigin(origins = "*")
public class AzkarController {

    private final ZikrService zikrService;

    @GetMapping
    @Operation(summary = "Get azkar by category", description = "Retrieve azkar for a specific category (morning or evening)")
    public ResponseEntity<List<Zikr>> getAzkarByCategory(
            @RequestParam @Parameter(description = "Category slug (morning or evening)", example = "morning") String category) {

        List<Zikr> azkar = zikrService.getAzkarByCategorySlug(category);
        return ResponseEntity.ok(azkar);
    }
}