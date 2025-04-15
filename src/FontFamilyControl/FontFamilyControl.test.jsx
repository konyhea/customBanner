import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FontFamilyControl from './FontFamilyControl';

const mockRef = {
  current: {
    style: {
      fontFamily: '',
    },
  },
};

describe('FontFamilyControl', () => {
  beforeEach(() => {
    mockRef.current.style.fontFamily = '';
  });

  it('renders all font options correctly', () => {
    render(<FontFamilyControl targetRef={mockRef} />);
    
    const select = screen.getByLabelText('Font Family:');
    expect(select).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(11); // 1 empty option + 10 default fonts
  });

  it('applies selected font family to target ref', () => {
    render(<FontFamilyControl targetRef={mockRef} />);
    
    const select = screen.getByLabelText('Font Family:');
    fireEvent.change(select, { target: { value: 'Arial' } });
    
    expect(mockRef.current.style.fontFamily).toBe('Arial');
  });

  it('each option has correct font family styling', () => {
    render(<FontFamilyControl targetRef={mockRef} />);
    
    const options = screen.getAllByRole('option');
    const arialOption = options.find(opt => opt.value === 'Arial');
    
    expect(arialOption).toHaveStyle('font-family: Arial');
  });

  it('handles missing ref gracefully', () => {
    // Mock console.error to avoid error logs in test output
    const originalError = console.error;
    console.error = vi.fn();
    
    render(<FontFamilyControl targetRef={{ current: null }} />);
    
    const select = screen.getByLabelText('Font Family:');
    fireEvent.change(select, { target: { value: 'Helvetica' } });
    
    expect(console.error).not.toHaveBeenCalled();
    console.error = originalError;
  });

  it('renders all default web fonts', () => {
    render(<FontFamilyControl targetRef={mockRef} />);
    
    const options = screen.getAllByRole('option');
    const fontValues = options.map(opt => opt.value);
    
    expect(fontValues).toEqual([
      '', // default empty option
      'Arial',
      'Helvetica',
      'Georgia',
      'Times New Roman',
      'Courier New',
      'Verdana',
      'Trebuchet MS',
      'Tahoma',
      'Impact',
      'Comic Sans MS'
    ]);
  });

  it('default value is empty string', () => {
    render(<FontFamilyControl targetRef={mockRef} />);
    
    const select = screen.getByLabelText('Font Family:');
    expect(select.value).toBe('');
  });
});