// PromptCanvas ChatGPT Theme CSS - Dialogs, Modals, Popovers & Tooltips

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.dialogs = function (ctx) {
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
           6. SETTINGS & MODAL DIALOGS (Theme Harmony)
           ========================================================================== */
        [role="dialog"],
        [data-testid="modal-settings"],
        div[id^="radix-"][role="dialog"] {
          background: ${isWp ? hexToRgba(baseColor, 0.95) : baseColor} !important;
          background-color: ${isWp ? hexToRgba(baseColor, 0.95) : baseColor} !important;
          border: 1px solid ${border} !important;
          color: #F8FAFC !important;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6) !important;
        }

        [role="dialog"] h2,
        [role="dialog"] h3,
        [data-testid="modal-settings"] h2,
        [data-testid="modal-settings"] h3 {
          color: #FFFFFF !important;
        }

        [role="dialog"] nav button,
        [role="dialog"] [role="tab"] {
          color: #CBD5E1 !important;
        }

        [role="dialog"] [role="tab"][aria-selected="true"],
        [role="dialog"] [role="tab"][data-state="active"] {
          color: #FFFFFF !important;
          background: ${hexToRgba(primary, 0.25)} !important;
          border-left: 3px solid ${primary} !important;
        }

        /* ==========================================================================
           6B. TOOLTIPS (Single Sleek Pill Structure - No Outer Double Capsule)
           ========================================================================== */
        /* Strictly neutralize tooltip popper wrappers (NO double capsule, NO extra padding) */
        div[data-radix-popper-content-wrapper],
        div[data-radix-popper-content-wrapper]:has([role="tooltip"]),
        div[data-radix-popper-content-wrapper]:has([data-radix-tooltip-content]) {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          filter: none !important;
          -webkit-filter: none !important;
        }

        /* Unified Clean Single Pill Tooltip */
        [role="tooltip"],
        [data-radix-tooltip-content],
        div[style*="--radix-tooltip-content"]:not([data-radix-popper-content-wrapper]),
        .bg-token-bg-tooltip {
          background: ${baseColor} !important;
          background-color: ${baseColor} !important;
          color: ${secondary || primary || '#F59E0B'} !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 9999px !important;
          padding: 4px 10px !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          line-height: 1.2 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          z-index: 99999 !important;
        }

        /* Prevent nested borders or double backgrounds inside the tooltip */
        [role="tooltip"] *,
        [data-radix-tooltip-content] * {
          border: none !important;
          box-shadow: none !important;
        }

        /* Tooltip text and inner elements */
        [role="tooltip"] :is(span, p, div, b, strong):not(kbd):not([class*="rounded"]) {
          color: ${secondary || primary || '#F59E0B'} !important;
          font-weight: 600 !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* Keyboard shortcut badge (e.g. Ctrl+Shift+S) inside tooltip */
        [role="tooltip"] :is(kbd, span[class*="rounded"], [class*="bg-token-main-surface-secondary"]) {
          background: rgba(255, 255, 255, 0.10) !important;
          background-color: rgba(255, 255, 255, 0.10) !important;
          color: ${secondary || primary || '#F59E0B'} !important;
          border-radius: 4px !important;
          padding: 1px 5px !important;
          font-size: 11px !important;
          font-weight: 500 !important;
        }

        /* Tooltip arrow if present */
        [role="tooltip"] svg,
        [role="tooltip"] polygon,
        [data-radix-tooltip-content] svg {
          fill: ${baseColor} !important;
          color: ${baseColor} !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.dialogs;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
