package com.azkar.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "azkar")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Zikr {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonIgnore
    private Category category;

    @Column(name = "text_ar", nullable = false, length = 5000)
    @NotBlank
    private String textAr;

    @Column(name = "footnote_ar", length = 1000)
    private String footnoteAr;

    @Column(name = "repeat_min", nullable = false)
    @Min(1)
    private Integer repeatMin;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
}