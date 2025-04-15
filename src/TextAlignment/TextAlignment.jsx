import React from "react";
import "./TextAlignControl.css";

const alignmentOptions = ["left", "center", "right", "justify"];

export default function TextAlignControl({ targetRef }) {
  const applyTextAlign = (alignment) => {
    if (!targetRef?.current) return;
    targetRef.current.style.textAlign = alignment;
  };

  return (
    <div className="text-align-control">
      <label htmlFor="text-align">Text Align:</label>{" "}
      <select
        id="text-align"
        onChange={(e) => applyTextAlign(e.target.value)}
        defaultValue="left"
      >
        {alignmentOptions.map((align) => (
          <option key={align} value={align}>
            {align.charAt(0).toUpperCase() + align.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
