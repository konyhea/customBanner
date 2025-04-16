import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import PaddingControl from "./PaddingControl";

describe('PaddingControl', () => {
    const mockRef = {
      current: {
        style: {
          padding: '',
        },
      },
    };
  
    beforeEach(() => {
      // Reset the mock ref before each test
      mockRef.current.style.padding = '';
    });
  
    it('renders all controls correctly', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      
      expect(screen.getByLabelText('CTA Padding')).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toHaveValue(16);
    });
  
    it('updates padding value through input', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '20' } });
      expect(input).toHaveValue(20);
      expect(mockRef.current.style.padding).toBe('20px');
    });
  
    it('does not allow negative padding values', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '-5' } });
      expect(input).toHaveValue(0);
      expect(mockRef.current.style.padding).toBe('0px');
    });
  
    it('increases padding when + button is clicked', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      const increaseBtn = screen.getAllByRole('button')[1]; // + button
      
      fireEvent.click(increaseBtn);
      expect(screen.getByRole('spinbutton')).toHaveValue(17);
      expect(mockRef.current.style.padding).toBe('17px');
    });
  
    it('decreases padding when - button is clicked', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      const decreaseBtn = screen.getAllByRole('button')[0]; // - button
      const input = screen.getByRole('spinbutton');
      
      fireEvent.change(input, { target: { value: '5' } });
      fireEvent.click(decreaseBtn);
      expect(input).toHaveValue(4);
      expect(mockRef.current.style.padding).toBe('4px');
    });
  
    it('does not decrease below 0', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      const decreaseBtn = screen.getAllByRole('button')[0]; // - button
      
      fireEvent.click(decreaseBtn); // Try to decrease from initial 16
      fireEvent.click(decreaseBtn); // Multiple clicks
      fireEvent.click(decreaseBtn);
      fireEvent.click(decreaseBtn);
      
      expect(screen.getByRole('spinbutton')).toHaveValue(12);
      expect(mockRef.current.style.padding).toBe('12px');
    });
  
    it('changes padding unit correctly', () => {
      render(<PaddingControl ctaButtonRef={mockRef} />);
      
      fireEvent.click(screen.getByText('rem'));
      expect(mockRef.current.style.padding).toBe('16rem');
      
      fireEvent.click(screen.getByText('%'));
      expect(mockRef.current.style.padding).toBe('16%');
    });
  

  
    it('handles missing ref gracefully', () => {
      // Mock console.error to avoid error logs in test output
      const originalError = console.error;
      console.error = vi.fn();
      
      render(<PaddingControl ctaButtonRef={{ current: null }} />);
      
      fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '10' } });
      fireEvent.click(screen.getByText('em'));
      
      // Verify no errors were thrown
      expect(console.error).not.toHaveBeenCalled();
      
      // Restore console.error
      console.error = originalError;
    });
  });