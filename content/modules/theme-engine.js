// PromptCanvas Theme & Wallpaper Engine
// Handles dynamic glassmorphism, wallpaper injection & non-invasive styling for ChatGPT, Claude, Gemini, DeepSeek, LeetCode
// Guarantees zero layout shift & full transparency on host application wrappers

(function (root) {
  'use strict';

  let themeStyleEl = null;
  let wallpaperHostEl = null;
  let wallpaperOverlayEl = null;

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

    applyWallpaper(theme, themeEnabled) {
      const wp = theme?.wallpaper;
      const isEnabled = Boolean(themeEnabled && wp && wp.enabled);

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

    applyCSSVars(theme, themeEnabled) {
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

      const isWp = Boolean(themeEnabled && theme?.wallpaper?.enabled);
      const panelBlur = isWp ? (theme.wallpaper?.panelBlur || 14) : 0;
      docRoot.style.setProperty('--pc-panel-blur', `${panelBlur}px`);
    },

    applyPageTheme(theme, platform, themeEnabled) {
      this.applyWallpaper(theme, themeEnabled);

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
      const isWp = Boolean(themeEnabled && theme?.wallpaper?.enabled);
      const glassBlur = isWp ? (theme.wallpaper?.panelBlur || 14) : 0;

      let css = '';
      if (platform === 'chatgpt') css = this.buildChatGPTTheme(c, theme, isWp, glassBlur);
      else if (platform === 'gemini') css = this.buildGeminiTheme(c, theme, isWp, glassBlur);
      else if (platform === 'claude') css = this.buildClaudeTheme(c, theme, isWp, glassBlur);
      else if (platform === 'deepseek') css = this.buildDeepSeekTheme(c, theme, isWp, glassBlur);
      else if (platform === 'leetcode') css = this.buildLeetCodeTheme(c, theme, isWp, glassBlur);
      else css = this.buildGenericTheme(c, theme, isWp, glassBlur);

      themeStyleEl.textContent = css;
    },

    buildChatGPTTheme(c, theme, isWp, glassBlur) {
      const userText = c.userBubbleText || '#FFFFFF';
      const rootBg = isWp ? 'transparent' : c.background;
      const glassFilter = isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : '';
      const primary = c.primary || '#EF4444';
      const secondary = c.secondary || '#F59E0B';
      const border = c.border || 'rgba(239, 68, 68, 0.32)';
      const sidebarHover = c.sidebarHover || 'rgba(239, 68, 68, 0.14)';

      return `
        /* Force surface tokens on :root, html, body, and ChatGPT's .light / .dark classes */
        :root,
        html,
        body,
        html.light,
        html.dark,
        .light,
        .dark {
          --main-surface-primary: ${rootBg} !important;
          --main-surface-secondary: ${rootBg} !important;
          --main-surface-tertiary: ${rootBg} !important;
          --token-main-surface-primary: ${rootBg} !important;
          --token-main-surface-secondary: ${rootBg} !important;
          --token-main-surface-tertiary: ${rootBg} !important;
          --token-surface-primary: ${rootBg} !important;
          --token-surface-secondary: ${rootBg} !important;
          --token-surface-tertiary: ${rootBg} !important;
          --composer-surface: ${rootBg} !important;
          --composer-background: ${rootBg} !important;
          --sidebar-surface-primary: ${isWp ? 'rgba(15, 14, 23, 0.84)' : c.sidebar} !important;
          --sidebar-surface-secondary: ${isWp ? 'rgba(255, 255, 255, 0.06)' : c.sidebarHover} !important;
          --sidebar-surface-tertiary: ${isWp ? 'rgba(255, 255, 255, 0.1)' : c.sidebarHover} !important;
          --token-sidebar-surface-primary: ${isWp ? 'rgba(15, 14, 23, 0.84)' : c.sidebar} !important;
          --token-sidebar-surface-secondary: ${isWp ? 'rgba(255, 255, 255, 0.06)' : c.sidebarHover} !important;
          --token-sidebar-surface-tertiary: ${isWp ? 'rgba(255, 255, 255, 0.1)' : c.sidebarHover} !important;
        }

        html, body, #__next, #root,
        main, main > div,
        header,
        div.draggable,
        div[class*="draggable"],
        div[class*="min-h-[--header-height]"],
        div[class*="top-0"]:not(nav *):not(aside *),
        div.sticky.top-0:not(nav *):not(aside *),
        [class*="sticky"][class*="top-0"]:not(nav *):not(aside *),
        div:has(> button[data-testid*="model-switcher"]),
        div:has(> button[aria-label*="model" i]),
        div[id^="radix-"],
        div[class*="overflow-y-auto"],
        div[class*="react-scroll-to-bottom"],
        div[class*="bg-token-main-surface-primary"],
        div[class*="bg-token-main-surface-secondary"],
        div[class*="bg-token-main-surface-tertiary"],
        div[class*="bg-[#212121]"],
        div[class*="bg-[#171717]"],
        div[class*="bg-[#2f2f2f]"],
        div[class*="bg-[#f4f4f4]"],
        div[class*="bg-black"],
        div[class*="bg-white"],
        div[class*="bg-gray-800"],
        div[class*="bg-gray-900"],
        div[class*="composer-parent"],
        div[class*="stretch"],
        div[class*="bottom-0"],
        div[class*="from-token-main-surface-primary"],
        div[class*="from-white"],
        div[class*="via-white"],
        div[class*="to-transparent"],
        div[class*="bg-gradient-to-t"],
        form[class*="w-full"],
        form,
        footer {
          background-color: transparent !important;
          background: transparent !important;
        }

        html, body {
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          color: ${c.text} !important;
        }

        /* Left Navigation Sidebar Glassmorphism Container - Deep Moody Slate Frosted Glass */
        nav:not(#promptcanvas-root *),
        aside,
        [data-testid*="sidebar"] {
          background: ${isWp ? 'rgba(14, 13, 22, 0.88)' : c.sidebar} !important;
          backdrop-filter: blur(28px) saturate(150%) !important;
          -webkit-backdrop-filter: blur(28px) saturate(150%) !important;
          border-right: 1px solid ${border} !important;
          box-shadow: 4px 0 28px rgba(0, 0, 0, 0.5) !important;
        }

        /* Outer wrappers and all inner nested wrappers inside the sidebar must be transparent to prevent double opacity */
        div.flex-shrink-0:has(nav),
        div[class*="bg-token-sidebar-surface-primary"],
        nav:not(#promptcanvas-root *) > div,
        nav:not(#promptcanvas-root *) div[class*="overflow-y-auto"],
        nav:not(#promptcanvas-root *) div[class*="overflow-x-hidden"],
        nav:not(#promptcanvas-root *) ol,
        nav:not(#promptcanvas-root *) ul,
        nav:not(#promptcanvas-root *) div[class*="bg-[#171717]"],
        nav:not(#promptcanvas-root *) div[class*="bg-[#212121]"],
        nav:not(#promptcanvas-root *) div[class*="bg-token-sidebar-surface-secondary"],
        nav:not(#promptcanvas-root *) div[class*="sticky"] {
          background: transparent !important;
          background-color: transparent !important;
        }

        /* ==========================================================================
           Input Composer Capsule - Enhanced Atmospheric Frosted Glass Container
           ========================================================================== */
        [data-pc-composer="true"],
        .pc-composer-capsule,
        #composer-background,
        div[id="composer-background"],
        [data-composer-surface],
        [data-testid*="composer-background"],
        [data-testid*="composer"]:not(button):not(svg),
        form:has(#prompt-textarea) [class*="rounded-3xl"],
        form:has(#prompt-textarea) [class*="rounded-[2"],
        form:has(#prompt-textarea) [class*="rounded-full"],
        form div:has(#prompt-textarea):has(button),
        /* Any container with rounded borders containing prompt textarea or ProseMirror */
        div[class*="rounded-3xl"]:has(#prompt-textarea),
        div[class*="rounded-full"]:has(#prompt-textarea),
        div[class*="rounded-[2"]:has(#prompt-textarea),
        div[class*="rounded"]:has(#prompt-textarea),
        div[class*="rounded"]:has(.ProseMirror),
        div[class*="rounded"]:has(textarea:not(#pc-page-theme *)),
        div[class*="rounded"]:has(div[contenteditable="true"]:not(#promptcanvas-root *)),
        /* Modern ChatGPT pill classes */
        div[class*="composer-parent"] div[class*="rounded"],
        div:has(> #composer-background),
        form div[class*="rounded"]:has(#prompt-textarea),
        form:has(#prompt-textarea) > div,
        form:has(#composer-background) > div {
          background: ${isWp ? 'rgba(16, 14, 24, 0.88)' : c.inputBg} !important;
          background-color: ${isWp ? 'rgba(16, 14, 24, 0.88)' : c.inputBg} !important;
          border: 1px solid ${border} !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.65), 0 0 20px ${sidebarHover}, inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
          backdrop-filter: blur(28px) saturate(150%) !important;
          -webkit-backdrop-filter: blur(28px) saturate(150%) !important;
          border-radius: 9999px !important;
          transition: border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* Hover & Focus-within state for the capsule with radiant glow */
        [data-pc-composer="true"]:hover,
        .pc-composer-capsule:hover,
        #composer-background:hover,
        div[class*="rounded"]:has(#prompt-textarea):hover,
        form:has(#prompt-textarea) > div:hover,
        form div:has(#prompt-textarea):has(button):hover {
          border-color: ${primary} !important;
          box-shadow: 0 12px 44px rgba(0, 0, 0, 0.7), 0 0 26px ${sidebarHover}, inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
        }

        [data-pc-composer="true"]:focus-within,
        .pc-composer-capsule:focus-within,
        #composer-background:focus-within,
        div[class*="rounded"]:has(#prompt-textarea):focus-within,
        form:has(#prompt-textarea) > div:focus-within,
        form div:has(#prompt-textarea):has(button):focus-within {
          border-color: ${primary} !important;
          box-shadow: 0 14px 50px rgba(0, 0, 0, 0.75), 0 0 32px ${sidebarHover}, 0 0 0 1px ${primary}, inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
          transform: translateY(-1px) !important;
        }

        /* Eliminate any white boxes, token backgrounds, or double borders inside the pill */
        [data-pc-composer="true"] > div,
        .pc-composer-capsule > div,
        #composer-background > div,
        div[class*="rounded"]:has(#prompt-textarea) > div,
        [data-pc-composer="true"] div[class*="bg-white"],
        .pc-composer-capsule div[class*="bg-white"],
        #composer-background div[class*="bg-white"],
        div[class*="rounded"]:has(#prompt-textarea) div[class*="bg-white"],
        [data-pc-composer="true"] [class*="bg-token-"],
        .pc-composer-capsule [class*="bg-token-"],
        #composer-background div[class*="bg-token-"],
        div[class*="rounded"]:has(#prompt-textarea) div[class*="bg-token-"],
        [data-pc-composer="true"] [class*="bg-[#"],
        .pc-composer-capsule [class*="bg-[#"],
        #composer-background div[class*="bg-[#"],
        div[class*="rounded"]:has(#prompt-textarea) div[class*="bg-[#"],
        [data-pc-composer="true"] [class*="bg-token-main-surface-primary"],
        .pc-composer-capsule [class*="bg-token-main-surface-primary"],
        #composer-background [class*="bg-token-main-surface-primary"],
        div[class*="rounded"]:has(#prompt-textarea) [class*="bg-token-main-surface-primary"],
        [data-pc-composer="true"] [class*="bg-token-main-surface-secondary"],
        .pc-composer-capsule [class*="bg-token-main-surface-secondary"],
        #composer-background [class*="bg-token-main-surface-secondary"],
        div[class*="rounded"]:has(#prompt-textarea) [class*="bg-token-main-surface-secondary"],
        [data-pc-composer="true"] [class*="bg-token-main-surface-tertiary"],
        .pc-composer-capsule [class*="bg-token-main-surface-tertiary"],
        #composer-background [class*="bg-token-main-surface-tertiary"],
        div[class*="rounded"]:has(#prompt-textarea) [class*="bg-token-main-surface-tertiary"],
        [data-pc-composer="true"] div[class*="border"],
        .pc-composer-capsule div[class*="border"],
        #composer-background div[class*="border"],
        div[class*="rounded"]:has(#prompt-textarea) div[class*="border"],
        div[class*="rounded"]:has(#prompt-textarea) #composer-background {
          background: transparent !important;
          background-color: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }

        /* Force local CSS variable tokens inside the composer to transparent */
        [data-pc-composer="true"],
        [data-pc-composer="true"] *,
        .pc-composer-capsule,
        .pc-composer-capsule *,
        #composer-background,
        #composer-background *,
        form:has(#prompt-textarea),
        form:has(#prompt-textarea) *,
        div:has(#prompt-textarea),
        div:has(#prompt-textarea) * {
          --main-surface-primary: transparent !important;
          --main-surface-secondary: transparent !important;
          --main-surface-tertiary: transparent !important;
          --token-main-surface-primary: transparent !important;
          --token-main-surface-secondary: transparent !important;
          --token-main-surface-tertiary: transparent !important;
          --token-surface-primary: transparent !important;
          --token-surface-secondary: transparent !important;
          --token-surface-tertiary: transparent !important;
          --composer-surface: transparent !important;
          --composer-background: transparent !important;
        }

        /* Input Textarea & Contenteditable - High Contrast & Themed Cursor */
        #prompt-textarea,
        textarea:not(#promptcanvas-root *):not(#pc-page-theme *),
        .ProseMirror,
        div[contenteditable="true"]:not(#promptcanvas-root *),
        div[id*="prompt-textarea"] {
          background: transparent !important;
          background-color: transparent !important;
          color: #FFFFFF !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          line-height: 1.55 !important;
          caret-color: ${primary} !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        #prompt-textarea::placeholder,
        textarea::placeholder,
        .ProseMirror p.is-editor-empty::before,
        p[data-placeholder]::before,
        div[data-placeholder]::before,
        div[class*="placeholder"] {
          color: rgba(248, 250, 252, 0.50) !important;
        }

        /* General buttons inside the composer */
        [data-pc-composer="true"] button,
        .pc-composer-capsule button,
        #composer-background button,
        div[class*="rounded"]:has(#prompt-textarea) button,
        div:has(> #prompt-textarea) button,
        div[class*="composer-parent"] button,
        button[data-testid*="send" i],
        button[aria-label*="Think" i],
        button[aria-label*="Attach" i],
        button[aria-label*="Upload" i],
        button[aria-label*="Voice" i],
        button[aria-label*="Dictate" i] {
          color: #F8FAFC !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        [data-pc-composer="true"] button svg,
        .pc-composer-capsule button svg,
        #composer-background button svg,
        div[class*="rounded"]:has(#prompt-textarea) button svg,
        div:has(> #prompt-textarea) button svg,
        div[class*="composer-parent"] button svg,
        button[data-testid*="send" i] svg,
        button[aria-label*="Think" i] svg,
        button[aria-label*="Attach" i] svg,
        button[aria-label*="Upload" i] svg,
        button[aria-label*="Voice" i] svg,
        button[aria-label*="Dictate" i] svg {
          color: #F8FAFC !important;
          fill: currentColor !important;
          stroke: currentColor !important;
        }

        /* 1. "Think" / Reasoning Pill Button */
        /* General fallback: ALL buttons inside the composer capsule must have dark glass */
        [data-pc-composer="true"] button,
        [data-pc-composer="true"] [role="button"],
        .pc-composer-capsule button,
        .pc-composer-capsule [role="button"],
        form:has(#prompt-textarea) button,
        form:has(#prompt-textarea) [role="button"],
        form:has(#prompt-textarea) button[class*="bg-white"],
        form:has(#prompt-textarea) button[class*="bg-token-"],
        [data-pc-composer="true"] button[class*="bg-white"],
        [data-pc-composer="true"] button[class*="bg-token-"],
        .pc-composer-capsule button[class*="bg-white"],
        .pc-composer-capsule button[class*="bg-token-"] {
          background: rgba(255, 255, 255, 0.07) !important;
          background-color: rgba(255, 255, 255, 0.07) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          color: #F8FAFC !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* 1. "Think" / Reasoning Pill Button */
        [data-pc-btn="think"],
        button[aria-label*="Think" i],
        button[aria-label*="reason" i],
        button[data-testid*="think" i],
        button[data-testid*="reason" i],
        #composer-background button:has(span),
        div[class*="rounded"]:has(#prompt-textarea) button:has(span),
        .pc-composer-capsule button:has(span),
        [data-pc-composer="true"] button:has(span),
        form:has(#prompt-textarea) button:has(span) {
          background: rgba(255, 255, 255, 0.09) !important;
          background-color: rgba(255, 255, 255, 0.09) !important;
          border: 1px solid ${border} !important;
          border-radius: 9999px !important;
          padding: 5px 14px !important;
          color: #F8FAFC !important;
          font-weight: 500 !important;
          font-size: 13px !important;
          letter-spacing: 0.02em !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        [data-pc-btn="think"]:hover,
        button[aria-label*="Think" i]:hover,
        button[aria-label*="reason" i]:hover,
        button[data-testid*="think" i]:hover,
        button[data-testid*="reason" i]:hover,
        #composer-background button:has(span):hover,
        div[class*="rounded"]:has(#prompt-textarea) button:has(span):hover,
        .pc-composer-capsule button:has(span):hover,
        [data-pc-composer="true"] button:has(span):hover,
        form:has(#prompt-textarea) button:has(span):hover {
          background: ${sidebarHover} !important;
          background-color: ${sidebarHover} !important;
          border-color: ${primary} !important;
          color: ${primary} !important;
          box-shadow: 0 0 16px ${sidebarHover} !important;
          transform: translateY(-1px) !important;
        }

        [data-pc-btn="think"] span,
        button[aria-label*="Think" i] span,
        #composer-background button:has(span) span,
        div[class*="rounded"]:has(#prompt-textarea) button:has(span) span,
        [data-pc-composer="true"] button:has(span) span,
        form:has(#prompt-textarea) button:has(span) span {
          color: inherit !important;
          font-weight: 500 !important;
        }

        [data-pc-btn="think"] svg,
        button[aria-label*="Think" i] svg,
        #composer-background button:has(span) svg,
        div[class*="rounded"]:has(#prompt-textarea) button:has(span) svg,
        [data-pc-composer="true"] button:has(span) svg,
        form:has(#prompt-textarea) button:has(span) svg {
          color: inherit !important;
          fill: currentColor !important;
        }

        /* 2. Plus (+) / Attach Button */
        [data-pc-btn="attach"],
        button[aria-label*="Attach" i],
        button[aria-label*="Upload" i],
        button[aria-label*="Add" i],
        button[aria-label*="file" i],
        button[aria-label*="tool" i],
        button[aria-label*="more" i],
        button[data-testid*="attach" i],
        #composer-background button:first-of-type,
        div[class*="rounded"]:has(#prompt-textarea) button:first-of-type,
        .pc-composer-capsule button:first-of-type,
        [data-pc-composer="true"] button:first-of-type,
        form:has(#prompt-textarea) button:first-of-type {
          background: rgba(255, 255, 255, 0.08) !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          border-radius: 50% !important;
          color: #F8FAFC !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        [data-pc-btn="attach"]:hover,
        button[aria-label*="Attach" i]:hover,
        button[aria-label*="Upload" i]:hover,
        button[aria-label*="Add" i]:hover,
        button[aria-label*="file" i]:hover,
        button[aria-label*="tool" i]:hover,
        button[aria-label*="more" i]:hover,
        button[data-testid*="attach" i]:hover,
        #composer-background button:first-of-type:hover,
        div[class*="rounded"]:has(#prompt-textarea) button:first-of-type:hover,
        .pc-composer-capsule button:first-of-type:hover,
        [data-pc-composer="true"] button:first-of-type:hover,
        form:has(#prompt-textarea) button:first-of-type:hover {
          background: ${sidebarHover} !important;
          background-color: ${sidebarHover} !important;
          border-color: ${primary} !important;
          color: ${primary} !important;
          box-shadow: 0 0 14px ${sidebarHover} !important;
          transform: scale(1.08) rotate(90deg) !important;
        }

        /* 3. Dictate / Microphone, Voice, and all other trailing action buttons */
        [data-pc-btn="voice"],
        button[aria-label*="voice" i],
        button[aria-label*="dictat" i],
        button[aria-label*="record" i],
        button[aria-label*="microphone" i],
        button[data-testid*="voice" i],
        button[data-testid*="dictate" i],
        [data-pc-composer="true"] button:not(:first-of-type):not([data-pc-btn="think"]):not([data-pc-btn="send"]),
        .pc-composer-capsule button:not(:first-of-type):not([data-pc-btn="think"]):not([data-pc-btn="send"]),
        form:has(#prompt-textarea) button:not(:first-of-type):not([data-pc-btn="think"]):not([data-pc-btn="send"]) {
          background: rgba(255, 255, 255, 0.07) !important;
          background-color: rgba(255, 255, 255, 0.07) !important;
          border: 1px solid rgba(255, 255, 255, 0.14) !important;
          border-radius: 50% !important;
          color: #CBD5E1 !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
          transition: all 0.2s ease !important;
        }

        [data-pc-btn="voice"]:hover,
        button[aria-label*="voice" i]:hover,
        button[aria-label*="dictat" i]:hover,
        button[aria-label*="record" i]:hover,
        button[aria-label*="microphone" i]:hover,
        button[data-testid*="voice" i]:hover,
        button[data-testid*="dictate" i]:hover,
        [data-pc-composer="true"] button:not(:first-of-type):not([data-pc-btn="think"]):not([data-pc-btn="send"]):hover,
        .pc-composer-capsule button:not(:first-of-type):not([data-pc-btn="think"]):not([data-pc-btn="send"]):hover,
        form:has(#prompt-textarea) button:not(:first-of-type):not([data-pc-btn="think"]):not([data-pc-btn="send"]):hover {
          background: ${sidebarHover} !important;
          background-color: ${sidebarHover} !important;
          border-color: ${border} !important;
          color: ${primary} !important;
          transform: scale(1.08) !important;
          box-shadow: 0 0 12px ${sidebarHover} !important;
        }

        /* 4. Glowing Voice Mode Pill/Circle */
        button[aria-label*="Voice mode" i],
        button[data-testid*="voice-mode"],
        button[data-testid*="voice"]:has(svg) {
          box-shadow: 0 0 16px ${primary} !important;
        }

        /* 5. Send / Submit Button */
        [data-pc-btn="send"],
        button[data-testid*="send" i],
        button[aria-label*="Send" i],
        #composer-background button[data-testid*="send" i],
        div[class*="rounded"]:has(#prompt-textarea) button[data-testid*="send" i],
        .pc-composer-capsule button[data-testid*="send" i],
        [data-pc-composer="true"] button[data-testid*="send" i],
        form:has(#prompt-textarea) button[data-testid*="send" i] {
          background: linear-gradient(135deg, ${primary}, ${secondary || primary}) !important;
          background-color: ${primary} !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 0 18px ${sidebarHover}, 0 4px 14px rgba(0, 0, 0, 0.4) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* Ensure all SVGs and text inside composer buttons inherit crisp colors */
        [data-pc-composer="true"] button *,
        .pc-composer-capsule button *,
        form:has(#prompt-textarea) button * {
          background: transparent !important;
          background-color: transparent !important;
        }

        [data-pc-composer="true"] button svg,
        .pc-composer-capsule button svg,
        form:has(#prompt-textarea) button svg,
        [data-pc-btn] svg {
          color: inherit !important;
          fill: currentColor !important;
        }

        [data-pc-btn="send"]:hover,
        button[data-testid*="send" i]:hover,
        button[aria-label*="Send" i]:hover {
          filter: brightness(1.15) !important;
          box-shadow: 0 0 28px ${primary} !important;
          transform: scale(1.1) !important;
        }

        button[data-testid*="send" i]:disabled,
        button[aria-label*="Send" i]:disabled {
          background: rgba(255, 255, 255, 0.12) !important;
          background-color: rgba(255, 255, 255, 0.12) !important;
          color: rgba(255, 255, 255, 0.35) !important;
          box-shadow: none !important;
          opacity: 0.5 !important;
          transform: none !important;
        }

        /* User Message Bubble - High Quality Glass Capsule */
        [data-message-author-role="user"] div[class*="rounded"],
        [data-message-author-role="user"] div[class*="bg-"],
        div[class*="user-turn"] div[class*="rounded"],
        div[class*="user-turn"] div[class*="bg-"] {
          background: ${isWp ? 'rgba(26, 22, 38, 0.88)' : c.userBubble} !important;
          border-radius: 20px !important;
          color: #FFFFFF !important;
          border: 1px solid ${border} !important;
          backdrop-filter: blur(20px) saturate(140%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45), 0 0 12px ${sidebarHover} !important;
          padding: 10px 18px !important;
          min-width: 48px !important;
          display: inline-flex !important;
          align-items: center !important;
        }

        [data-message-author-role="user"] :is(p, span, div) {
          color: #FFFFFF !important;
          font-weight: 500 !important;
        }

        /* Assistant Message Frosted Glass Card */
        [data-message-author-role="assistant"],
        div[class*="agent-turn"] {
          display: block !important;
          width: 100% !important;
          background: ${isWp ? 'rgba(18, 15, 28, 0.82)' : 'transparent'} !important;
          border-radius: 18px !important;
          border: ${isWp ? `1px solid ${border}` : 'none'} !important;
          backdrop-filter: blur(20px) saturate(140%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
          padding: 18px 24px !important;
          margin: 12px 0 !important;
          color: #F8FAFC !important;
          box-shadow: ${isWp ? `0 8px 32px rgba(0, 0, 0, 0.45), 0 0 14px ${sidebarHover}` : 'none'} !important;
        }

        [data-message-author-role="assistant"] > div,
        [data-message-author-role="assistant"] div.markdown {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        /* Action buttons inside / below assistant turn (copy, speaker, regenerate) */
        div[class*="agent-turn"] button,
        [data-message-author-role="assistant"] button,
        [data-message-author-role="assistant"] ~ div button,
        button[aria-label*="Copy"],
        button[aria-label*="Read aloud"],
        button[aria-label*="Good response"],
        button[aria-label*="Bad response"],
        button[aria-label*="Retry"],
        button[aria-label*="More actions"] {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid ${border} !important;
          border-radius: 8px !important;
          color: #CBD5E1 !important;
          padding: 4px 8px !important;
          transition: all 0.15s ease !important;
        }

        div[class*="agent-turn"] button:hover,
        [data-message-author-role="assistant"] button:hover,
        button[aria-label*="Copy"]:hover,
        button[aria-label*="Read aloud"]:hover,
        button[aria-label*="Retry"]:hover {
          background: ${sidebarHover} !important;
          color: ${primary} !important;
          border-color: ${primary} !important;
        }

        /* Top Sidebar Header & Toggle */
        nav [class*="sticky top-0"],
        aside [class*="sticky top-0"],
        nav header, aside header,
        nav div[class*="bg-white"],
        nav button[class*="bg-white"],
        div[class*="bg-token-sidebar-surface-primary"] [class*="sticky top-0"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
        }

        nav button[aria-label*="sidebar" i],
        nav button[aria-label*="Close sidebar" i],
        nav button[aria-label*="Open sidebar" i] {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 7px !important;
          color: #CBD5E1 !important;
          transition: all 0.15s ease !important;
        }
        nav button[aria-label*="sidebar" i]:hover,
        nav button[aria-label*="Close sidebar" i]:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          color: ${primary} !important;
          border-color: ${border} !important;
        }

        /* "New chat" Quick Action Pill */
        nav a[href="/"],
        nav button[data-testid*="new-chat"],
        nav a:first-of-type {
          background: rgba(255, 255, 255, 0.06) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          color: #F8FAFC !important;
          font-weight: 500 !important;
          font-size: 13.5px !important;
          padding: 8px 12px !important;
          margin: 4px 2px 8px 2px !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          box-shadow: none !important;
          transition: all 0.18s ease !important;
        }

        nav a[href="/"]:hover,
        nav button[data-testid*="new-chat"]:hover,
        nav a:first-of-type:hover {
          background: ${sidebarHover} !important;
          border-color: ${border} !important;
          color: ${primary} !important;
        }
        nav a[href="/"] svg,
        nav a:first-of-type svg {
          color: ${primary} !important;
        }

        /* Sidebar Top Navigation Items (Scheduled, Library, Plugins, Codex, Explore) */
        nav a:not([href="/"]):not([href*="/c/"]),
        nav button:not([href="/"]):not([data-testid*="profile"]) {
          color: #94A3B8 !important;
          border-radius: 7px !important;
          padding: 6px 10px !important;
          font-size: 13px !important;
          font-weight: 450 !important;
          transition: all 0.15s ease !important;
        }

        nav a:not([href="/"]):not([href*="/c/"]):hover,
        nav button:not([href="/"]):not([data-testid*="profile"]):hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: #F8FAFC !important;
        }

        nav a:not([href="/"]):not([href*="/c/"]) svg {
          color: #94A3B8 !important;
        }
        nav a:not([href="/"]):not([href*="/c/"]):hover svg {
          color: ${primary} !important;
        }

        /* Section Headers ("Pinned", "Today", "Previous 7 Days") */
        nav h2, nav h3,
        nav [class*="text-token-text-tertiary"],
        nav div[class*="text-xs"][class*="font-semibold"] {
          font-size: 11px !important;
          font-weight: 600 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.07em !important;
          color: #64748B !important;
          padding: 14px 10px 4px 10px !important;
          background: transparent !important;
        }

        /* Chat History Rows - Professional, Flush, Calm (NO chunky orange pills) */
        nav ol li,
        nav ul li,
        nav ol li div[class*="group"],
        nav ul li div[class*="group"],
        nav ol a,
        nav ul a,
        nav li a,
        nav a[href*="/c/"] {
          background: transparent !important;
          background-color: transparent !important;
          border: 1px solid transparent !important;
          border-radius: 7px !important;
          box-shadow: none !important;
          transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
        }

        nav a[href*="/c/"],
        nav ol a,
        nav ul a,
        nav li a,
        nav ol li div[class*="grow"],
        nav ul li div[class*="grow"] {
          color: #CBD5E1 !important;
          font-size: 13.5px !important;
          font-weight: 400 !important;
        }

        /* Soft neutral glass highlight on row hover */
        nav ol li:hover,
        nav ul li:hover,
        nav ol li:hover > div,
        nav ul li:hover > div,
        nav ol li:hover a,
        nav ul li:hover a,
        nav a[href*="/c/"]:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          color: #FFFFFF !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        nav ol li:hover div[class*="grow"],
        nav ul li:hover div[class*="grow"] {
          color: #FFFFFF !important;
        }

        /* Active / Currently Open Chat - Linear Style Indicator & Glowing State */
        nav ol li:has([class*="bg-token-sidebar-surface-secondary"]) > div,
        nav ul li:has([class*="bg-token-sidebar-surface-secondary"]) > div,
        nav li:has([class*="bg-token-sidebar-surface-secondary"]),
        nav ol li:has([class*="bg-token-sidebar-surface-tertiary"]),
        nav ul li:has([class*="bg-token-sidebar-surface-tertiary"]),
        nav ol li:has(a[aria-current="page"]) > div,
        nav ul li:has(a[aria-current="page"]) > div,
        nav li[data-active="true"] > div,
        nav ol li:has(a[aria-current="page"]),
        nav ul li:has(a[aria-current="page"]) {
          background: ${sidebarHover} !important;
          border: 1px solid ${border} !important;
          border-left: 3px solid ${primary} !important;
          border-radius: 8px !important;
        }

        nav a[aria-current="page"],
        nav li[data-active="true"] a {
          border: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        nav li:has([class*="bg-token-sidebar-surface-secondary"]) div[class*="grow"],
        nav li:has([class*="bg-token-sidebar-surface-secondary"]) span,
        nav a[aria-current="page"] div[class*="grow"],
        nav li[data-active="true"] div[class*="grow"],
        nav a[aria-current="page"] span,
        nav li[data-active="true"] span {
          color: #FFFFFF !important;
          font-weight: 600 !important;
        }

        nav li:has([class*="bg-token-sidebar-surface-secondary"]) svg,
        nav a[aria-current="page"] svg,
        nav li[data-active="true"] svg {
          color: ${primary} !important;
        }

        /* Chat Item Action Menu Button (...) */
        nav li button,
        nav ol li button,
        nav button[id^="radix-"][aria-haspopup="menu"] {
          background: rgba(255, 255, 255, 0.08) !important;
          border-radius: 5px !important;
          color: #94A3B8 !important;
          transition: all 0.15s ease !important;
        }

        nav li button:hover,
        nav ol li button:hover {
          background: ${sidebarHover} !important;
          color: ${primary} !important;
        }

        /* Bottom User Profile Card ("Saisagar") */
        nav div[class*="sticky bottom-0"],
        aside div[class*="sticky bottom-0"] {
          background: transparent !important;
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
          padding: 8px 6px 10px 6px !important;
          margin-top: 8px !important;
        }

        nav div[class*="sticky bottom-0"] button,
        nav [data-testid*="user-menu"],
        nav [data-testid*="profile"] {
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 10px !important;
          padding: 7px 10px !important;
          width: 100% !important;
          transition: all 0.18s ease !important;
        }

        nav div[class*="sticky bottom-0"] button:hover,
        nav [data-testid*="user-menu"]:hover,
        nav [data-testid*="profile"]:hover {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: ${border} !important;
        }

        /* User Avatar Circle */
        nav div[class*="sticky bottom-0"] button div[class*="rounded-full"],
        nav [data-testid*="user-menu"] div[class*="rounded-full"] {
          background: linear-gradient(135deg, ${primary}, ${secondary}) !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
          box-shadow: 0 0 10px ${sidebarHover} !important;
        }

        /* User Name & Subscription */
        nav div[class*="sticky bottom-0"] button [class*="font-semibold"],
        nav div[class*="sticky bottom-0"] button div[class*="text-token-text-primary"] {
          color: #F8FAFC !important;
          font-size: 13.5px !important;
        }

        nav div[class*="sticky bottom-0"] button [class*="text-xs"],
        nav div[class*="sticky bottom-0"] button div[class*="text-token-text-tertiary"] {
          color: ${primary} !important;
          font-size: 11px !important;
          font-weight: 600 !important;
        }

        /* Sidebar Custom Scrollbar */
        nav ::-webkit-scrollbar,
        aside ::-webkit-scrollbar {
          width: 4px !important;
        }
        nav ::-webkit-scrollbar-track,
        aside ::-webkit-scrollbar-track {
          background: transparent !important;
        }
        nav ::-webkit-scrollbar-thumb,
        aside ::-webkit-scrollbar-thumb {
          background: ${sidebarHover} !important;
          border-radius: 4px !important;
        }
        nav ::-webkit-scrollbar-thumb:hover,
        aside ::-webkit-scrollbar-thumb:hover {
          background: ${primary} !important;
        }

        /* Top Header and All Inner Header Containers - Full Transparency */
        header,
        header *,
        div.draggable,
        div.draggable *,
        div[class*="draggable"],
        div[class*="draggable"] *,
        div[class*="min-h-[--header-height]"],
        div[class*="min-h-[--header-height]"] *,
        div.sticky.top-0:not(nav *):not(aside *),
        div.sticky.top-0:not(nav *):not(aside *) *,
        div[class*="top-0"]:not(nav *):not(aside *),
        div[class*="top-0"]:not(nav *):not(aside *) * {
          --main-surface-primary: transparent !important;
          --main-surface-secondary: transparent !important;
          --main-surface-tertiary: transparent !important;
          --token-main-surface-primary: transparent !important;
          --token-main-surface-secondary: transparent !important;
          --token-main-surface-tertiary: transparent !important;
          --token-surface-primary: transparent !important;
          --token-surface-secondary: transparent !important;
          --token-surface-tertiary: transparent !important;
        }

        header,
        header > div,
        header div,
        div.draggable,
        div[class*="draggable"],
        div[class*="min-h-[--header-height]"],
        div[class*="min-h-[--header-height]"] div,
        div.sticky.top-0:not(nav *):not(aside *),
        div.sticky.top-0:not(nav *):not(aside *) div,
        div[class*="top-0"]:not(nav *):not(aside *),
        div[class*="top-0"]:not(nav *):not(aside *) div,
        div[class*="bg-white"]:has(button[aria-label*="Share"]),
        div[class*="bg-token-main-surface-primary"]:has(button[aria-label*="Share"]) {
          background: transparent !important;
          background-color: transparent !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        header button,
        header a,
        div[class*="top-0"]:not(nav *):not(aside *) button,
        div[class*="top-0"]:not(nav *):not(aside *) a,
        button[aria-label*="Share"],
        button[data-testid*="share"],
        div[class*="draggable"] button,
        button[class*="bg-token-main-surface-primary"]:not(#composer-background *):not(div:has(#prompt-textarea) *):not(form *):not(nav *),
        button[class*="bg-white"]:not(#composer-background *):not(div:has(#prompt-textarea) *):not(form *):not(#promptcanvas-root *):not(nav *) {
          background: rgba(18, 15, 28, 0.75) !important;
          border: 1px solid ${border} !important;
          border-radius: 9999px !important;
          color: #F8FAFC !important;
          backdrop-filter: blur(14px) !important;
          -webkit-backdrop-filter: blur(14px) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35) !important;
          padding: 6px 14px !important;
          transition: all 0.2s ease !important;
        }

        header button:hover,
        header a:hover,
        div[class*="top-0"]:not(nav *):not(aside *) button:hover,
        button[aria-label*="Share"]:hover,
        button[class*="bg-token-main-surface-primary"]:hover {
          background: ${sidebarHover} !important;
          border-color: ${border} !important;
          color: ${primary} !important;
        }

        header button svg,
        div[class*="top-0"]:not(nav *):not(aside *) button svg,
        button[aria-label*="Share"] svg {
          color: #F8FAFC !important;
          fill: currentColor !important;
        }

        /* Bottom Disclaimer Text */
        div[class*="text-token-text-secondary"],
        div[class*="text-token-text-tertiary"],
        div[class*="text-xs"],
        div[class*="text-[11px]"] {
          color: rgba(248, 250, 252, 0.72) !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85) !important;
        }

        /* Scroll-to-bottom Floating Button */
        button:has(svg [d*="M12 4v16"]),
        button:has(svg path[d*="m19 14"]),
        button:has(svg [d*="M19 14l-7 7m0 0l-7-7"]),
        button[class*="rounded-full"][class*="bottom-"]:not(#composer-background *):not(div:has(#prompt-textarea) *):not(form *),
        button[class*="rounded-full"]:has(svg):not(#composer-background *):not(div:has(#prompt-textarea) *):not(form *):not(nav *):not(header *) {
          background: rgba(18, 15, 28, 0.85) !important;
          border: 1px solid ${border} !important;
          color: #F8FAFC !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 12px ${sidebarHover} !important;
          backdrop-filter: blur(14px) !important;
        }
        button:has(svg [d*="M12 4v16"]):hover,
        button[class*="rounded-full"][class*="bottom-"]:not(form *):hover {
          background: ${sidebarHover} !important;
          color: ${primary} !important;
          border-color: ${primary} !important;
        }
        button:has(svg [d*="M12 4v16"]) svg,
        button[class*="rounded-full"]:has(svg):not(form *):not(nav *):not(header *) svg {
          color: #F8FAFC !important;
          stroke: currentColor !important;
        }

        /* Code Blocks - Outer Glass Container targeting ChatGPT's exact DOM structure */
        div.contain-inline-size,
        div[class*="contain-inline-size"],
        div:has(> pre),
        div:has(> div > pre),
        div:has(> div > code),
        div[class*="rounded"]:has(code),
        div[class*="rounded"]:has(pre),
        pre:not(#promptcanvas-root *),
        div[class*="code-block"] {
          background-color: ${isWp ? 'rgba(14, 12, 22, 0.88)' : c.background} !important;
          background: ${isWp ? 'rgba(14, 12, 22, 0.88)' : c.background} !important;
          border: 1px solid ${border} !important;
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px ${sidebarHover} !important;
          backdrop-filter: blur(20px) saturate(140%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
          overflow: hidden !important;
          color: #F8FAFC !important;
          margin: 14px 0 !important;
        }

        /* Reset all intermediate wrappers inside the code block container to transparent */
        div.contain-inline-size > div,
        div[class*="contain-inline-size"] > div,
        div:has(> pre) > div,
        div:has(> div > pre) > div,
        div:has(> div > code) > div,
        pre,
        pre code,
        pre code span,
        pre span,
        code[class*="hljs"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Code block top header bar (e.g. "</> Plain text [Copy]") */
        div.contain-inline-size > div:first-child,
        div[class*="contain-inline-size"] > div:first-child,
        div:has(> pre) > div:first-child,
        div:has(> div > pre) > div:first-child,
        pre > div:first-child {
          background: rgba(255, 255, 255, 0.06) !important;
          border-bottom: 1px solid ${border} !important;
          color: #CBD5E1 !important;
          padding: 8px 14px !important;
        }

        div.contain-inline-size span,
        div[class*="contain-inline-size"] span,
        div:has(> pre) span {
          color: #CBD5E1 !important;
          font-weight: 500 !important;
        }

        /* Action buttons in code block header (Copy, expand) */
        div.contain-inline-size button,
        div[class*="contain-inline-size"] button,
        div:has(> pre) button,
        div:has(> div > pre) button,
        pre button {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 6px !important;
          color: #CBD5E1 !important;
          padding: 4px 8px !important;
          transition: all 0.15s ease !important;
        }

        div.contain-inline-size button:hover,
        div[class*="contain-inline-size"] button:hover,
        div:has(> pre) button:hover,
        pre button:hover {
          background: ${sidebarHover} !important;
          color: ${primary} !important;
          border-color: ${border} !important;
        }

        /* Code Text Typography & Color - Crisp & High Contrast */
        div.contain-inline-size code,
        div[class*="contain-inline-size"] code,
        div:has(> pre) code,
        div:has(> div > pre) code,
        div:has(> div > code) code,
        pre code,
        pre span,
        code span {
          color: #F8FAFC !important;
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace !important;
          font-size: 13.5px !important;
          line-height: 1.6 !important;
        }

        /* Only standalone inline code gets a pill */
        :not(pre):not(div.contain-inline-size):not([class*="contain-inline-size"]) > code {
          background: rgba(255, 255, 255, 0.10) !important;
          border: 1px solid ${border} !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-family: 'JetBrains Mono', monospace !important;
          color: ${primary} !important;
        }

        /* Headings & Text Contrast */
        h1, h2, h3, [class*="text-2xl"], [class*="text-3xl"] {
          color: #FFFFFF !important;
          text-shadow: 0 2px 14px rgba(0, 0, 0, 0.7) !important;
        }

        :is(p, span, li):not(#promptcanvas-root *):not(#pc-toggle-btn *) {
          color: ${isWp ? '#F8FAFC' : c.text} !important;
        }

        a:not(#promptcanvas-root *) { color: ${c.primary} !important; }
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
        a:not(#promptcanvas-root *) { color: ${c.primary || '#FFA649'} !important; }
      `;
    }
  };

  root.PCThemeEngine = PCThemeEngine;
})(typeof window !== 'undefined' ? window : this);
