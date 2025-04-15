import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LineHeightControl from './LineHeightControl';

describe('LineHeightControl', () => {
    const mockRef = {
      current: {
        style: {
          lineHeight: '',
        },
      },
    };
  
    beforeEach(() => {
      // Reset the mock ref before each test
      mockRef.current.style.lineHeight = '';
    });
  
    it('renders correctly with default values', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      
      expect(screen.getByLabelText('Line Height:')).toBeInTheDocument();
      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('min', '0.5');
      expect(input).toHaveAttribute('max', '5');
      expect(input).toHaveAttribute('step', '0.1');
      expect(input).toHaveValue(1.5);
    });
  
    it('updates line height when value changes', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '1.8' } });
      expect(input).toHaveValue(1.8);
      expect(mockRef.current.style.lineHeight).toBe('1.8');
    });
  
    it('handles decimal values correctly', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '2.5' } });
      expect(input).toHaveValue(2.5);
      expect(mockRef.current.style.lineHeight).toBe('2.5');
    });
  
    it('respects minimum value (0.5)', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '0.4' } });
      // Most browsers will clamp the value to min
      expect(parseFloat(input.value)).toBeGreaterThanOrEqual(0.5);
      expect(mockRef.current.style.lineHeight).not.toBe('0.4');
    });
  
    it('respects maximum value (5)', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '5.1' } });
      // Most browsers will clamp the value to max
      expect(parseFloat(input.value)).toBeLessThanOrEqual(5);
      expect(mockRef.current.style.lineHeight).not.toBe('5.1');
    });
  
    it('does not update ref when input is NaN', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: 'invalid' } });
      expect(mockRef.current.style.lineHeight).toBe('');
    });
  
    it('handles missing ref gracefully', () => {
      // Mock console.error to avoid error logs in test output
      const originalError = console.error;
      console.error = vi.fn();
      
      render(<LineHeightControl targetRef={{ current: null }} />);
      
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '1.2' } });
      
      // Verify no errors were thrown
      expect(console.error).not.toHaveBeenCalled();
      
      // Restore console.error
      console.error = originalError;
    });
  
    it('maintains default value when input is cleared', () => {
      render(<LineHeightControl targetRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '' } });
      expect(input.value).toBe(''); // Input is empty
      expect(mockRef.current.style.lineHeight).toBe(''); // No update to ref
      
      // When focus leaves, the value should return to default (if browser doesn't handle it)
      fireEvent.blur(input);
      expect(input).toHaveValue(1.5); // This might vary based on browser behavior
    });
});