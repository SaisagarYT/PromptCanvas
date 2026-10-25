// PromptCanvas Theme & Wallpaper Engine
// Handles dynamic glassmorphism, wallpaper injection & non-invasive styling for ChatGPT, Claude, Gemini, DeepSeek, LeetCode
// Guarantees zero layout shift & full transparency on host application wrappers

(function (root) {
  'use strict';

  let themeStyleEl = null;
  let wallpaperHostEl = null;
  let wallpaperOverlayEl = null;

  function hexToRgba(hex, alpha) {
    if (!hex) return `rgba(0, 0, 0, ${alpha})`;
    if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const PRESET_WALLPAPERS = {
    'ferrari-racing': {
      id: 'ferrari-racing',
      name: 'Scuderia Ferrari Corse',
      localPath: 'assets/wallpapers/ferrari-racing.jpg'
    },
    'abstract-purple': {
      id: 'abstract-purple',
      name: 'Violet Radiance',
      localPath: 'assets/wallpapers/abstract-purple.jpg'
    },
    'spiderman-action': {
      id: 'spiderman-action',
      name: 'Spider-Man Skyline Action',
      localPath: 'assets/wallpapers/spiderman-action.jpg'
    },
    'spiderman-night': {
      id: 'spiderman-night',
      name: 'Spider-Man Night City',
      localPath: 'assets/wallpapers/spiderman-night.jpg'
    },
    'cosmic-sunset': {
      id: 'cosmic-sunset',
      name: 'Twilight Mirage Sunset',
      localPath: 'assets/wallpapers/cosmic-sunset.jpg'
    }
  };

  const PCThemeEngine = {
    PRESET_WALLPAPERS,

    getWallpaperUrl(wp) {
      if (!wp) return '';
      if (wp.type === 'custom_upload' && wp.dataUrl) return wp.dataUrl;
      if (wp.type === 'custom_url' && wp.url) return wp.url;

      const presetId = wp.presetId;
      if (presetId) {
        const preset = PRESET_WALLPAPERS[presetId];
        const relPath = preset?.localPath || `assets/wallpapers/${presetId}.jpg`;
        try {
          if (typeof chrome !== 'undefined' && chrome.runtime?.getURL && chrome.runtime.id && !chrome.runtime.id.includes('mock')) {
            return chrome.runtime.getURL(relPath);
          }
        } catch (e) {}
        return '../' + relPath;
      }
      return wp.url || '';
    },

    applyWallpaper(themeOrWp, themeEnabled, globalWallpaper) {
      let wp = null;
      if (globalWallpaper !== undefined && globalWallpaper !== null) {
        wp = globalWallpaper;
      } else if (themeOrWp && (themeOrWp.presetId || themeOrWp.url || typeof themeOrWp.enabled !== 'undefined')) {
        wp = themeOrWp;
      } else if (themeOrWp && themeOrWp.wallpaper) {
        wp = themeOrWp.wallpaper;
      }

      const isEnabled = Boolean(themeEnabled && wp && wp.enabled && wp.presetId !== 'none' && (wp.presetId || wp.url || wp.dataUrl));

      if (!isEnabled) {
        if (wallpaperHostEl) {
          wallpaperHostEl.style.display = 'none';
        }
        return;
      }

      if (!wallpaperHostEl) {
        wallpaperHostEl = document.createElement('div');
        wallpaperHostEl.id = 'pc-wallpaper-host';
        wallpaperHostEl.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: -999999 !important;
          pointer-events: none !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          transition: filter 0.3s ease, opacity 0.3s ease !important;
        `;

        wallpaperOverlayEl = document.createElement('div');
        wallpaperOverlayEl.id = 'pc-wallpaper-overlay';
        wallpaperOverlayEl.style.cssText = `
          position: absolute !important;
          inset: 0 !important;
          pointer-events: none !important;
          transition: background-color 0.3s ease !important;
        `;

        wallpaperHostEl.appendChild(wallpaperOverlayEl);
        document.documentElement.appendChild(wallpaperHostEl);
      }

      const imgUrl = this.getWallpaperUrl(wp);
      if (imgUrl) {
        wallpaperHostEl.style.display = 'block';
        wallpaperHostEl.style.backgroundImage = `url("${imgUrl}")`;
        const blur = typeof wp.blur !== 'undefined' ? wp.blur : 0;
        const brightness = typeof wp.brightness !== 'undefined' ? wp.brightness : 85;
        wallpaperHostEl.style.filter = `blur(${blur}px) brightness(${brightness}%)`;

        const overlayPct = typeof wp.overlayOpacity !== 'undefined' ? wp.overlayOpacity : 35;
        wallpaperOverlayEl.style.backgroundColor = `rgba(10, 8, 18, ${overlayPct / 100})`;
      } else {
        wallpaperHostEl.style.display = 'none';
      }
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

      let css = '';
      if (platform === 'chatgpt') css = this.buildChatGPTTheme(c, theme, isWp, glassBlur, sidebarStyle, inputBarStyle);
      else if (platform === 'gemini') css = this.buildGeminiTheme(c, theme, isWp, glassBlur);
      else if (platform === 'claude') css = this.buildClaudeTheme(c, theme, isWp, glassBlur);
      else if (platform === 'deepseek') css = this.buildDeepSeekTheme(c, theme, isWp, glassBlur);
      else if (platform === 'leetcode') css = this.buildLeetCodeTheme(c, theme, isWp, glassBlur);
      else css = this.buildGenericTheme(c, theme, isWp, glassBlur);

      themeStyleEl.textContent = css;
    },

        buildChatGPTTheme(c, theme, isWp, glassBlur, sidebarStyle = {}, inputBarStyle = {}) {
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
      const border = hexToRgba(primary, 0.28);
      const secondaryBorder = hexToRgba(secondary, 0.28);
      const sidebarHover = hexToRgba(primary, 0.16);
      const secondaryHover = hexToRgba(secondary, 0.16);

      // --- Sidebar Style Configurations ---
      const sbMode = sidebarStyle?.backgroundMode || 'transparent';
      const sbBlur = typeof sidebarStyle?.glassBlur !== 'undefined' ? sidebarStyle.glassBlur : (glassBlur || 24);
      const sbBorderEnabled = sidebarStyle?.borderEnabled !== false;

      const sidebarBgCss = sbMode === 'solid'
        ? `background: ${baseColor} !important; background-color: ${baseColor} !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;`
        : `background: ${hexToRgba(baseColor, 0.42)} !important; background-color: ${hexToRgba(baseColor, 0.42)} !important; backdrop-filter: blur(${sbBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${sbBlur}px) saturate(140%) !important;`;

      const sidebarBorderCss = sbBorderEnabled
        ? `border-right: 1px solid ${hexToRgba(primary, 0.25)} !important;`
        : `border-right: none !important;`;

      // --- Input Bar Style Configurations ---
      const ibMode = inputBarStyle?.backgroundMode || 'transparent';
      const ibBlur = typeof inputBarStyle?.glassBlur !== 'undefined' ? inputBarStyle.glassBlur : 14;
      const ibBorderAccent = inputBarStyle?.borderAccent !== false;
      const ibActionAccent = inputBarStyle?.actionButtonsMode !== 'default';
      const ibToolAccent = inputBarStyle?.toolPillsMode !== 'default';

      const composerBgCss = ibMode === 'solid'
        ? `background: ${baseColor} !important; background-color: ${baseColor} !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important;`
        : `background: ${isWp ? hexToRgba(baseColor, 0.40) : hexToRgba(baseColor, 0.55)} !important; background-color: ${isWp ? hexToRgba(baseColor, 0.40) : hexToRgba(baseColor, 0.55)} !important; ${ibBlur > 0 ? `backdrop-filter: blur(${ibBlur}px) !important; -webkit-backdrop-filter: blur(${ibBlur}px) !important;` : 'backdrop-filter: none !important; -webkit-backdrop-filter: none !important;'}`;

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
          --color-background-user-message: ${primary} !important;
          --color-text-user-message: ${userText} !important;
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
          --sidebar-surface-secondary: transparent !important;
          --sidebar-surface-tertiary: transparent !important;
          --token-sidebar-surface-primary: ${sbMode === 'solid' ? baseColor : 'transparent'} !important;
          --token-sidebar-surface-secondary: transparent !important;
          --token-sidebar-surface-tertiary: transparent !important;
        }

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

        html, body {
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          color: #F8FAFC !important;
        }

        /* ==========================================================================
           3. SIDEBAR (Solid vs Frosted Glass + 100% Readable Text)
           ========================================================================== */

        /* Open sidebar shell gets the selected style ONLY when genuinely open */
        html:not([data-pc-sidebar="closed"]) #app-shell-sidebar:has(ol),
        html:not([data-pc-sidebar="closed"]) #app-shell-sidebar:has(a[href*="/c/"]),
        html:not([data-pc-sidebar="closed"]) #browser-sidebar-popover:has(ol) {
          ${sidebarBgCss}
          ${sidebarBorderCss}
          box-shadow: none !important;
        }

        /* When sidebar is collapsed/closed/mini-rail: strictly 100% transparent, ZERO ghost borders, blur, or background */
        html[data-pc-sidebar="closed"] #app-shell-sidebar,
        html[data-pc-sidebar="closed"] aside,
        html[data-pc-sidebar="closed"] #browser-sidebar-popover,
        html[data-pc-sidebar="closed"] nav,
        html[data-pc-sidebar="closed"] div.flex-shrink-0,
        #app-shell-sidebar:not(:has(ol)):not(:has(a[href*="/c/"])),
        #app-shell-sidebar:empty,
        #app-shell-sidebar[data-state="closed"],
        #app-shell-sidebar[aria-hidden="true"],
        #app-shell-sidebar[class*="w-0"],
        #app-shell-sidebar[class*="w-[0"],
        #app-shell-sidebar[style*="width: 0"],
        #app-shell-sidebar[style*="width:0"],
        div.flex-shrink-0:not(:has(ol)) {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-right: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        /* All aside containers and inner wrappers are ALWAYS 100% transparent (prevents phantom width and double opacity) */
        aside,
        aside *,
        #app-shell-sidebar aside,
        #app-shell-sidebar nav,
        #browser-sidebar-popover aside,
        #browser-sidebar-popover nav,
        nav[aria-label="Chat history"],
        nav:not(#promptcanvas-root *) > div,
        aside:not(#promptcanvas-root *) > div,
        nav:not(#promptcanvas-root *) div[class*="overflow-y-auto"],
        nav:not(#promptcanvas-root *) div[class*="overflow-x-hidden"],
        nav:not(#promptcanvas-root *) div[class*="flex-1"],
        nav:not(#promptcanvas-root *) div[class*="h-full"],
        nav:not(#promptcanvas-root *) ol,
        nav:not(#promptcanvas-root *) ul,
        nav:not(#promptcanvas-root *) div[class*="sticky"] {
          background: transparent !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-right: none !important;
          box-shadow: none !important;
        }

        /* Prevent double opacity inside sidebar: ALL inner children are strictly transparent */
        #app-shell-sidebar aside,
        #app-shell-sidebar nav,
        #browser-sidebar-popover aside,
        #browser-sidebar-popover nav,
        aside:has(nav) nav,
        nav[aria-label="Chat history"],
        nav:not(#promptcanvas-root *) > div,
        aside:not(#promptcanvas-root *) > div,
        nav:not(#promptcanvas-root *) div[class*="overflow-y-auto"],
        nav:not(#promptcanvas-root *) div[class*="overflow-x-hidden"],
        nav:not(#promptcanvas-root *) div[class*="flex-1"],
        nav:not(#promptcanvas-root *) div[class*="h-full"],
        nav:not(#promptcanvas-root *) ol,
        nav:not(#promptcanvas-root *) ul,
        nav:not(#promptcanvas-root *) div[class*="sticky"] {
          background: transparent !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-right: none !important;
          box-shadow: none !important;
        }

        /* Sidebar Section Headings (Pinned, Projects, Recents) */
        button[data-app-action-sidebar-section-toggle],
        nav button[data-app-action-sidebar-section-toggle],
        nav button[data-app-action-sidebar-section-toggle].group\/section-toggle {
          color: ${primary} !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        nav button[data-app-action-sidebar-section-toggle] span.min-w-0 {
          padding: 0.25rem 0.6rem !important;
          background: ${hexToRgba(primary, 0.16)} !important;
          box-shadow: 0 0 0 1px ${hexToRgba(primary, 0.32)} !important;
          border-radius: 50vw !important;
          color: ${primary} !important;
        }

        /* Sidebar All Links & Buttons: Crystal Clear High-Contrast Visibility */
        #app-shell-sidebar nav a,
        #app-shell-sidebar nav button,
        #browser-sidebar-popover nav a,
        #browser-sidebar-popover nav button,
        aside nav a,
        aside nav button,
        nav[aria-label="Chat history"] a,
        nav ol li a,
        nav ul li a,
        nav a[href*="/c/"] {
          color: #E2E8F0 !important;
          transition: all 0.15s ease !important;
          border-radius: 6px !important;
        }

        #app-shell-sidebar nav a:hover,
        #app-shell-sidebar nav button:hover,
        nav ol li a:hover,
        nav ul li a:hover,
        nav a[href*="/c/"]:hover {
          background: ${sidebarHover} !important;
          color: #FFFFFF !important;
        }

        /* All parent li elements and wrappers are strictly transparent (NO outer pill) */
        #app-shell-sidebar nav ol li,
        #app-shell-sidebar nav ol li > div,
        nav ol li,
        nav ol li > div {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Active Chat Item - A Single Sleek, Premium, Elegant Surface (NO Nested Layers) */
        #app-shell-sidebar nav ol li a[aria-current="page"],
        #app-shell-sidebar nav ol li a[class*="active"],
        #app-shell-sidebar nav ol li:has(a[aria-current="page"]) a,
        nav[aria-label="Chat history"] a[aria-current="page"],
        nav[aria-label="Chat history"] a[class*="active"],
        nav a[href*="/c/"][aria-current="page"],
        nav a[href*="/c/"][class*="active"] {
          background: ${hexToRgba(primary, 0.18)} !important;
          background-color: ${hexToRgba(primary, 0.18)} !important;
          border: 1px solid ${hexToRgba(primary, 0.35)} !important;
          border-radius: 8px !important;
          color: #FFFFFF !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25), 0 0 12px ${hexToRgba(primary, 0.12)} !important;
        }

        /* Wipe ALL child containers, spans, and icons inside the active link to transparent */
        #app-shell-sidebar nav ol li a[aria-current="page"] *,
        #app-shell-sidebar nav ol li a[class*="active"] *,
        nav[aria-label="Chat history"] a[aria-current="page"] *,
        nav a[href*="/c/"][aria-current="page"] *,
        nav a[href*="/c/"][class*="active"] * {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* "New chat" Quick Action Pill */
        nav a[href="/"],
        nav button[data-testid*="new-chat"],
        nav a:first-of-type:not([href*="/c/"]) {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid ${secondaryBorder} !important;
          border-radius: 9px !important;
          color: #F8FAFC !important;
          font-weight: 600 !important;
          font-size: 13.5px !important;
          padding: 8px 12px !important;
          margin: 6px 2px 10px 2px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        nav a[href="/"]:hover,
        nav button[data-testid*="new-chat"]:hover,
        nav a:first-of-type:not([href*="/c/"]):hover {
          background: ${sidebarHover} !important;
          border-color: ${primary} !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 16px ${sidebarHover} !important;
          transform: translateY(-1px) !important;
        }

        /* ==========================================================================
           4. CHAT BUBBLES (4-Color Harmony)
           ========================================================================== */
        /* User message bubble */
        [data-user-message-bubble],
        [data-message-author-role="user"] div[class*="rounded"],
        div[class*="user-turn"] div[class*="rounded"] {
          background: linear-gradient(135deg, ${hexToRgba(primary, 0.88)}, ${hexToRgba(secondary, 0.88)}) !important;
          background-color: ${primary} !important;
          border-radius: ${theme.messageBorderRadius || '18px'} !important;
          color: ${userText} !important;
          border: 1px solid ${border} !important;
          ${isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : ''}
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45), 0 0 16px ${hexToRgba(primary, 0.25)} !important;
          padding: 10px 18px !important;
          min-width: 48px !important;
          display: inline-flex !important;
          align-items: center !important;
        }

        [data-user-message-bubble] :is(p, span, div),
        [data-message-author-role="user"] :is(p, span, div) {
          color: ${userText} !important;
          font-weight: 500 !important;
        }

        /* Assistant message card */
        [data-markdown-text-style="assistant-message"],
        [data-markdown-text-style="assistant-message"][class^="MarkdownRoot-"],
        [data-message-author-role="assistant"],
        div[class*="agent-turn"] {
          display: block !important;
          width: 100% !important;
          background: ${isWp ? hexToRgba(baseColor, 0.80) : 'transparent'} !important;
          background-color: ${isWp ? hexToRgba(baseColor, 0.80) : 'transparent'} !important;
          border-radius: ${theme.messageBorderRadius || '18px'} !important;
          border: ${isWp ? `1px solid ${border}` : 'none'} !important;
          ${isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : ''}
          padding: 18px 24px !important;
          margin: 12px 0 !important;
          color: #F8FAFC !important;
          box-shadow: ${isWp ? `0 8px 32px rgba(0, 0, 0, 0.45), 0 0 14px ${sidebarHover}` : 'none'} !important;
        }

        [data-message-author-role="assistant"] > div,
        [data-message-author-role="assistant"] div.markdown,
        [data-markdown-text-style="assistant-message"] > div {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        /* Assistant Code Blocks */
        div[class*="code-block"],
        pre {
          border: 1px solid ${secondaryBorder} !important;
          border-radius: 8px !important;
        }

        div[class*="code-block"] > div:first-child,
        pre > div:first-child {
          background: ${hexToRgba(baseColor, 0.92)} !important;
          color: ${secondary} !important;
          border-bottom: 1px solid ${secondaryBorder} !important;
          font-weight: 600 !important;
        }

        blockquote {
          border-left: 3px solid ${secondary} !important;
          color: #CBD5E1 !important;
        }

        /* Action buttons below assistant turn */
        div[class*="agent-turn"] button,
        [data-message-author-role="assistant"] button,
        [data-message-author-role="assistant"] ~ div button,
        div:has(> button[aria-label*="Copy"]) button,
        button[aria-label*="Copy" i],
        button[aria-label*="Read aloud" i],
        button[aria-label*="Good response" i],
        button[aria-label*="Bad response" i],
        button[aria-label*="Retry" i],
        button[aria-label*="Try again" i],
        button[aria-label*="Regenerate" i],
        button[aria-label*="Share" i],
        button[aria-label*="More actions" i],
        button[aria-label*="More options" i] {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid ${border} !important;
          border-radius: 8px !important;
          color: #CBD5E1 !important;
          padding: 4px 8px !important;
          margin: 0 2px !important;
          transition: all 0.15s ease !important;
        }

        div[class*="agent-turn"] button:hover,
        [data-message-author-role="assistant"] button:hover,
        [data-message-author-role="assistant"] ~ div button:hover,
        div:has(> button[aria-label*="Copy"]) button:hover,
        button[aria-label*="Copy" i]:hover,
        button[aria-label*="Read aloud" i]:hover,
        button[aria-label*="Good response" i]:hover,
        button[aria-label*="Bad response" i]:hover,
        button[aria-label*="Retry" i]:hover,
        button[aria-label*="Try again" i]:hover,
        button[aria-label*="Regenerate" i]:hover,
        button[aria-label*="Share" i]:hover,
        button[aria-label*="More actions" i]:hover,
        button[aria-label*="More options" i]:hover {
          background: ${sidebarHover} !important;
          color: ${primary} !important;
          border-color: ${primary} !important;
        }

        /* ==========================================================================
           5. INPUT COMPOSER CAPSULE (Crisp, Single-Pill, Zero Halo Blur)
           ========================================================================== */

        /* All outer containers outside the composer pill MUST be transparent with NO blur and NO shadow */
        [data-pip-obstacle="thread-footer"],
        [data-pip-obstacle="thread-footer"] > div,
        form[data-chatgpt-composer],
        form:has(#prompt-textarea),
        form[data-chatgpt-composer] > div,
        form[data-chatgpt-composer] .min-w-0 {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: none !important;
        }

        /* The single unified outer composer pill */
        [data-pc-composer="true"],
        form[data-chatgpt-composer] [class^="ComposerLayoutRoot-"],
        form[data-chatgpt-composer] [class^="ComposerLayoutBody-"],
        form:has(#prompt-textarea) > div {
          ${composerBgCss}
          border: ${ibBorderAccent ? `1.5px solid ${hexToRgba(primary, 0.40)}` : `1px solid rgba(255, 255, 255, 0.16)`} !important;
          box-shadow: ${ibBorderAccent ? `0 4px 20px rgba(0, 0, 0, 0.35), 0 0 14px ${hexToRgba(primary, 0.22)}` : `0 4px 20px rgba(0, 0, 0, 0.35)`} !important;
          border-radius: 9999px !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }

        /* Focus-within glow on the outer composer pill */
        [data-pc-composer="true"]:focus-within,
        form[data-chatgpt-composer] [class^="ComposerLayoutRoot-"]:focus-within,
        form[data-chatgpt-composer] [class^="ComposerLayoutBody-"]:focus-within,
        form:has(#prompt-textarea) > div:focus-within {
          border-color: ${primary} !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45), 0 0 20px ${hexToRgba(primary, 0.35)} !important;
        }


        /* STRICTLY TRANSPARENT INSIDE: Remove inside black background and red border */
        #composer-background,
        div[id="composer-background"],
        #prompt-textarea,
        .ProseMirror,
        div:has(> #prompt-textarea),
        div:has(> .ProseMirror),
        div[class*="ProseMirror"],
        form div:has(#prompt-textarea):not([data-pc-composer="true"]) {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        #composer-background:focus-within,
        div[id="composer-background"]:focus-within,
        #prompt-textarea:focus,
        #prompt-textarea:focus-within,
        .ProseMirror:focus,
        .ProseMirror:focus-within,
        div:has(> #prompt-textarea):focus-within {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* ==========================================================================
           COMPOSER TEXT & HINT / PLACEHOLDER (100% Crisp Visibility & High Contrast)
           ========================================================================== */
        /* Active Typed Text */
        #prompt-textarea,
        .ProseMirror,
        #prompt-textarea p,
        .ProseMirror p {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }

        /* Native Textarea Placeholder */
        #prompt-textarea::placeholder,
        #prompt-textarea::-webkit-input-placeholder,
        textarea#prompt-textarea::placeholder,
        textarea#prompt-textarea::-webkit-input-placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* ProseMirror Placeholder Pseudo-elements */
        #prompt-textarea [data-placeholder]::before,
        #prompt-textarea p[data-placeholder]::before,
        #prompt-textarea p.placeholder::before,
        #prompt-textarea p.is-editor-empty::before,
        #prompt-textarea p.is-empty::before,
        .ProseMirror [data-placeholder]::before,
        .ProseMirror p[data-placeholder]::before,
        .ProseMirror p.placeholder::before,
        .ProseMirror p.is-editor-empty::before,
        .ProseMirror p.is-empty::before,
        [data-placeholder]::before {
          content: attr(data-placeholder) !important;
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          display: block !important;
          visibility: visible !important;
          pointer-events: none !important;
        }

        /* Fallback: If data-placeholder is missing on an empty initial paragraph */
        #prompt-textarea p:only-child:has(> br:only-child):not([data-placeholder])::before,
        .ProseMirror p:only-child:has(> br:only-child):not([data-placeholder])::before {
          content: "Ask anything" !important;
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          display: block !important;
          visibility: visible !important;
          pointer-events: none !important;
        }

        /* Overlay Placeholder DOM Elements (Tailwind / Modern ChatGPT) */
        #prompt-textarea .placeholder,
        #prompt-textarea [class*="placeholder" i],
        form:has(#prompt-textarea) [class*="placeholder" i],
        form:has(#prompt-textarea) [class*="text-token-text-placeholder"],
        form:has(#prompt-textarea) div.pointer-events-none:not(button):not(button *) {
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* ==========================================================================
           COMPOSER TOOL BUTTONS: Plus, Brain, Voice, Send (100% Transparent, No Glass)
           ========================================================================== */

        /* 1. Send Button: Transparent when empty/disabled, clean solid accent when ready */
        [data-pc-btn="send"],
        button[data-testid*="send" i],
        button[aria-label*="Send" i],
        #composer-background button[data-testid*="send" i] {
          background: transparent !important;
          background-color: transparent !important;
          color: #94A3B8 !important;
          border: none !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* Active send button (when enabled/ready to submit) */
        button.bg-composer-primary,
        [data-pc-btn="send"]:not(:disabled):not([aria-disabled="true"]):not([disabled]),
        button[data-testid*="send" i]:not(:disabled):not([aria-disabled="true"]):not([disabled]):has(svg) {
          background: ${primary} !important;
          background-color: ${primary} !important;
          color: #FFFFFF !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        button.bg-composer-primary:hover,
        [data-pc-btn="send"]:not(:disabled):not([aria-disabled="true"]):hover,
        button[data-testid*="send" i]:not(:disabled):not([aria-disabled="true"]):hover {
          filter: brightness(1.15) !important;
          transform: scale(1.06) !important;
        }

        /* 2. Voice / Dictation / Audio button: 100% Transparent, No Glass Effect */
        [data-pc-btn="voice"],
        button[aria-label*="Voice" i],
        button[aria-label*="dictation" i],
        button[data-testid*="voice" i] {
          background: transparent !important;
          background-color: transparent !important;
          color: #CBD5E1 !important;
          border: none !important;
          border-radius: 50% !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: all 0.2s ease !important;
        }

        [data-pc-btn="voice"]:hover,
        button[aria-label*="Voice" i]:hover,
        button[aria-label*="dictation" i]:hover,
        button[data-testid*="voice" i]:hover {
          background: transparent !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
          transform: scale(1.08) !important;
        }

        /* 3. "+ Attach" Button: 100% Transparent, No Glass Effect */
        [data-pc-btn="attach"],
        button[aria-label*="Attach" i],
        button[aria-label*="Upload" i],
        button[data-testid*="attach" i] {
          background: transparent !important;
          background-color: transparent !important;
          color: #CBD5E1 !important;
          border: none !important;
          border-radius: 50% !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: all 0.2s ease !important;
        }

        [data-pc-btn="attach"]:hover,
        button[aria-label*="Attach" i]:hover,
        button[aria-label*="Upload" i]:hover,
        button[data-testid*="attach" i]:hover {
          background: transparent !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
          transform: scale(1.08) !important;
        }

        /* 4. Think / Brain / Reasoning Button: 100% Transparent, No Glass Effect */
        [data-pc-btn="think"],
        button[aria-label*="Think" i],
        button[aria-label*="reason" i],
        button[data-testid*="think" i] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-radius: 9999px !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          color: #CBD5E1 !important;
          height: 36px !important;
          padding: 0 10px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        [data-pc-btn="think"]:hover,
        button[aria-label*="Think" i]:hover,
        button[aria-label*="reason" i]:hover,
        button[data-testid*="think" i]:hover {
          background: transparent !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
        }

        /* Ensure all SVG icons inside composer buttons inherit transparent & clean colors */
        [data-pc-btn="attach"] svg,
        [data-pc-btn="think"] svg,
        [data-pc-btn="voice"] svg,
        #composer-background button:not([data-pc-btn="send"]) svg {
          color: inherit !important;
          fill: currentColor !important;
          stroke: currentColor !important;
        }

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
           6B. TOOLTIPS (Always Solid Dark Theme Background - Zero Backdrop Shadows)
           ========================================================================== */
        [role="tooltip"],
        [data-radix-tooltip-content],
        div[style*="--radix-tooltip-content"],
        div[data-radix-popper-content-wrapper]:has([role="tooltip"]),
        div[data-radix-popper-content-wrapper] [role="tooltip"],
        div[data-radix-popper-content-wrapper] [data-radix-tooltip-content],
        div[data-side][role="tooltip"],
        div[data-state][role="tooltip"],
        .bg-token-bg-tooltip,
        [class*="bg-token-bg-tooltip"] {
          background: ${baseColor} !important;
          background-color: ${baseColor} !important;
          color: ${secondary || primary || '#F59E0B'} !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 9999px !important;
          padding: 6px 12px !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          opacity: 1 !important;
          visibility: visible !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          line-height: 1.3 !important;
          z-index: 99999 !important;
        }

        /* Ensure tooltip wrapper has no drop shadow */
        div[data-radix-popper-content-wrapper]:has([role="tooltip"]) {
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
        }

        /* Tooltip text and inner elements */
        [role="tooltip"] :is(span, p, div, b, strong),
        [data-radix-tooltip-content] :is(span, p, div, b, strong),
        div[style*="--radix-tooltip-content"] :is(span, p, div, b, strong),
        .bg-token-bg-tooltip :is(span, p, div, b, strong) {
          color: ${secondary || primary || '#F59E0B'} !important;
          font-weight: 600 !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* Tooltip arrow if present */
        [role="tooltip"] svg,
        [role="tooltip"] polygon,
        [data-radix-tooltip-content] svg,
        div[style*="--radix-tooltip-content"] svg {
          fill: ${baseColor} !important;
          color: ${baseColor} !important;
        }

        /* ==========================================================================
           7. HOME PAGE PROMPT SUGGESTIONS & STARTER CARDS (Premium, Ultra-Visible)
           ========================================================================== */
        /* Starter suggestion buttons ONLY (never layout containers) */
        [data-pc-starter="true"],
        button[data-pc-starter="true"],
        a[data-pc-starter="true"],
        button[data-testid*="prompt-suggestion"],
        button[data-testid*="starter"],
        [data-testid="use-case-prompt-chips"] button,
        main button:has(svg):has(span):not(form *):not(header *):not(nav *):not(aside *),
        main a:has(svg):has(span):not(form *):not(header *):not(nav *):not(aside *),
        main div[class*="grid"] button:not(form *):not(header *):not(nav *):not(aside *) {
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
        [data-testid="use-case-prompt-chips"] button :is(span, p, div),
        main button:has(svg):has(span):not(form *) :is(span, p, div),
        main a:has(svg):has(span):not(form *) :is(span, p, div) {
          color: #F8FAFC !important;
          font-weight: 500 !important;
          background: transparent !important;
          background-color: transparent !important;
        }

        /* SVG Icons in starter cards: Glowing Accent */
        [data-pc-starter="true"] svg,
        button[data-testid*="prompt-suggestion"] svg,
        button[data-testid*="starter"] svg,
        [data-testid="use-case-prompt-chips"] button svg,
        main button:has(svg):has(span):not(form *) svg,
        main a:has(svg):has(span):not(form *) svg {
          color: ${primary} !important;
          stroke: currentColor !important;
          filter: drop-shadow(0 0 6px ${hexToRgba(primary, 0.55)}) !important;
          transition: transform 0.22s ease, filter 0.22s ease !important;
          flex-shrink: 0 !important;
        }

        /* Starter card hover: Luminous lift & Theme Accent Border */
        [data-pc-starter="true"]:hover,
        button[data-testid*="prompt-suggestion"]:hover,
        button[data-testid*="starter"]:hover,
        [data-testid="use-case-prompt-chips"] button:hover,
        main button:has(svg):has(span):not(form *):hover,
        main a:has(svg):has(span):not(form *):hover {
          background: ${isWp ? 'rgba(28, 25, 40, 0.96)' : hexToRgba(baseColor, 0.96)} !important;
          background-color: ${isWp ? 'rgba(28, 25, 40, 0.96)' : hexToRgba(baseColor, 0.96)} !important;
          border-color: ${primary} !important;
          color: #FFFFFF !important;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.55), 0 0 16px ${hexToRgba(primary, 0.35)}, inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
          transform: translateY(-2px) !important;
        }

        [data-pc-starter="true"]:hover svg,
        button[data-testid*="prompt-suggestion"]:hover svg,
        button[data-testid*="starter"]:hover svg,
        [data-testid="use-case-prompt-chips"] button:hover svg,
        main button:has(svg):has(span):not(form *):hover svg,
        main a:has(svg):has(span):not(form *):hover svg {
          transform: scale(1.12) !important;
          filter: drop-shadow(0 0 10px ${primary}) !important;
        }


        /* Active prompt suggestion card / attachment chip under composer */
        div[class*="rounded"]:has(button[aria-label*="close" i]),
        div[class*="rounded"]:has(button[aria-label*="Remove" i]),
        div[class*="bg-token-main-surface-secondary"]:has(button) {
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

        /* Code Blocks - Glass Container */
        div.contain-inline-size,
        div[class*="contain-inline-size"],
        div:has(> pre),
        div:has(> div > pre),
        div:has(> div > code),
        div[class*="rounded"]:has(code),
        div[class*="rounded"]:has(pre),
        pre:not(#promptcanvas-root *),
        div[class*="code-block"] {
          background-color: ${isWp ? hexToRgba(baseColor, 0.88) : c.background} !important;
          background: ${isWp ? hexToRgba(baseColor, 0.88) : c.background} !important;
          border: 1px solid ${border} !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px ${sidebarHover} !important;
          backdrop-filter: blur(20px) saturate(140%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
          overflow: hidden !important;
          margin: 14px 0 !important;
        }

        div.contain-inline-size > div:first-child,
        div[class*="contain-inline-size"] > div:first-child,
        div:has(> pre) > div:first-child,
        pre > div:first-child {
          background: rgba(255, 255, 255, 0.06) !important;
          border-bottom: 1px solid ${border} !important;
          color: #CBD5E1 !important;
          padding: 8px 14px !important;
        }

        div.contain-inline-size code,
        div[class*="contain-inline-size"] code,
        div:has(> pre) code,
        pre code,
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
    },

    buildClaudeTheme(c, theme, isWp, glassBlur) {
      const userText = c.userBubbleText || '#FFFFFF';
      const rootBg = isWp ? 'transparent' : c.background;
      const glassFilter = isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : '';

      return `
        :root {
          --bg-000: ${rootBg} !important;
          --bg-100: ${rootBg} !important;
          --bg-200: ${rootBg} !important;
        }

        html, body, main, [class*="bg-bg-"] {
          background-color: transparent !important;
          background: transparent !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          color: ${isWp ? '#F8FAFC' : c.text} !important;
        }

        nav, aside, [data-testid="sidebar"], [class*="bg-bg-000"], [class*="bg-bg-200"] {
          background-color: ${isWp ? 'rgba(12, 10, 20, 0.85)' : c.sidebar} !important;
          border-right: 1px solid ${c.border} !important;
          ${glassFilter}
        }

        div[contenteditable="true"], .ProseMirror, textarea:not(#promptcanvas-root *) {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.82)' : c.inputBg} !important;
          color: #FFFFFF !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: 20px !important;
          border: 1px solid ${c.border} !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35) !important;
          ${glassFilter}
        }

        [data-testid="user-message"], [class*="font-user-message"] {
          background: ${isWp ? c.userBubble : c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '14px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
          padding: 12px 18px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
          ${glassFilter}
        }

        [class*="font-claude-message"] {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.72)' : 'transparent'} !important;
          border-radius: 14px !important;
          border: ${isWp ? `1px solid ${c.border}` : 'none'} !important;
          padding: 14px 18px !important;
          color: #F8FAFC !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          ${isWp ? glassFilter : ''}
        }

        pre:not(#promptcanvas-root *), [class*="code-block"] {
          background-color: ${isWp ? 'rgba(10, 8, 16, 0.88)' : c.background} !important;
          border: 1px solid ${c.border} !important;
          border-radius: 8px !important;
          font-family: 'JetBrains Mono', monospace !important;
          color: ${c.primary} !important;
        }

        pre code, pre span {
          background: transparent !important;
          border: none !important;
        }

        :not(pre) > code {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid ${c.border} !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
        }

        [role="tooltip"] {
          background: ${c.background || '#18181B'} !important;
          background-color: ${c.background || '#18181B'} !important;
          color: ${c.secondary || c.primary || '#F59E0B'} !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 9999px !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          padding: 6px 12px !important;
          font-weight: 600 !important;
          z-index: 99999 !important;
        }

        a:not(#promptcanvas-root *) { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.sidebarHover}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildDeepSeekTheme(c, theme, isWp, glassBlur) {
      const userText = c.userBubbleText || '#FFFFFF';
      const rootBg = isWp ? 'transparent' : c.background;
      const glassFilter = isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : '';

      return `
        html, body, #root, [class*="chat-page"], [class*="chat-scroll"] {
          background-color: transparent !important;
          background: transparent !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          color: ${isWp ? '#F8FAFC' : c.text} !important;
        }

        [class*="sidebar"], [class*="side-bar"], [class*="ds-sidebar"] {
          background-color: ${isWp ? 'rgba(12, 10, 20, 0.85)' : c.sidebar} !important;
          border-right: 1px solid ${c.border} !important;
          ${glassFilter}
        }

        #chat-input, textarea:not(#promptcanvas-root *), [class*="input-box"], [class*="ds-input"] {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.82)' : c.inputBg} !important;
          color: #FFFFFF !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: 20px !important;
          border: 1px solid ${c.border} !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35) !important;
          ${glassFilter}
        }

        [class*="user-message"], [class*="bubble-user"], [class*="_user_"] {
          background: ${isWp ? c.userBubble : c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '14px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
          ${glassFilter}
        }

        [class*="assistant-message"], [class*="_assistant_"] {
          background: ${isWp ? 'rgba(18, 15, 28, 0.72)' : 'transparent'} !important;
          border-radius: 14px !important;
          border: ${isWp ? `1px solid ${c.border}` : 'none'} !important;
          padding: 14px 18px !important;
          color: #F8FAFC !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          ${isWp ? glassFilter : ''}
        }

        pre:not(#promptcanvas-root *), [class*="code-block"] {
          background-color: ${isWp ? 'rgba(10, 8, 16, 0.88)' : c.background} !important;
          border: 1px solid ${c.border} !important;
          border-radius: 8px !important;
          font-family: 'JetBrains Mono', monospace !important;
          color: ${c.primary} !important;
        }

        pre code, pre span {
          background: transparent !important;
          border: none !important;
        }

        :not(pre) > code {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid ${c.border} !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
        }

        [role="tooltip"] {
          background: ${c.background || '#18181B'} !important;
          background-color: ${c.background || '#18181B'} !important;
          color: ${c.secondary || c.primary || '#F59E0B'} !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 9999px !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          padding: 6px 12px !important;
          font-weight: 600 !important;
          z-index: 99999 !important;
        }

        a:not(#promptcanvas-root *) { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.sidebarHover}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildGeminiTheme(c, theme, isWp, glassBlur) {
      const userText = c.userBubbleText || '#FFFFFF';
      const rootBg = isWp ? 'transparent' : c.background;
      const glassFilter = isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : '';

      return `
        html, body, .conversation-container, .chat-history, main {
          background-color: transparent !important;
          background: transparent !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          color: ${isWp ? '#F8FAFC' : c.text} !important;
        }

        side-nav, nav, mat-sidenav {
          background-color: ${isWp ? 'rgba(12, 10, 20, 0.85)' : c.sidebar} !important;
          border-right: 1px solid ${c.border} !important;
          ${glassFilter}
        }

        .input-area, rich-textarea, .ql-editor, [jsname="tKMEOc"], footer {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.82)' : c.inputBg} !important;
          border: 1px solid ${c.border} !important;
          color: #FFFFFF !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: 22px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35) !important;
          ${glassFilter}
        }

        .user-query-bubble-with-background, .user-query-bubble {
          background: ${isWp ? c.userBubble : c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '14px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
          ${glassFilter}
        }

        model-response, .model-response-text {
          color: #F8FAFC !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
        }

        pre:not(#promptcanvas-root *), .code-block {
          background-color: ${isWp ? 'rgba(10, 8, 16, 0.88)' : c.background} !important;
          border: 1px solid ${c.border} !important;
          border-radius: 8px !important;
          font-family: 'JetBrains Mono', monospace !important;
          color: ${c.primary} !important;
        }

        pre code, pre span {
          background: transparent !important;
          border: none !important;
        }

        :not(pre) > code {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid ${c.border} !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
        }

        [role="tooltip"] {
          background: ${c.background || '#18181B'} !important;
          background-color: ${c.background || '#18181B'} !important;
          color: ${c.secondary || c.primary || '#F59E0B'} !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 9999px !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          padding: 6px 12px !important;
          font-weight: 600 !important;
          z-index: 99999 !important;
        }

        a:not(#promptcanvas-root *) { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${c.sidebarHover}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildLeetCodeTheme(c, theme, isWp, glassBlur) {
      const rootBg = isWp ? 'transparent' : c.background;
      const glassFilter = isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : '';

      return `
        /* Non-invasive LeetCode Glassmorphism Theme (Zero layout shift) */
        html, body, #__next {
          background-color: ${rootBg} !important;
          color: #F8FAFC !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
        }

        /* Navigation Header */
        nav, header, [id="navbar"], [class*="bg-layer-1"] {
          background-color: ${isWp ? 'rgba(15, 13, 24, 0.82)' : c.surface} !important;
          border-bottom: 1px solid rgba(255, 166, 73, 0.2) !important;
          ${glassFilter}
        }

        /* Description / Editorial / Solutions Panels */
        [data-track-load="description_content"],
        [class*="description"],
        div[class*="bg-layer-bg"],
        div[class*="bg-layer-2"],
        div[class*="bg-fill-"] {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.74)' : c.surface} !important;
          ${glassFilter}
          border: 1px solid rgba(255, 166, 73, 0.22) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35) !important;
        }

        /* Monaco Code Editor Translucency */
        .monaco-editor,
        .monaco-editor-background,
        .monaco-editor .margin,
        .monaco-editor .inputarea.ime-input {
          background-color: ${isWp ? 'rgba(14, 12, 22, 0.78)' : c.background} !important;
          ${glassFilter}
        }

        .monaco-editor .line-numbers {
          color: rgba(255, 166, 73, 0.5) !important;
        }

        /* Submit Button Glow */
        button[data-e2e-tracking="run-code"],
        button[data-e2e-tracking="submit-code"],
        [class*="btn-brand"],
        [class*="bg-brand"] {
          background: #FFA649 !important;
          color: #0F172A !important;
          font-weight: 700 !important;
          border: none !important;
          box-shadow: 0 0 16px rgba(255, 166, 73, 0.45) !important;
        }

        pre, code, [class*="example-"], [class*="code-"] {
          background-color: ${isWp ? 'rgba(10, 8, 16, 0.88)' : c.background} !important;
          border: 1px solid rgba(255, 166, 73, 0.25) !important;
          border-radius: 6px !important;
          color: #FFA649 !important;
        }

        /* Testcase & Console Tabs */
        [class*="testcase"], [class*="console"], [class*="tab-pane"] {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.74)' : c.surface} !important;
          ${glassFilter}
          border: 1px solid rgba(255, 166, 73, 0.22) !important;
        }

        a { color: #FFA649 !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 166, 73, 0.25); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #FFA649; }
      `;
    },

    buildGenericTheme(c, theme, isWp, glassBlur) {
      const rootBg = isWp ? 'transparent' : c.background;
      const glassFilter = isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : '';

      return `
        html, body {
          background-color: ${rootBg} !important;
          color: ${isWp ? '#F8FAFC' : c.text} !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
        }
        main, section, article {
          background-color: transparent !important;
        }
        nav, aside, header {
          background-color: ${isWp ? 'rgba(14, 12, 22, 0.82)' : c.surface} !important;
          border-color: rgba(255, 166, 73, 0.2) !important;
          ${glassFilter}
        }
        textarea:not(#promptcanvas-root *), input[type="text"]:not(#promptcanvas-root *) {
          background-color: ${isWp ? 'rgba(18, 15, 28, 0.82)' : c.inputBg} !important;
          color: #FFFFFF !important;
          border: 1px solid rgba(255, 166, 73, 0.3) !important;
          border-radius: 12px !important;
          ${glassFilter}
        }
        pre:not(#promptcanvas-root *), code:not(#promptcanvas-root *) {
          background-color: ${isWp ? 'rgba(10, 8, 16, 0.88)' : c.background} !important;
          color: ${c.primary || '#FFA649'} !important;
          border: 1px solid rgba(255, 166, 73, 0.25) !important;
          border-radius: 6px !important;
        }
        [role="tooltip"] {
          background: ${c.background || '#18181B'} !important;
          background-color: ${c.background || '#18181B'} !important;
          color: ${c.primary || '#FFA649'} !important;
          border: 1px solid rgba(255, 255, 255, 0.16) !important;
          border-radius: 9999px !important;
          box-shadow: none !important;
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          padding: 6px 12px !important;
          font-weight: 600 !important;
          z-index: 99999 !important;
        }

        a:not(#promptcanvas-root *) { color: ${c.primary || '#FFA649'} !important; }
      `;
    }
  };

  root.PCThemeEngine = PCThemeEngine;
})(typeof window !== 'undefined' ? window : this);
