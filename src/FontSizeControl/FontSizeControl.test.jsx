import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FontSizeControl from './FontSizeControl';

describe('FontSizeControl', () => {
  const mockRef = {
    current: {
      style: {
        fontSize: '',
      },
    },
  };

  beforeEach(() => {
    // Reset mock before each test
    mockRef.current.style.fontSize = '';
  });

  it('renders all controls correctly', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    
    expect(screen.getByLabelText('Font Size')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue(18);
    expect(screen.getByText('-')).toBeInTheDocument();
    expect(screen.getByText('+')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('updates font size through input', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const input = screen.getByRole('spinbutton');
    
    fireEvent.change(input, { target: { value: '20' } });
    expect(input).toHaveValue(20);
    expect(mockRef.current.style.fontSize).toBe('20px');
  });

  it('increases font size when + button is clicked', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const input = screen.getByRole('spinbutton');
    const plusBtn = screen.getByText('+');
    
    fireEvent.click(plusBtn);
    expect(input).toHaveValue(19);
    expect(mockRef.current.style.fontSize).toBe('19px');
  });

  it('decreases font size when - button is clicked', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const input = screen.getByRole('spinbutton');
    const minusBtn = screen.getByText('-');
    
    fireEvent.click(minusBtn);
    expect(input).toHaveValue(17);
    expect(mockRef.current.style.fontSize).toBe('17px');
  });

  it('updates font size when preset is selected', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: '24' } });
    expect(screen.getByRole('spinbutton')).toHaveValue(24);
    expect(mockRef.current.style.fontSize).toBe('24px');
  });

  it('handles keyboard input with Enter key', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const input = screen.getByRole('spinbutton');
    
    fireEvent.change(input, { target: { value: '15' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockRef.current.style.fontSize).toBe('15px');
  });

  it('ignores invalid input values', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const input = screen.getByRole('spinbutton');
    
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(input).toHaveValue(null); // Input becomes null with invalid value
    expect(mockRef.current.style.fontSize).toBe(''); // No update to ref
  });

  it('handles missing ref gracefully', () => {
    const originalError = console.error;
    console.error = jest.fn();
    
    render(<FontSizeControl targetRef={{ current: null }} />);
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '20' } });
    
    expect(console.error).not.toHaveBeenCalled();
    console.error = originalError;
  });

  it('renders all preset sizes in dropdown', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const options = screen.getAllByRole('option');
    
    // +1 for the "Select Size" option
    expect(options).toHaveLength(9); 
    expect(options[1]).toHaveValue('12');
    expect(options[8]).toHaveValue('32');
  });

  it('maintains input value when preset is deselected', () => {
    render(<FontSizeControl targetRef={mockRef} />);
    const select = screen.getByRole('combobox');
    const input = screen.getByRole('spinbutton');
    
    // Set to a preset value first
    fireEvent.change(select, { target: { value: '20' } });
    expect(input).toHaveValue(20);
    
    // Then select empty option
    fireEvent.change(select, { target: { value: '' } });
    expect(input).toHaveValue(20); // Should maintain previous value
  });
});