// PromptCanvas ChatGPT Theme CSS - Code Blocks & Typography

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.codeblocks = function (ctx) {
    const {
      c, theme, isWp, glassBlur, sidebarStyle, inputBarStyle,
      swatches, c1, c2, c3, c4, baseColor, primary, secondary, tertiary,
      userText, rootBg, border, secondaryBorder, sidebarHover, secondaryHover,
      isLight, sidebarItemColor, sidebarItemActiveColor, sidebarBtnColor,
      sbMode, sbBlur, sbBorderEnabled, sidebarBgCss, sidebarBorderCss,
      ibMode, ibBlur, ibBorderAccent, ibActionAccent, ibToolAccent, composerBgCss,
      hexToRgba
    } = ctx;

    return `
        /* ==========================================================================
           8. CODE BLOCKS (Single Outer Shell - Eradicates Concentric Nested Borders)
           ========================================================================== */
        /* Single Outermost Container ONLY - strictly scoped to code blocks containing pre */
        div.contain-inline-size:has(pre),
        div[class*="contain-inline-size"]:has(pre),
        div[class*="code-block"]:has(pre) {
          background-color: ${isWp ? hexToRgba(baseColor, 0.88) : c.background} !important;
          background: ${isWp ? hexToRgba(baseColor, 0.88) : c.background} !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35) !important;
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          overflow: hidden !important;
          margin: 14px 0 !important;
        }

        /* Strictly Eradicate ALL Concentric Nested Borders, Shadows & Margins on Inner Elements */
        div.contain-inline-size:has(pre) div,
        div.contain-inline-size:has(pre) pre,
        div.contain-inline-size:has(pre) code,
        div[class*="contain-inline-size"]:has(pre) div,
        div[class*="contain-inline-size"]:has(pre) pre,
        div[class*="contain-inline-size"]:has(pre) code {
          border: none !important;
          box-shadow: none !important;
          margin: 0 !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* Top Code Header Bar (Language Name & Copy Buttons) */
        div.contain-inline-size:has(pre) > div > div:first-child,
        div[class*="contain-inline-size"]:has(pre) > div > div:first-child {
          background: rgba(255, 255, 255, 0.05) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-radius: 0 !important;
          color: #CBD5E1 !important;
          padding: 8px 14px !important;
        }

        /* Copy code button in code blocks */
        div.contain-inline-size:has(pre) > div > div:first-child button {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          color: #94A3B8 !important;
          padding: 3px 8px !important;
          border-radius: 4px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          cursor: pointer !important;
          transition: all 0.15s ease !important;
        }

        div.contain-inline-size:has(pre) > div > div:first-child button:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          color: #FFFFFF !important;
        }

        div.contain-inline-size:has(pre) > div > div:first-child button svg {
          color: inherit !important;
          width: 14px !important;
          height: 14px !important;
        }

        /* Typography inside code blocks */
        div.contain-inline-size code,
        div[class*="contain-inline-size"] code,
        pre:not(#promptcanvas-root *) code,
        pre span,
        code span {
          color: #F8FAFC !important;
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace !important;
          font-size: 13.5px !important;
          line-height: 1.6 !important;
        }

        /* Headings & Text Contrast */
        h1, h2, h3, [class*="text-2xl"], [class*="text-3xl"] {
          color: #FFFFFF !important;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.7) !important;
        }

        /* Scrollbars */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${sidebarHover}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${primary}; }
`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.codeblocks;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
