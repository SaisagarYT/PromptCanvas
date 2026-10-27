// PromptCanvas ChatGPT Theme CSS Builder
// Aggregates modular CSS generators

(function (root) {
  'use strict';

  const PCThemeCSS = root.PCThemeCSS || {};

  function buildAll(ctx) {
    const sections = [
      PCThemeCSS.tokens ? PCThemeCSS.tokens(ctx) : '',
      PCThemeCSS.layout ? PCThemeCSS.layout(ctx) : '',
      PCThemeCSS.sidebar ? PCThemeCSS.sidebar(ctx) : '',
      PCThemeCSS.messages ? PCThemeCSS.messages(ctx) : '',
      PCThemeCSS.composer ? PCThemeCSS.composer(ctx) : '',
      PCThemeCSS.dialogs ? PCThemeCSS.dialogs(ctx) : '',
      PCThemeCSS.starters ? PCThemeCSS.starters(ctx) : '',
      PCThemeCSS.codeblocks ? PCThemeCSS.codeblocks(ctx) : ''
    ];
    return sections.filter(Boolean).join('\n');
  }

  PCThemeCSS.buildAll = buildAll;
  root.PCThemeCSS = PCThemeCSS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCThemeCSS;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
