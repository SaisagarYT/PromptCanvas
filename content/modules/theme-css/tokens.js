// PromptCanvas ChatGPT Theme CSS - ChatGPT Native Design Tokens

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.tokens = function (ctx) {
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
           1. HIJACK CHATGPT NATIVE DESIGN TOKENS
           ========================================================================== */
        :root,
        html,
        body,
        [data-theme],
        html.light,
        html.dark,
        .light,
        .dark {
          /* Canvas & Surfaces */
          --color-surface: ${rootBg} !important;
          --color-surface-secondary: ${baseColor} !important;
          --color-surface-canvas: ${rootBg} !important;
          --color-surface-card: ${isWp ? 'rgba(255, 255, 255, 0.05)' : baseColor} !important;
          --color-surface-elevated-secondary: ${baseColor} !important;
          --color-background-panel: ${isWp ? hexToRgba(baseColor, 0.9) : baseColor} !important;
          --bg-primary: ${rootBg} !important;
          --bg-primary-inverted: ${primary} !important;
          --bg-secondary: ${baseColor} !important;
          --bg-tertiary: ${baseColor} !important;
          --bg-elevated-primary: ${baseColor} !important;
          --bg-elevated-secondary: ${baseColor} !important;
          --main-surface-primary: ${rootBg} !important;
          --main-surface-secondary: ${baseColor} !important;
          --main-surface-tertiary: ${baseColor} !important;
          --token-main-surface-primary: ${rootBg} !important;
          --token-main-surface-secondary: ${rootBg} !important;
          --token-main-surface-tertiary: ${rootBg} !important;
          --token-surface-primary: ${rootBg} !important;
          --token-surface-secondary: ${rootBg} !important;
          --token-surface-tertiary: ${rootBg} !important;
          --app-shell-panel-background: ${rootBg} !important;

          /* Chat Message Bubbles */
          --color-background-user-message: ${isWp ? hexToRgba(baseColor, 0.85) : hexToRgba(baseColor, 0.92)} !important;
          --color-text-user-message: #FFFFFF !important;
          --color-background-text-selection: ${sidebarHover} !important;
          --color-background-attribution-highlight: ${secondaryHover} !important;

          /* Composer & Input Controls */
          --color-background-composer-primary: ${primary} !important;
          --color-text-composer-primary: #FFFFFF !important;
          --composer-surface: ${ibMode === 'solid' ? baseColor : 'transparent'} !important;
          --composer-background: ${ibMode === 'solid' ? baseColor : 'transparent'} !important;
          --color-background-composer-action-bar: ${baseColor} !important;
          --app-color-background-elevated-primary: ${hexToRgba(baseColor, 0.88)} !important;
          --app-color-background-elevated-primary-opaque: ${hexToRgba(baseColor, 0.95)} !important;
          --app-color-background-elevated-secondary: ${baseColor} !important;
          --app-color-background-surface: ${baseColor} !important;
          --app-color-background-surface-under: ${baseColor} !important;
          --app-color-background-control: rgba(255, 255, 255, 0.08) !important;
          --color-background-control-opaque: ${baseColor} !important;
          --app-color-background-editor-opaque: ${baseColor} !important;

          /* Buttons & Interactive Elements */
          --app-color-accent-blue: ${primary} !important;
          --app-color-accent-purple: ${secondary} !important;
          --app-color-background-accent: ${primary} !important;
          --app-color-background-accent-active: ${sidebarHover} !important;
          --app-color-background-accent-hover: ${sidebarHover} !important;
          --app-color-background-button-primary: ${primary} !important;
          --app-color-background-button-primary-active: ${secondary} !important;
          --app-color-background-button-primary-hover: ${secondary} !important;
          --app-color-background-button-secondary: rgba(255, 255, 255, 0.08) !important;
          --app-color-background-button-secondary-active: ${sidebarHover} !important;
          --app-color-background-button-secondary-hover: ${sidebarHover} !important;
          --app-color-background-button-tertiary-active: ${secondaryHover} !important;
          --app-color-background-button-tertiary-hover: ${secondaryHover} !important;
          --color-background-button-outline-hover: ${sidebarHover} !important;

          /* Icons & Focus */
          --app-color-icon-accent: ${primary} !important;
          --app-color-icon-primary: #F8FAFC !important;
          --app-color-icon-secondary: ${secondary} !important;
          --app-color-icon-tertiary: #CBD5E1 !important;
          --icon-accent: ${primary} !important;

          /* Text & Typography: Always High-Contrast for legibility */
          --app-color-text-accent: ${primary} !important;
          --app-color-text-on-accent: #FFFFFF !important;
          --app-color-text-button-primary: #FFFFFF !important;
          --app-color-text-foreground: #F8FAFC !important;
          --app-color-text-foreground-secondary: #CBD5E1 !important;
          --app-color-text-foreground-tertiary: #94A3B8 !important;
          --app-color-foreground-application-menu: #F8FAFC !important;
          --text-primary: #F8FAFC !important;
          --text-secondary: #CBD5E1 !important;
          --text-tertiary: #94A3B8 !important;
          --color-text: #F8FAFC !important;
          --color-text-secondary: #CBD5E1 !important;
          --color-text-tertiary: #94A3B8 !important;
          --color-text-tip: ${secondary} !important;
          --color-text-connected: ${primary} !important;

          /* Placeholder & Hint Text */
          --color-text-placeholder: rgba(255, 255, 255, 0.65) !important;
          --text-placeholder: rgba(255, 255, 255, 0.65) !important;
          --text-token-text-placeholder: rgba(255, 255, 255, 0.65) !important;
          --placeholder-text: rgba(255, 255, 255, 0.65) !important;
          --color-text-hint: rgba(255, 255, 255, 0.65) !important;
          --hint-text: rgba(255, 255, 255, 0.65) !important;
          --text-quaternary: rgba(255, 255, 255, 0.65) !important;

          /* Tooltips - Consistent Solid Dark Background */
          --color-text-tooltip: ${secondary || primary} !important;
          --color-text-tooltip-classic: ${secondary || primary} !important;
          --color-text-tooltip-secondary: #CBD5E1 !important;
          --color-background-tooltip: ${baseColor} !important;
          --color-background-tooltip-classic: ${baseColor} !important;
          --bg-tooltip: ${baseColor} !important;
          --token-bg-tooltip: ${baseColor} !important;

          /* Borders */
          --app-color-border: ${border} !important;
          --app-color-border-light: ${border} !important;
          --app-color-border-focus: ${primary} !important;
          --color-border: ${border} !important;
          --color-border-mode-toggle-selected: ${border} !important;

          /* Sidebar Tokens */
          --sidebar-surface-primary: ${sbMode === 'solid' ? baseColor : 'transparent'} !important;
          --sidebar-surface-secondary: ${hexToRgba(primary, isLight ? 0.15 : 0.20)} !important;
          --sidebar-surface-tertiary: ${hexToRgba(primary, isLight ? 0.07 : 0.09)} !important;
          --token-sidebar-surface-primary: ${sbMode === 'solid' ? baseColor : 'transparent'} !important;
          --token-sidebar-surface-secondary: ${hexToRgba(primary, isLight ? 0.15 : 0.20)} !important;
          --token-sidebar-surface-tertiary: ${hexToRgba(primary, isLight ? 0.07 : 0.09)} !important;
          --menu-item-active: ${hexToRgba(primary, isLight ? 0.15 : 0.20)} !important;
          --menu-item-hover: ${hexToRgba(primary, isLight ? 0.07 : 0.09)} !important;
          --menu-item-highlighted: ${hexToRgba(primary, isLight ? 0.15 : 0.20)} !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.tokens;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
