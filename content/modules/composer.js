// PromptCanvas Composer Module
// Handles direct prompt injection into ChatGPT

(function (root) {
  'use strict';

  const PCComposer = {
    insert(text, platform, btnEl) {
      const textarea = document.querySelector('#prompt-textarea') ||
                       document.querySelector('.ProseMirror') ||
                       document.querySelector('textarea[placeholder]') ||
                       document.querySelector('textarea, [contenteditable="true"]');

      if (textarea) {
        if (textarea.tagName === 'TEXTAREA' || textarea.tagName === 'INPUT') {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set ||
                         Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
          if (setter) {
            setter.call(textarea, text);
          } else {
            textarea.value = text;
          }
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          textarea.focus();
          textarea.innerHTML = '';
          document.execCommand('insertText', false, text);
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
        textarea.focus();

        if (btnEl) {
          const originalHTML = btnEl.innerHTML;
          btnEl.classList.add('pc-inserted');
          btnEl.innerHTML = `<span>Inserted ✓</span>`;
          setTimeout(() => {
            btnEl.classList.remove('pc-inserted');
            btnEl.innerHTML = originalHTML;
          }, 1200);
        }

        return true;
      }

      // Fallback: Copy to clipboard if composer not visible
      navigator.clipboard.writeText(text);
      return false;
    }
  };

  root.PCComposer = PCComposer;
})(typeof window !== 'undefined' ? window : this);
