import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import TextAlignControl from './TextAlignment';

describe('TextAlignControl', () => {
  // Mock target ref
  const mockRef = {
    current: {
      style: {
        textAlign: '',
      },
    },
  };

  it('renders all alignment options', () => {
    const { getByLabelText } = render(
      <TextAlignControl targetRef={mockRef} />
    );
    
    const select = getByLabelText('Text Align:');
    expect(select).toBeInTheDocument();
    
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[0].value).toBe('left');
    expect(options[1].value).toBe('center');
    expect(options[2].value).toBe('right');
    expect(options[3].value).toBe('justify');
  });

  it('applies selected alignment to target ref', () => {
    const { getByLabelText } = render(
      <TextAlignControl targetRef={mockRef} />
    );
    
    const select = getByLabelText('Text Align:');
    
    // Test center alignment
    fireEvent.change(select, { target: { value: 'center' } });
    expect(mockRef.current.style.textAlign).toBe('center');
    
    // Test right alignment
    fireEvent.change(select, { target: { value: 'right' } });
    expect(mockRef.current.style.textAlign).toBe('right');
  });

  it('handles missing target ref gracefully', () => {
    // Mock console.error to avoid error logs in test output
    const originalError = console.error;
    console.error = vi.fn();
    
    const { getByLabelText } = render(
      <TextAlignControl targetRef={{ current: null }} />
    );
    
    const select = getByLabelText('Text Align:');
    fireEvent.change(select, { target: { value: 'justify' } });
    
    // Verify no errors were thrown
    expect(console.error).not.toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalError;
  });

  it('has left alignment as default', () => {
    const { getByLabelText } = render(
      <TextAlignControl targetRef={mockRef} />
    );
    
    const select = getByLabelText('Text Align:');
    expect(select.value).toBe('left');
  });
});