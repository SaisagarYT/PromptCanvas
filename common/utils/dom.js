// PromptCanvas DOM & String Utilities

(function (root) {
  'use strict';

  function escapeHtml(text) {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.textContent = text || '';
      return div.innerHTML;
    }
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const PCDomUtils = {
    escapeHtml
  };

  root.PCDomUtils = PCDomUtils;
  root.escapeHtml = escapeHtml;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCDomUtils;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
