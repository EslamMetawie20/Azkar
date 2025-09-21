package com.azkar.backend.repository;

import com.azkar.backend.entity.Zikr;
import com.azkar.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZikrRepository extends JpaRepository<Zikr, Long> {
    List<Zikr> findByCategoryOrderByOrderIndexAsc(Category category);
    List<Zikr> findByCategorySlugOrderByOrderIndexAsc(String categorySlug);
}