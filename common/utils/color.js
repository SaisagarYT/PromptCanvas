// PromptCanvas Color Utilities
// Color math, hex conversion & WCAG contrast calculation

(function (root) {
  'use strict';

  function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function hexToRgb(hex) {
    if (!hex) return { r: 0, g: 0, b: 0 };
    const clean = hex.replace('#', '');
    if (clean.length === 3) {
      return {
        r: parseInt(clean[0] + clean[0], 16) || 0,
        g: parseInt(clean[1] + clean[1], 16) || 0,
        b: parseInt(clean[2] + clean[2], 16) || 0
      };
    }
    const num = parseInt(clean, 16);
    if (isNaN(num)) return { r: 0, g: 0, b: 0 };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrastRatio(hex1, hex2) {
    const rgb1 = hexToRgb(hex1) || { r: 255, g: 255, b: 255 };
    const rgb2 = hexToRgb(hex2) || { r: 0, g: 0, b: 0 };
    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  function isLightColor(hex) {
    if (!hex) return false;
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 140;
  }

  const PCColorUtils = {
    hexToRgba,
    hexToRgb,
    getLuminance,
    getContrastRatio,
    isLightColor
  };

  root.PCColorUtils = PCColorUtils;
  // Backward compatibility globals
  root.hexToRgba = hexToRgba;
  root.hexToRgb = hexToRgb;
  root.getLuminance = getLuminance;
  root.getContrastRatio = getContrastRatio;
  root.isLightColor = isLightColor;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCColorUtils;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
