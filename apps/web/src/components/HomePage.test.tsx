import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders welcome message in Arabic', () => {
    const mockOnCategorySelect = vi.fn();
    const { getByText } = render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    expect(getByText('أهلاً وسهلاً')).toBeInTheDocument();
    expect(getByText('اختر نوع الأذكار التي تريد قراءتها')).toBeInTheDocument();
  });

  it('renders morning and evening azkar categories', () => {
    const mockOnCategorySelect = vi.fn();
    const { getByText } = render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    expect(getByText('أذكار الصباح')).toBeInTheDocument();
    expect(getByText('أذكار المساء')).toBeInTheDocument();
  });

  it('calls onCategorySelect when morning category is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCategorySelect = vi.fn();
    const { getByText } = render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    const morningButton = getByText('أذكار الصباح').closest('button');
    await user.click(morningButton!);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('morning');
  });

  it('calls onCategorySelect when evening category is clicked', async () => {
    const user = userEvent.setup();
    const mockOnCategorySelect = vi.fn();
    const { getByText } = render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    const eveningButton = getByText('أذكار المساء').closest('button');
    await user.click(eveningButton!);

    expect(mockOnCategorySelect).toHaveBeenCalledWith('evening');
  });

  it('displays app features in Arabic', () => {
    const mockOnCategorySelect = vi.fn();
    const { getByText } = render(<HomePage onCategorySelect={mockOnCategorySelect} />);

    expect(getByText('مميزات التطبيق')).toBeInTheDocument();
    expect(getByText('يعمل بدون اتصال بالإنترنت')).toBeInTheDocument();
    expect(getByText('عداد تلقائي لكل ذكر')).toBeInTheDocument();
    expect(getByText('تتبع التقدم اليومي')).toBeInTheDocument();
    expect(getByText('نصوص أصيلة من حصن المسلم')).toBeInTheDocument();
  });
});