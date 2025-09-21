package com.azkar.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_ar", nullable = false)
    @NotBlank
    private String nameAr;

    @Column(nullable = false, unique = true)
    @NotBlank
    private String slug;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Zikr> azkar;
}