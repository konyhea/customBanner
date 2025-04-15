import React from "react";
import "./FontFamilyControl.css"

const defaultWebFonts = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Tahoma",
  "Impact",
  "Comic Sans MS",
];

export default function FontFamilyControl({ targetRef }) {
  const applyFontFamily = (family) => {
    if (!targetRef?.current) return;
    targetRef.current.style.fontFamily = family;
  };

  return (
    <div>
      <label htmlFor="font-family">Font Family:</label>{" "}
      <select
        id="font-family"
        onChange={(e) => applyFontFamily(e.target.value)}
        defaultValue=""
      >
        {defaultWebFonts.map((font) => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </select>
    </div>
  );
}
