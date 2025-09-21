package com.azkar.backend.service;

import com.azkar.backend.entity.Zikr;
import com.azkar.backend.entity.Category;
import com.azkar.backend.repository.ZikrRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZikrService {

    private final ZikrRepository zikrRepository;

    public List<Zikr> getAzkarByCategory(Category category) {
        return zikrRepository.findByCategoryOrderByOrderIndexAsc(category);
    }

    public List<Zikr> getAzkarByCategorySlug(String categorySlug) {
        return zikrRepository.findByCategorySlugOrderByOrderIndexAsc(categorySlug);
    }
}