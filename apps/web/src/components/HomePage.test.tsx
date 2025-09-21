import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders welcome message in Arabic', () => {
    const mockOnCategorySelect = vi.fn();
    render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    expect(screen.getByText('أهلاً وسهلاً')).toBeInTheDocument();
    expect(screen.getByText('اختر نوع الأذكار التي تريد قراءتها')).toBeInTheDocument();
  });

  it('renders morning and evening azkar categories', () => {
    const mockOnCategorySelect = vi.fn();
    render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    expect(screen.getByText('أذكار الصباح')).toBeInTheDocument();
    expect(screen.getByText('أذكار المساء')).toBeInTheDocument();
  });

  it('calls onCategorySelect when morning category is clicked', () => {
    const mockOnCategorySelect = vi.fn();
    render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    const morningButton = screen.getByText('أذكار الصباح').closest('button');
    fireEvent.click(morningButton!);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('morning');
  });

  it('calls onCategorySelect when evening category is clicked', () => {
    const mockOnCategorySelect = vi.fn();
    render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    const eveningButton = screen.getByText('أذكار المساء').closest('button');
    fireEvent.click(eveningButton!);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('evening');
  });

  it('displays app features in Arabic', () => {
    const mockOnCategorySelect = vi.fn();
    render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    expect(screen.getByText('مميزات التطبيق')).toBeInTheDocument();
    expect(screen.getByText('يعمل بدون اتصال بالإنترنت')).toBeInTheDocument();
    expect(screen.getByText('عداد تلقائي لكل ذكر')).toBeInTheDocument();
    expect(screen.getByText('تتبع التقدم اليومي')).toBeInTheDocument();
    expect(screen.getByText('نصوص أصيلة من حصن المسلم')).toBeInTheDocument();
  });
});