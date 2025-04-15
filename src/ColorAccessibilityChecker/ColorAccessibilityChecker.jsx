import React, { useEffect } from 'react';
import tinycolor from 'tinycolor2';
import { toast } from 'sonner';

const ColorAccessibilityChecker = ({ textColor, backgroundColor }) => {
  useEffect(() => {
    if (!textColor || !backgroundColor) return;

    try {
      const ratio = tinycolor.readability(textColor, backgroundColor);
      const isAA = tinycolor.isReadable(textColor, backgroundColor, { level: 'AA' });
      const isAAA = tinycolor.isReadable(textColor, backgroundColor, { level: 'AAA' });

      // Show long-lasting error toast if contrast is too low
      if (!isAA) {
        toast.error('Low contrast between text and background!', {
          duration: 10000, 
          important: true, 
        });
      } else if (!isAAA) {
        toast.warning('Moderate contrast (AA pass, AAA fail)', {
          duration: 6000, //
        });
      }
    } catch (error) {
      toast.error('Invalid color values', {
        duration: 8000,
      });
    }
  }, [textColor, backgroundColor]);

  return null;
};

export default ColorAccessibilityChecker;
