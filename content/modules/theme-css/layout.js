// PromptCanvas ChatGPT Theme CSS - Zero-Shift Canvas & Wrapper Transparency

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.layout = function (ctx) {
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
           2. ZERO-SHIFT WRAPPER TRANSPARENCY (Guarantees Wallpaper Display)
           ========================================================================== */
        html, body, #__next, #root,
        main, main > div,
        header,
        [data-thread-user-message-navigation-content],
        [data-thread-find-target="conversation"],
        [data-chatgpt-search-message-ids],
        div.draggable,
        div[class*="draggable"],
        div[class*="min-h-[--header-height]"],
        div[class*="top-0"]:not(nav *):not(aside *),
        div.sticky.top-0:not(nav *):not(aside *),
        [class*="sticky"][class*="top-0"]:not(nav *):not(aside *),
        div[id^="radix-"]:not([role="tooltip"]):not([role="dialog"]):not([data-radix-popper-content-wrapper]):not(:has([role="tooltip"])),
        div[class*="overflow-y-auto"]:not(#app-shell-sidebar *):not(aside *),
        div[class*="react-scroll-to-bottom"],
        div[class*="composer-parent"],
        div[class*="stretch"],
        div[class*="bottom-0"],
        div[class*="from-token-main-surface-primary"],
        div[class*="from-white"],
        div[class*="via-white"],
        div[class*="to-transparent"],
        div[class*="bg-gradient-to-t"],
        footer {
          background-color: transparent !important;
          background: transparent !important;
        }

        /* Scroll-to-Bottom Arrow Button Styling (Preserves native positioning & avoids padding bloat) */
        button[data-testid*="scroll-to-bottom"],
        button[aria-label*="Scroll to bottom" i] {
          background: rgba(24, 20, 34, 0.92) !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4) !important;
          color: #FFFFFF !important;
          backdrop-filter: blur(8px) !important;
          -webkit-backdrop-filter: blur(8px) !important;
        }

        html, body {
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          color: #F8FAFC !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.layout;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
