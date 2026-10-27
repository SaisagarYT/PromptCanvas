// PromptCanvas Theme & Wallpaper Engine
// Coordinator for dynamic glassmorphism, wallpaper injection & non-invasive styling for ChatGPT

(function (root) {
  'use strict';

  let themeStyleEl = null;

  function _hexToRgba(hex, alpha) {
    if (root.PCColorUtils?.hexToRgba) return root.PCColorUtils.hexToRgba(hex, alpha);
    if (typeof root.hexToRgba === 'function') return root.hexToRgba(hex, alpha);
    const clean = (hex || '').replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function _isLightColor(hex) {
    if (root.PCColorUtils?.isLightColor) return root.PCColorUtils.isLightColor(hex);
    if (!hex || typeof hex !== 'string') return false;
    const clean = hex.replace('#', '');
    if (clean.length < 6) return false;
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160;
  }

  const PCThemeEngine = {
    get PRESET_WALLPAPERS() {
      return root.PCWallpapers?.PRESETS_MAP || root.PRESET_WALLPAPERS || {};
    },

    getWallpaperUrl(wp) {
      if (root.PCWallpaperEngine?.getWallpaperUrl) {
        return root.PCWallpaperEngine.getWallpaperUrl(wp);
      }
      if (root.PCWallpapers?.getWallpaperUrl) {
        return root.PCWallpapers.getWallpaperUrl(wp);
      }
      return wp?.url || '';
    },

    applyWallpaper(themeOrWp, themeEnabled, globalWallpaper) {
      if (root.PCWallpaperEngine?.applyWallpaper) {
        return root.PCWallpaperEngine.applyWallpaper(themeOrWp, themeEnabled, globalWallpaper);
      }
    },

    buildThemeContext(c, theme, isWp, glassBlur, sidebarStyle = {}, inputBarStyle = {}) {
      const swatches = theme.colors?.swatches || [
        c.background || '#18181B',
        c.primary || '#EF4444',
        c.secondary || '#F59E0B',
        c.textMuted || '#CBD5E1'
      ];
      const [c1, c2, c3, c4] = swatches;

      const baseColor = c1 || '#18181B';
      const primary = c2 || '#EF4444';
      const secondary = c3 || '#F59E0B';
      const tertiary = c4 || '#CBD5E1';

      const userText = c.userBubbleText || '#FFFFFF';
      const rootBg = isWp ? 'transparent' : baseColor;
      const border = _hexToRgba(primary, 0.28);
      const secondaryBorder = _hexToRgba(secondary, 0.28);
      const sidebarHover = _hexToRgba(primary, 0.16);
      const secondaryHover = _hexToRgba(secondary, 0.16);

      const isLight = _isLightColor(baseColor);
      const sidebarItemColor = isLight ? '#334155' : '#E2E8F0';
      const sidebarItemActiveColor = isLight ? '#0F172A' : '#FFFFFF';
      const sidebarBtnColor = isLight ? '#64748B' : '#CBD5E1';

      // Sidebar configurations
      const sbMode = sidebarStyle?.backgroundMode || 'transparent';
      const sbBlur = typeof sidebarStyle?.glassBlur !== 'undefined' ? sidebarStyle.glassBlur : (glassBlur || 24);
      const sbBorderEnabled = sidebarStyle?.borderEnabled !== false;

      const sidebarBgCss = sbMode === 'solid'
        ? `background: ${baseColor} !important; background-color: ${baseColor} !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;`
        : `background: ${_hexToRgba(baseColor, 0.42)} !important; background-color: ${_hexToRgba(baseColor, 0.42)} !important; backdrop-filter: blur(${sbBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${sbBlur}px) saturate(140%) !important;`;

      const sidebarBorderCss = sbBorderEnabled
        ? `border-right: 1px solid ${_hexToRgba(primary, 0.25)} !important;`
        : `border-right: none !important;`;

      // Input bar configurations
      const ibMode = inputBarStyle?.backgroundMode || 'transparent';
      const ibBlur = typeof inputBarStyle?.glassBlur !== 'undefined' ? inputBarStyle.glassBlur : 14;
      const ibBorderAccent = inputBarStyle?.borderAccent !== false;
      const ibActionAccent = inputBarStyle?.actionButtonsMode !== 'default';
      const ibToolAccent = inputBarStyle?.toolPillsMode !== 'default';

      const composerBgCss = ibMode === 'solid'
        ? `background: ${baseColor} !important; background-color: ${baseColor} !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;`
        : `background: ${isWp ? _hexToRgba(baseColor, 0.40) : _hexToRgba(baseColor, 0.55)} !important; background-color: ${isWp ? _hexToRgba(baseColor, 0.40) : _hexToRgba(baseColor, 0.55)} !important; ${ibBlur > 0 ? `backdrop-filter: blur(${ibBlur}px) !important; -webkit-backdrop-filter: blur(${ibBlur}px) !important;` : 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important;'}`;

      return {
        c, theme, isWp, glassBlur, sidebarStyle, inputBarStyle,
        swatches, c1, c2, c3, c4, baseColor, primary, secondary, tertiary,
        userText, rootBg, border, secondaryBorder, sidebarHover, secondaryHover,
        isLight, sidebarItemColor, sidebarItemActiveColor, sidebarBtnColor,
        sbMode, sbBlur, sbBorderEnabled, sidebarBgCss, sidebarBorderCss,
        ibMode, ibBlur, ibBorderAccent, ibActionAccent, ibToolAccent, composerBgCss,
        hexToRgba: _hexToRgba
      };
    },

    buildChatGPTTheme(c, theme, isWp, glassBlur, sidebarStyle = {}, inputBarStyle = {}) {
      const ctx = this.buildThemeContext(c, theme, isWp, glassBlur, sidebarStyle, inputBarStyle);
      if (root.PCThemeCSS?.buildAll) {
        return root.PCThemeCSS.buildAll(ctx);
      }
      return '';
    },

    applyCSSVars(theme, themeEnabled, globalWallpaper) {
      if (!themeEnabled || !theme) return;
      const docRoot = document.documentElement;
      const c = theme.colors;

      docRoot.style.setProperty('--pc-primary', c.primary);
      docRoot.style.setProperty('--pc-secondary', c.secondary);
      docRoot.style.setProperty('--pc-accent', c.accent);
      docRoot.style.setProperty('--pc-bg', c.background);
      docRoot.style.setProperty('--pc-surface', c.surface);
      docRoot.style.setProperty('--pc-surface-glass', c.surfaceGlass || c.surface);
      docRoot.style.setProperty('--pc-text', c.text);
      docRoot.style.setProperty('--pc-text-muted', c.textMuted);
      docRoot.style.setProperty('--pc-border', c.border);
      docRoot.style.setProperty('--pc-input-bg', c.inputBg);
      docRoot.style.setProperty('--pc-sidebar', c.sidebar);
      docRoot.style.setProperty('--pc-sidebar-hover', c.sidebarHover);
      docRoot.style.setProperty('--pc-font', theme.font || 'Inter');
      docRoot.style.setProperty('--pc-font-size', theme.fontSize || '15px');
      docRoot.style.setProperty('--pc-radius', theme.borderRadius || '4px');
      docRoot.style.setProperty('--pc-msg-radius', theme.messageBorderRadius || '4px');

      const wp = globalWallpaper || theme?.wallpaper;
      const isWp = Boolean(themeEnabled && wp && wp.enabled && wp.presetId !== 'none' && (wp.presetId || wp.url || wp.dataUrl));
      const panelBlur = isWp ? (wp?.panelBlur || 14) : 0;
      docRoot.style.setProperty('--pc-panel-blur', `${panelBlur}px`);
    },

    applyPageTheme(theme, platform, themeEnabled, globalWallpaper, sidebarStyle, inputBarStyle) {
      const wp = globalWallpaper || theme?.wallpaper;
      this.applyWallpaper(wp, themeEnabled);

      if (!themeEnabled) {
        if (themeStyleEl) themeStyleEl.textContent = '';
        return;
      }
      if (!theme) return;

      if (!themeStyleEl) {
        themeStyleEl = document.createElement('style');
        themeStyleEl.id = 'pc-page-theme';
        document.head.appendChild(themeStyleEl);
      }

      const c = theme.colors;
      const isWp = Boolean(themeEnabled && wp && wp.enabled && wp.presetId !== 'none' && (wp.presetId || wp.url || wp.dataUrl));
      const glassBlur = isWp ? (wp?.panelBlur || 14) : 0;

      const css = this.buildChatGPTTheme(c, theme, isWp, glassBlur, sidebarStyle, inputBarStyle);
      themeStyleEl.textContent = css;
    }
  };

  root.PCThemeEngine = PCThemeEngine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCThemeEngine;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
