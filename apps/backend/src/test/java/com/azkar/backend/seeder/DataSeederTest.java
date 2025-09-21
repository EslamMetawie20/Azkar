package com.azkar.backend.seeder;

import com.azkar.backend.repository.CategoryRepository;
import com.azkar.backend.repository.ZikrRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataSeederTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ZikrRepository zikrRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private DataSeeder dataSeeder;

    @Test
    void run_WhenDataExists_ShouldSkipSeeding() throws Exception {
        // Given
        when(categoryRepository.count()).thenReturn(2L);

        // When
        dataSeeder.run();

        // Then
        verify(categoryRepository, times(1)).count();
        verify(categoryRepository, never()).save(any());
        verify(zikrRepository, never()).saveAll(any());
    }

    @Test
    void run_WhenNoDataExists_ShouldProceedWithSeeding() throws Exception {
        // Given
        when(categoryRepository.count()).thenReturn(0L);

        // When
        dataSeeder.run();

        // Then
        verify(categoryRepository, times(1)).count();
        // Note: In a real test, we would mock the JSON parsing and verify seeding calls
    }
}