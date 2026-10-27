// PromptCanvas ChatGPT Theme CSS - Home Page Starter Cards & Prompt Chips

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.starters = function (ctx) {
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
           7. HOME PAGE PROMPT SUGGESTIONS & STARTER CARDS (Premium, Ultra-Visible)
           ========================================================================== */
        /* Starter suggestion buttons ONLY (strictly scoped to tagged starter chips, NEVER chat messages) */
        [data-pc-starter="true"],
        button[data-pc-starter="true"],
        a[data-pc-starter="true"],
        button[data-testid*="prompt-suggestion"],
        button[data-testid*="starter"],
        [data-testid="use-case-prompt-chips"] button {
          color: #F8FAFC !important;
          background: ${isWp ? 'rgba(18, 16, 26, 0.86)' : hexToRgba(baseColor, 0.90)} !important;
          background-color: ${isWp ? 'rgba(18, 16, 26, 0.86)' : hexToRgba(baseColor, 0.90)} !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 14px !important;
          padding: 10px 16px !important;
          font-size: 13.5px !important;
          font-weight: 500 !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          cursor: pointer !important;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1) !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 10px !important;
        }

        /* Inner text elements inside starter cards */
        [data-pc-starter="true"] :is(span, p, div, b, strong),
        button[data-testid*="prompt-suggestion"] :is(span, p, div),
        button[data-testid*="starter"] :is(span, p, div),
        [data-testid="use-case-prompt-chips"] button :is(span, p, div) {
          color: #F8FAFC !important;
          font-weight: 500 !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* SVG Icons in starter cards: Clean Crisp Accent */
        [data-pc-starter="true"] svg,
        button[data-testid*="prompt-suggestion"] svg,
        button[data-testid*="starter"] svg,
        [data-testid="use-case-prompt-chips"] button svg {
          color: ${primary} !important;
          stroke: currentColor !important;
          filter: none !important;
          transition: transform 0.22s ease !important;
          flex-shrink: 0 !important;
        }

        /* Starter card hover: Clean lift & Theme Accent Border, Zero Fuzzy Glow */
        [data-pc-starter="true"]:hover,
        button[data-testid*="prompt-suggestion"]:hover,
        button[data-testid*="starter"]:hover,
        [data-testid="use-case-prompt-chips"] button:hover {
          background: ${isWp ? 'rgba(28, 25, 40, 0.96)' : hexToRgba(baseColor, 0.96)} !important;
          background-color: ${isWp ? 'rgba(28, 25, 40, 0.96)' : hexToRgba(baseColor, 0.96)} !important;
          border-color: ${primary} !important;
          color: #FFFFFF !important;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45) !important;
          transform: translateY(-2px) !important;
        }

        [data-pc-starter="true"]:hover svg,
        button[data-testid*="prompt-suggestion"]:hover svg,
        button[data-testid*="starter"]:hover svg,
        [data-testid="use-case-prompt-chips"] button:hover svg {
          transform: scale(1.10) !important;
          filter: none !important;
        }

        /* Active attachment chip under composer */
        form div[class*="rounded"]:has(button[aria-label*="close" i]),
        form div[class*="rounded"]:has(button[aria-label*="Remove" i]),
        form div[class*="bg-token-main-surface-secondary"]:has(button) {
          background: ${hexToRgba(baseColor, 0.92)} !important;
          border: 1px solid ${border} !important;
          border-radius: 14px !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
        }


        /* Bottom Disclaimer Text */
        div[class*="text-token-text-secondary"],
        div[class*="text-token-text-tertiary"],
        div[class*="text-xs"],
        div[class*="text-[11px]"] {
          color: rgba(248, 250, 252, 0.72) !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85) !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.starters;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
