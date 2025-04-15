import React, { useState } from 'react';
import './FontSizeControl.css';

const presetSizes = [12, 14, 16, 18, 20, 24, 28, 32];

export default function FontSizeControl({ targetRef }) {
  const [fontSize, setFontSize] = useState(18);

  const applyFontSize = (size) => {
    if (!targetRef?.current) return;
    targetRef.current.style.fontSize = `${size}px`;
    setFontSize(size);
  };

  const handleInputChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (!isNaN(newSize)) applyFontSize(newSize);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission/page refresh
      const newSize = parseInt(e.target.value, 10);
      if (!isNaN(newSize)) applyFontSize(newSize);
    }
  };

  return (
    <div 
      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} // Additional safety
    >
      <label htmlFor="font-size-input">Font Size</label> {" "}
      <button onClick={() => applyFontSize(fontSize - 1)}>-</button>
      <input
        id="font-size-input"
        type="number"
        value={fontSize}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        style={{ width: '60px' }}
      />
      <button onClick={() => applyFontSize(fontSize + 1)}>+</button>

      <select
        onChange={(e) => applyFontSize(Number(e.target.value))}
        value={fontSize}
      >
        <option value="">Select Size</option>
        {presetSizes.map((size) => (
          <option key={size} value={size}>
            {size}px
          </option>
        ))}
      </select>
    </div>
  );
}