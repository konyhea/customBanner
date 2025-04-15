import React from "react";
import "./LineHeightControl.css";

export default function LineHeightControl({ targetRef }) {
  const handleLineHeightChange = (e) => {
    const value = e.target.value;
    if (!targetRef?.current || isNaN(value)) return;
    targetRef.current.style.lineHeight = value;
  };

  return (
    <div className="line-height-control">
      <label htmlFor="line-height">Line Height:</label>{" "}
      <input
        type="number"
        id="line-height"
        min="0.5"
        max="5"
        step="0.1"
        defaultValue="1.5"
        onChange={handleLineHeightChange}
      />
    </div>
  );
}
