import { useState, useEffect, useRef } from 'react';
import './PaddingControl.css'

const PaddingControl = ({ ctaButtonRef }) => {
  const [padding, setPadding] = useState(16);
  const [unit, setUnit] = useState('px');

 
  useEffect(() => {
    if (ctaButtonRef?.current) {
      ctaButtonRef.current.style.padding = `${padding}${unit}`;
    }
  }, [padding, unit, ctaButtonRef]);

  const increasePadding = () => setPadding((prev) => prev + 1);
  const decreasePadding = () => setPadding((prev) => (prev > 0 ? prev - 1 : 0));
  const handlePaddingChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) setPadding(value >= 0 ? value : 0);
  };
  const changeUnit = (newUnit) => setUnit(newUnit);

  return (
    <div className="padding-control">
      <label htmlFor="padding-input">CTA Padding</label>

      <div>
        <button onClick={decreasePadding}>−</button>
        <input
          type="number"
          id="padding-input"
          value={padding}
          onChange={handlePaddingChange}
          min="0"
        />
        <span>{unit}</span>
        <button onClick={increasePadding}>+</button>
      </div>

      <div>
        {['px', 'rem', 'em', '%'].map((u) => (
          <button
            key={u}
            onClick={() => changeUnit(u)}
            className={unit === u ? 'active' : ''}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaddingControl;
