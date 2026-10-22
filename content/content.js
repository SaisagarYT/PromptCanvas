// PromptCanvas Content Script
// Injected into ChatGPT, Claude, DeepSeek, and Gemini
// SaaS-Grade In-Page Sidebar UI (Tokyo Duo & Active Color Studio)
// Minimalist Swiss editorial aesthetics: zero gradients, zero glow effects, crisp geometry.

(function () {
  'use strict';

  if (document.getElementById('promptcanvas-root')) return;

  const PLATFORM = (() => {
    const host = window.location.hostname;
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return 'chatgpt';
    if (host.includes('gemini.google.com')) return 'gemini';
    if (host.includes('claude.ai')) return 'claude';
    if (host.includes('deepseek.com')) return 'deepseek';
    return 'unknown';
  })();

  let state = {
    open: false,
    activeTab: 'prompts',
    activeCategory: 'All',
    settings: {},
    themes: {},
    prompts: [],
    activeTheme: 'amberDuo',
    searchQuery: '',
    uiPalette: null,
  };

  let themeStyleEl = null;
  let sidebarRoot = null;

  // Suppress orphaned extension context errors when extension updates or reloads
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const msg = (event.reason?.message || event.reason || '').toString();
      if (msg.includes('Extension context invalidated') || msg.includes('getURL')) {
        event.preventDefault();
      }
    } catch (e) {}
  });

  window.addEventListener('error', (event) => {
    try {
      const msg = (event.message || '').toString();
      if (msg.includes('Extension context invalidated') || msg.includes('getURL')) {
        event.preventDefault();
      }
    } catch (e) {}
  });

  function isExtensionValid() {
    try {
      return typeof chrome !== 'undefined' && Boolean(chrome && chrome.runtime && chrome.runtime.id);
    } catch (e) {
      return false;
    }
  }

  function safeLastError() {
    try {
      if (!isExtensionValid()) return true;
      return Boolean(chrome.runtime?.lastError);
    } catch (e) {
      return true;
    }
  }

  async function init() {
    try {
      if (!isExtensionValid()) return;

      const data = await getStorage(['themes', 'prompts', 'settings', 'uiPalette']);
      if (!isExtensionValid()) return;

      state.themes = data.themes || {};
      state.prompts = data.prompts || [];
      state.settings = data.settings || {};
      state.uiPalette = data.uiPalette || null;
      state.activeTheme = state.settings.activeTheme || 'amberDuo';

      injectSidebar();
      applyCSSVarsFromTheme(state.activeTheme);
      applyPageTheme(state.activeTheme);
      if (state.uiPalette) applySidebarUIPalette(state.uiPalette);

      try {
        if (isExtensionValid() && chrome.storage?.onChanged) {
          chrome.storage.onChanged.addListener((changes) => {
            try {
              if (!isExtensionValid()) return;
              onStorageChanged(changes);
            } catch (e) {}
          });
        }
      } catch (e) {}

      setupKeyboardShortcuts();
    } catch (e) {
      // Prevent any unhandled promise rejections on context invalidation
    }
  }

  function getStorage(keys) {
    return new Promise((resolve) => {
      try {
        if (!isExtensionValid()) return resolve({});
        chrome.storage.local.get(keys, (res) => {
          try {
            if (!isExtensionValid() || safeLastError()) {
              return resolve({});
            }
            resolve(res || {});
          } catch (e) {
            resolve({});
          }
        });
      } catch (e) {
        resolve({});
      }
    });
  }

  function setStorage(data) {
    return new Promise((resolve) => {
      try {
        if (!isExtensionValid()) return resolve();
        chrome.storage.local.set(data, () => {
          try {
            if (!isExtensionValid() || safeLastError()) {}
            resolve();
          } catch (e) {
            resolve();
          }
        });
      } catch (e) {
        resolve();
      }
    });
  }

  function onStorageChanged(changes) {
    if (changes.settings) {
      state.settings = changes.settings.newValue || {};
      const newTheme = state.settings.activeTheme;
      if (newTheme && newTheme !== state.activeTheme) {
        state.activeTheme = newTheme;
        applyCSSVarsFromTheme(newTheme);
        applyPageTheme(newTheme);
        updateThemeSelection();
      }
    }
    if (changes.uiPalette) {
      state.uiPalette = changes.uiPalette.newValue || null;
      if (state.uiPalette) applySidebarUIPalette(state.uiPalette);
    }
    if (changes.prompts) {
      state.prompts = changes.prompts.newValue || [];
      renderCategoryBar();
      renderPromptsTab();
    }
    if (changes.themes) {
      state.themes = changes.themes.newValue || {};
      renderThemeCards();
    }
  }

  // Strictly styles the Extension UI (Sidebar & Toggle Handle) — never touches the AI workspace
  function applySidebarUIPalette(p) {
    if (!p) return;
    const root = document.getElementById('promptcanvas-root');
    const toggleBtn = document.getElementById('pc-toggle-btn');
    if (root) {
      if (p.canvas) {
        root.style.setProperty('--pc-bg', p.canvas);
        root.style.setProperty('--pc-surface', '#FFFFFF');
      }
      if (p.controls) {
        root.style.setProperty('--pc-primary', p.controls);
        const clean = (p.controls || '').replace('#', '');
        if (clean.length === 6) {
          const num = parseInt(clean, 16);
          const r = (num >> 16) & 255;
          const g = (num >> 8) & 255;
          const b = num & 255;
          root.style.setProperty('--pc-border', `rgba(${r}, ${g}, ${b}, 0.12)`);
          root.style.setProperty('--pc-border-strong', `rgba(${r}, ${g}, ${b}, 0.28)`);
          root.style.setProperty('--pc-subtle', `rgba(${r}, ${g}, ${b}, 0.05)`);
          root.style.setProperty('--pc-text-muted', `rgba(${r}, ${g}, ${b}, 0.70)`);
        }
      }
      if (p.text) root.style.setProperty('--pc-text', p.text);
      if (p.accent) root.style.setProperty('--pc-accent', p.accent);
    }
    if (toggleBtn) {
      if (p.controls) {
        toggleBtn.style.background = p.controls;
        toggleBtn.style.borderColor = p.controls;
      }
      if (p.canvas) toggleBtn.style.color = p.canvas;
    }
    renderStudioMiniPreview();
  }

  function renderStudioMiniPreview() {
    const el = document.getElementById('pc-studio-mini-preview');
    if (!el) return;
    const p = state.uiPalette;
    const swatches = (p && p.swatches && p.swatches.length)
      ? p.swatches
      : ['#283845', '#151E25', '#FFA649', '#FFE8D1', '#FFFBF5'];
    el.innerHTML = swatches.map(c => `<span class="pc-mini-swatch" style="background:${c};" title="${c}"></span>`).join('');
  }

  function getTheme(themeId) {
    return state.themes[themeId] || Object.values(state.themes)[0];
  }

  function applyCSSVarsFromTheme(themeId) {
    if (!state.settings.themeEnabled) return;
    const theme = getTheme(themeId);
    if (!theme) return;
    const root = document.documentElement;
    const c = theme.colors;
    root.style.setProperty('--pc-primary', c.primary);
    root.style.setProperty('--pc-secondary', c.secondary);
    root.style.setProperty('--pc-accent', c.accent);
    root.style.setProperty('--pc-bg', c.background);
    root.style.setProperty('--pc-surface', c.surface);
    root.style.setProperty('--pc-surface-glass', c.surfaceGlass);
    root.style.setProperty('--pc-text', c.text);
    root.style.setProperty('--pc-text-muted', c.textMuted);
    root.style.setProperty('--pc-border', c.border);
    root.style.setProperty('--pc-input-bg', c.inputBg);
    root.style.setProperty('--pc-sidebar', c.sidebar);
    root.style.setProperty('--pc-sidebar-hover', c.sidebarHover);
    root.style.setProperty('--pc-font', theme.font || 'Inter');
    root.style.setProperty('--pc-font-size', theme.fontSize || '15px');
    root.style.setProperty('--pc-radius', theme.borderRadius || '4px');
    root.style.setProperty('--pc-msg-radius', theme.messageBorderRadius || '4px');
    root.style.setProperty('--pc-blur', '0px');
  }

  function applyPageTheme(themeId) {
    if (!state.settings.themeEnabled) {
      if (themeStyleEl) themeStyleEl.textContent = '';
      return;
    }
    const theme = getTheme(themeId);
    if (!theme) return;

    if (!themeStyleEl) {
      themeStyleEl = document.createElement('style');
      themeStyleEl.id = 'pc-page-theme';
      document.head.appendChild(themeStyleEl);
    }

    const c = theme.colors;
    let css = '';
    if (PLATFORM === 'chatgpt') css = buildChatGPTTheme(c, theme);
    else if (PLATFORM === 'gemini') css = buildGeminiTheme(c, theme);
    else if (PLATFORM === 'claude') css = buildClaudeTheme(c, theme);
    else if (PLATFORM === 'deepseek') css = buildDeepSeekTheme(c, theme);
    else css = buildGenericTheme(c, theme);
    themeStyleEl.textContent = css;
  }

  function buildChatGPTTheme(c, theme) {
    const userText = c.userBubbleText || '#3C0016';
    return `
      html, body { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
      main, [class*="react-scroll-to-bottom"], [class*="overflow-y-auto"] { background-color: ${c.background} !important; }
      nav, [class*="bg-token-sidebar"], .sticky.top-0 { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
      #prompt-textarea, textarea, .ProseMirror, [class*="composer"] {
        background-color: ${c.inputBg} !important; color: ${c.text} !important;
        font-family: '${theme.font || 'Inter'}', sans-serif !important;
        font-size: ${theme.fontSize || '15px'} !important;
        border-radius: ${theme.borderRadius || '4px'} !important;
        border: 1px solid ${c.border} !important;
      }
      [class*="composer-parent"], [class*="stretch"] form { background: ${c.surface} !important; border-top: 1px solid ${c.border} !important; }
      [data-message-author-role="user"] [class*="rounded"] {
        background: ${c.userBubble} !important;
        border-radius: ${theme.messageBorderRadius || '4px'} !important;
        color: ${userText} !important;
        border: 1px solid ${c.border} !important;
      }
      [data-message-author-role="user"] [class*="rounded"] p,
      [data-message-author-role="user"] [class*="rounded"] span {
        color: ${userText} !important;
      }
      [data-message-author-role="assistant"] { background-color: transparent !important; color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      p, span, h1, h2, h3, h4, li { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      pre, code { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
      a { color: ${c.primary} !important; }
      ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
    `;
  }

  function buildClaudeTheme(c, theme) {
    const userText = c.userBubbleText || '#3C0016';
    return `
      html, body, main, [class*="bg-bg-"] { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
      nav, aside, [data-testid="sidebar"], [class*="bg-bg-000"], [class*="bg-bg-200"] { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
      div[contenteditable="true"], .ProseMirror, textarea {
        background-color: ${c.inputBg} !important; color: ${c.text} !important;
        font-family: '${theme.font || 'Inter'}', sans-serif !important;
        font-size: ${theme.fontSize || '15px'} !important;
        border-radius: ${theme.borderRadius || '4px'} !important;
        border: 1px solid ${c.border} !important;
      }
      fieldset, [class*="bg-bg-100"] { background-color: ${c.surface} !important; border-color: ${c.border} !important; }
      [data-testid="user-message"], [class*="font-user-message"] {
        background: ${c.userBubble} !important;
        border-radius: ${theme.messageBorderRadius || '4px'} !important;
        color: ${userText} !important;
        border: 1px solid ${c.border} !important;
        padding: 10px 14px !important;
      }
      [data-testid="user-message"] p, [class*="font-user-message"] p {
        color: ${userText} !important;
      }
      [class*="font-claude-message"] { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      p, span, h1, h2, h3, h4, li { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      pre, code, [class*="code-block"] { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
      a { color: ${c.primary} !important; }
      ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
    `;
  }

  function buildDeepSeekTheme(c, theme) {
    const userText = c.userBubbleText || '#3C0016';
    return `
      html, body, #root, [class*="chat-page"], [class*="chat-scroll"] { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
      [class*="sidebar"], [class*="side-bar"], [class*="ds-sidebar"] { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
      #chat-input, textarea, [class*="input-box"], [class*="ds-input"] {
        background-color: ${c.inputBg} !important; color: ${c.text} !important;
        font-family: '${theme.font || 'Inter'}', sans-serif !important;
        font-size: ${theme.fontSize || '15px'} !important;
        border-radius: ${theme.borderRadius || '4px'} !important;
        border: 1px solid ${c.border} !important;
      }
      [class*="user-message"], [class*="bubble-user"], [class*="_user_"] {
        background: ${c.userBubble} !important;
        border-radius: ${theme.messageBorderRadius || '4px'} !important;
        color: ${userText} !important;
        border: 1px solid ${c.border} !important;
      }
      [class*="user-message"] p, [class*="bubble-user"] p { color: ${userText} !important; }
      [class*="assistant-message"], [class*="_assistant_"] {
        background: transparent !important;
        color: ${c.text} !important;
        font-family: '${theme.font || 'Inter'}', sans-serif !important;
      }
      p, span, h1, h2, h3, h4, li, div[class*="ds-markdown"] { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      pre, code, [class*="code-block"] { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
      a { color: ${c.primary} !important; }
      ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
    `;
  }

  function buildGenericTheme(c, theme) {
    return `
      html, body { background-color: ${c.background} !important; color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      textarea, input[type="text"] { background-color: ${c.inputBg} !important; color: ${c.text} !important; border: 1px solid ${c.border} !important; }
      pre, code { background-color: ${c.background} !important; color: ${c.secondary} !important; border: 1px solid ${c.border} !important; }
      a { color: ${c.primary} !important; }
    `;
  }

  function buildGeminiTheme(c, theme) {
    const userText = c.userBubbleText || '#3C0016';
    return `
      html, body { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
      .conversation-container, .chat-history, main { background-color: ${c.background} !important; }
      .input-area, rich-textarea, .ql-editor, [jsname="tKMEOc"], footer {
        background-color: ${c.inputBg} !important; border: 1px solid ${c.border} !important;
        color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important;
        font-size: ${theme.fontSize || '15px'} !important;
        border-radius: ${theme.borderRadius || '4px'} !important;
      }
      .user-query-bubble-with-background, .user-query-bubble {
        background: ${c.userBubble} !important;
        border-radius: ${theme.messageBorderRadius || '4px'} !important;
        color: ${userText} !important;
        border: 1px solid ${c.border} !important;
      }
      .user-query-bubble-with-background p, .user-query-bubble p { color: ${userText} !important; }
      model-response, .model-response-text { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      side-nav, nav, mat-sidenav { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
      p, span, h1, h2, h3, h4, li { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
      pre, code, .code-block { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
      a { color: ${c.primary} !important; }
      ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
    `;
  }

  function injectSidebar() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'pc-toggle-btn';
    toggleBtn.title = 'PromptCanvas (Alt+P)';
    toggleBtn.innerHTML = `
      <svg viewBox="0 0 24 24" class="pc-toggle-icon" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
        <path d="m2 17 10 5 10-5"/>
        <path d="m2 12 10 5 10-5"/>
      </svg>
      <span class="pc-toggle-label">PROMPTS</span>
    `;
    toggleBtn.addEventListener('click', toggleSidebar);
    document.body.appendChild(toggleBtn);

    sidebarRoot = document.createElement('div');
    sidebarRoot.id = 'promptcanvas-root';
    sidebarRoot.innerHTML = buildSidebarHTML();
    document.body.appendChild(sidebarRoot);

    attachSidebarEvents();
    renderCategoryBar();
    renderPromptsTab();
    renderThemeCards();
    renderStudioMiniPreview();

    if (state.settings.sidebarOpen) setTimeout(() => openSidebar(), 400);
  }

  function buildSidebarHTML() {
    const platformLabel = PLATFORM === 'chatgpt' ? 'ChatGPT' : PLATFORM === 'claude' ? 'Claude' : PLATFORM === 'deepseek' ? 'DeepSeek' : PLATFORM === 'gemini' ? 'Gemini' : 'AI Chat';

    return `
      <div id="pc-sidebar">
        <!-- Header -->
        <div id="pc-header">
          <div class="pc-header-top">
            <div class="pc-brand-group">
              <div class="pc-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
                  <path d="m2 17 10 5 10-5"/>
                  <path d="m2 12 10 5 10-5"/>
                </svg>
              </div>
              <span class="pc-logo-text">PromptCanvas</span>
              <span class="pc-logo-badge">PRO</span>
            </div>

            <div class="pc-header-actions">
              <div class="pc-platform-pill" title="Active on ${platformLabel}">
                <span class="pc-platform-dot"></span>
                <span>${platformLabel}</span>
              </div>
              <button class="pc-header-icon-btn" id="pc-header-options-btn" title="Open Active Color Studio & Options">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
              <button class="pc-close-btn" id="pc-close-btn" title="Close (Esc)">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Segmented Tabs Navigation -->
          <div class="pc-tabs">
            <button class="pc-tab pc-active" data-tab="prompts">
              <svg class="pc-tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m18 16 4-4-4-4"/>
                <path d="m6 8-4 4 4 4"/>
                <path d="m14.5 4-5 16"/>
              </svg>
              <span>Prompts</span>
              <span class="pc-tab-badge" id="pc-badge-prompts">0</span>
            </button>
            <button class="pc-tab" data-tab="themes">
              <svg class="pc-tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
              </svg>
              <span>Themes</span>
            </button>
            <button class="pc-tab" data-tab="settings">
              <svg class="pc-tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>

        <!-- Prompts Tab (Default SaaS Productivity Hub) -->
        <div class="pc-content pc-active" id="pc-tab-prompts">
          <div class="pc-cat-bar" id="pc-cat-bar"></div>

          <div class="pc-prompts-toolbar">
            <div class="pc-search-box">
              <span class="pc-search-icon">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
              </span>
              <input type="text" class="pc-search-input" id="pc-search" placeholder="Search prompts or [variables]...">
              <button class="pc-search-clear" id="pc-search-clear" style="display:none;" title="Clear search">✕</button>
            </div>
            <button class="pc-add-btn" id="pc-add-prompt-btn" title="Create reusable template">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
              <span>NEW</span>
            </button>
          </div>

          <div class="pc-prompt-list" id="pc-prompt-list"></div>
        </div>

        <!-- Themes Tab (AI Chatspace Styling) -->
        <div class="pc-content" id="pc-tab-themes">
          <div class="pc-callout">
            <svg class="pc-callout-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <div class="pc-callout-text">
              These presets style the AI conversation workspace. To customize the sidebar and popup colors, use the <strong>Active Color Studio</strong> in Options.
            </div>
          </div>

          <div class="pc-section-label">AI Chat Presets</div>
          <div class="pc-theme-grid" id="pc-theme-grid"></div>

          <div class="pc-section-label" style="margin-top:8px;">Typography & Geometry</div>
          <div class="pc-control-group">
            <div class="pc-control-row">
              <span class="pc-control-label">Font Family</span>
              <select class="pc-select" id="select-font">
                <option value="Inter">Inter (Clean)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Editorial)</option>
                <option value="JetBrains Mono">JetBrains Mono (Developer)</option>
                <option value="Roboto">Roboto (Classic)</option>
              </select>
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Font Size</span>
              <div class="pc-range-wrap">
                <input type="range" class="pc-range-slider" id="range-fontsize" min="13" max="18" value="15">
                <span class="pc-range-val" id="val-fontsize">15px</span>
              </div>
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Message Radius</span>
              <div class="pc-range-wrap">
                <input type="range" class="pc-range-slider" id="range-radius" min="0" max="12" value="4">
                <span class="pc-range-val" id="val-radius">4px</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div class="pc-content" id="pc-tab-settings">
          <div class="pc-section-label">Active Workspace</div>
          <div class="pc-settings-section">
            <div class="pc-settings-item">
              <div class="pc-settings-info">
                <div class="pc-settings-title">${platformLabel} Theming</div>
                <div class="pc-settings-desc">Apply theme styling to ${platformLabel} chat</div>
              </div>
              <label class="pc-toggle">
                <input type="checkbox" id="toggle-theme-enabled" ${state.settings.themeEnabled !== false ? 'checked' : ''}>
                <span class="pc-toggle-slider"></span>
              </label>
            </div>
            <div class="pc-settings-item">
              <div class="pc-settings-info">
                <div class="pc-settings-title">1-Click Prompt Inserter</div>
                <div class="pc-settings-desc">Direct injection into ${platformLabel} composer</div>
              </div>
              <label class="pc-toggle">
                <input type="checkbox" id="toggle-prompts-enabled" ${state.settings.promptsEnabled !== false ? 'checked' : ''}>
                <span class="pc-toggle-slider"></span>
              </label>
            </div>
          </div>

          <div class="pc-section-label" style="margin-top:10px;">Extension Appearance</div>
          <div class="pc-settings-section">
            <div class="pc-settings-item" id="btn-open-studio-card" style="cursor:pointer;" title="Click to open Color Studio in Options">
              <div class="pc-settings-info">
                <div class="pc-settings-title">Active Color Studio</div>
                <div class="pc-settings-desc">10 Designer palettes for Sidebar & Popup</div>
                <div class="pc-studio-mini-preview" id="pc-studio-mini-preview"></div>
              </div>
              <button class="pc-btn pc-btn-primary pc-btn-xs" id="btn-open-options-page">OPEN STUDIO →</button>
            </div>
          </div>

          <div class="pc-section-label" style="margin-top:10px;">Keyboard Shortcuts</div>
          <div class="pc-shortcuts-card">
            <div class="pc-shortcut-row"><span class="pc-shortcut-label">Toggle Sidebar</span><kbd class="pc-kbd">Alt + P</kbd></div>
            <div class="pc-shortcut-row"><span class="pc-shortcut-label">Close Sidebar / Modal</span><kbd class="pc-kbd">Esc</kbd></div>
            <div class="pc-shortcut-row"><span class="pc-shortcut-label">Focus Prompt Search</span><kbd class="pc-kbd">/</kbd></div>
          </div>

          <div class="pc-section-label" style="margin-top:10px;">System & Storage</div>
          <div class="pc-settings-section">
            <div class="pc-settings-item">
              <div class="pc-settings-info">
                <div class="pc-settings-title">Reset Defaults</div>
                <div class="pc-settings-desc">Restore original Tokyo Duo settings & prompts</div>
              </div>
              <button class="pc-btn pc-btn-ghost pc-btn-xs" id="btn-reset" style="color:#C92A2A;">RESET</button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div id="pc-footer">
          <div class="pc-footer-left">
            <span class="pc-footer-dot"></span>
            <span class="pc-footer-text">Tokyo Duo Engine · v2.0</span>
          </div>
          <button class="pc-footer-btn" id="pc-btn-footer-options" title="Open Options Dashboard">
            <span>Dashboard</span>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Add Prompt Modal -->
      <div class="pc-modal-overlay" id="pc-modal-overlay">
        <div class="pc-modal">
          <div class="pc-modal-header">
            <div class="pc-modal-header-title">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
                <path d="m2 17 10 5 10-5"/>
                <path d="m2 12 10 5 10-5"/>
              </svg>
              <span>New Prompt Template</span>
            </div>
            <button class="pc-close-btn" id="pc-modal-close" title="Close (Esc)">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18"/>
                <path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>

          <div class="pc-modal-body">
            <div class="pc-form-group">
              <label class="pc-form-label">Template Title</label>
              <input type="text" class="pc-input" id="modal-title" placeholder="e.g. Code Reviewer & Bug Hunter">
            </div>

            <div class="pc-form-group">
              <label class="pc-form-label">Category</label>
              <input type="text" class="pc-input" id="modal-category" placeholder="e.g. Coding, Writing, Productivity">
              <div class="pc-modal-quick-chips">
                <button type="button" class="pc-chip-suggest" data-cat="Coding">Coding</button>
                <button type="button" class="pc-chip-suggest" data-cat="Writing">Writing</button>
                <button type="button" class="pc-chip-suggest" data-cat="Productivity">Productivity</button>
                <button type="button" class="pc-chip-suggest" data-cat="Strategy">Strategy</button>
              </div>
            </div>

            <div class="pc-form-group">
              <div class="pc-form-label-row">
                <label class="pc-form-label">Prompt Content</label>
                <span class="pc-form-hint">Use [TAGS] for dynamic fields</span>
              </div>
              <textarea class="pc-textarea" id="modal-text" placeholder="Enter prompt text. Use [BRACKETS] for dynamic placeholders..."></textarea>
              
              <div class="pc-var-helper">
                <span class="pc-var-helper-label">Quick Variables:</span>
                <div class="pc-var-chips">
                  <button type="button" class="pc-var-chip" data-var="[TOPIC]">+ [TOPIC]</button>
                  <button type="button" class="pc-var-chip" data-var="[LANGUAGE]">+ [LANGUAGE]</button>
                  <button type="button" class="pc-var-chip" data-var="[TARGET]">+ [TARGET]</button>
                  <button type="button" class="pc-var-chip" data-var="[FORMAT]">+ [FORMAT]</button>
                  <button type="button" class="pc-var-chip" data-var="[TONE]">+ [TONE]</button>
                </div>
              </div>
            </div>
          </div>

          <div class="pc-modal-footer">
            <button class="pc-btn pc-btn-ghost" id="modal-cancel">Cancel</button>
            <button class="pc-btn pc-btn-primary" id="modal-save">Save Template</button>
          </div>
        </div>
      </div>

      <!-- Toast Feedback -->
      <div class="pc-toast" id="pc-toast">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span id="pc-toast-msg">Saved</span>
      </div>
    `;
  }

  function renderCategoryBar() {
    const bar = document.getElementById('pc-cat-bar');
    if (!bar) return;

    const cats = ['All'];
    const counts = { All: state.prompts.length };

    state.prompts.forEach(p => {
      const c = p.category ? p.category.trim() : 'General';
      if (!cats.includes(c)) cats.push(c);
      counts[c] = (counts[c] || 0) + 1;
    });

    if (!cats.includes(state.activeCategory)) state.activeCategory = 'All';

    bar.innerHTML = cats.map(cat => {
      const isActive = state.activeCategory === cat;
      return `
        <button class="pc-cat-chip ${isActive ? 'pc-active' : ''}" data-cat="${escapeHtml(cat)}">
          <span>${escapeHtml(cat)}</span>
          <span class="pc-cat-count">${counts[cat] || 0}</span>
        </button>
      `;
    }).join('');

    bar.querySelectorAll('.pc-cat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        state.activeCategory = chip.dataset.cat;
        renderCategoryBar();
        renderPromptsTab();
      });
    });
  }

  function renderPromptsTab() {
    const list = document.getElementById('pc-prompt-list');
    const badge = document.getElementById('pc-badge-prompts');
    if (badge) badge.textContent = state.prompts.length;
    if (!list) return;

    const query = state.searchQuery.toLowerCase().trim();
    const activeCat = state.activeCategory;

    const filtered = state.prompts.filter(p => {
      const matchesCat = (activeCat === 'All') || (p.category && p.category.toLowerCase() === activeCat.toLowerCase());
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        p.title.toLowerCase().includes(query) ||
        p.text.toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query) ||
        (p.tags || []).some(t => t.toLowerCase().includes(query))
      );
    });

    if (filtered.length === 0) {
      list.innerHTML = `
        <div class="pc-empty">
          <svg class="pc-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <div class="pc-empty-title">${query ? 'No matching prompts' : 'Prompt library empty'}</div>
          <div class="pc-empty-text">${query ? 'Try a different keyword or select another category.' : 'Click "NEW" above to add your first template.'}</div>
        </div>`;
      return;
    }

    list.innerHTML = filtered.map(p => {
      const bracketMatches = p.text.match(/\[([^\]]+)\]/g) || [];
      const varCount = bracketMatches.length;
      const highlightedPreview = escapeHtml(p.text).replace(/\[([^\]]+)\]/g, '<span class="pc-prompt-var-pill">[$1]</span>');

      return `
        <div class="pc-prompt-card" data-prompt-id="${p.id}">
          <div class="pc-prompt-header">
            <span class="pc-prompt-tag">${p.category ? escapeHtml(p.category) : 'General'}</span>
            ${varCount > 0 ? `<span class="pc-prompt-var-badge">${varCount} VAR${varCount > 1 ? 'S' : ''}</span>` : ''}
          </div>
          <div class="pc-prompt-title">${escapeHtml(p.title)}</div>
          <div class="pc-prompt-preview">${highlightedPreview}</div>
          <div class="pc-prompt-meta">
            <span class="pc-prompt-click-hint">Click to insert</span>
            <div class="pc-prompt-actions">
              <button class="pc-prompt-action-btn btn-insert" data-action="insert" data-prompt-id="${p.id}" title="Insert into composer">
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
                <span>Insert</span>
              </button>
              <button class="pc-prompt-action-btn btn-icon btn-copy" data-action="copy" data-prompt-id="${p.id}" title="Copy to clipboard">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                </svg>
              </button>
              <button class="pc-prompt-action-btn btn-icon btn-delete" data-action="delete" data-prompt-id="${p.id}" title="Delete template">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>`;
    }).join('');

    list.querySelectorAll('.pc-prompt-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const btn = e.target.closest('.pc-prompt-action-btn');
        if (btn) {
          e.stopPropagation();
          handlePromptAction(btn.dataset.action, btn.dataset.promptId, btn);
        } else {
          const insertBtn = card.querySelector('.btn-insert');
          handlePromptAction('insert', card.dataset.promptId, insertBtn);
        }
      });
    });
  }

  function handlePromptAction(action, promptId, btnEl) {
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!prompt) return;
    if (action === 'insert') insertPromptIntoChat(prompt.text, btnEl);
    else if (action === 'copy') navigator.clipboard.writeText(prompt.text).then(() => showToast('Copied to clipboard'));
    else if (action === 'delete') deletePrompt(promptId);
  }

  function insertPromptIntoChat(text, btnEl) {
    let textarea = null;
    if (PLATFORM === 'chatgpt') {
      textarea = document.querySelector('#prompt-textarea') || document.querySelector('.ProseMirror') || document.querySelector('textarea[placeholder]');
    } else if (PLATFORM === 'gemini') {
      textarea = document.querySelector('.ql-editor') || document.querySelector('rich-textarea [contenteditable="true"]') || document.querySelector('[contenteditable="true"]') || document.querySelector('textarea');
    } else if (PLATFORM === 'claude') {
      textarea = document.querySelector('div.ProseMirror[contenteditable="true"]') || document.querySelector('div[contenteditable="true"]') || document.querySelector('textarea');
    } else if (PLATFORM === 'deepseek') {
      textarea = document.querySelector('#chat-input') || document.querySelector('textarea[placeholder]') || document.querySelector('textarea');
    } else {
      textarea = document.querySelector('textarea, [contenteditable="true"]');
    }

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
        btnEl.innerHTML = `<span>INSERTED ✓</span>`;
        setTimeout(() => {
          btnEl.classList.remove('pc-inserted');
          btnEl.innerHTML = originalHTML;
        }, 1200);
      }

      showToast('Prompt inserted');
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('Copied (paste manually)'));
    }
  }

  async function deletePrompt(promptId) {
    state.prompts = state.prompts.filter(p => p.id !== promptId);
    await setStorage({ prompts: state.prompts });
    renderCategoryBar();
    renderPromptsTab();
    showToast('Prompt deleted');
  }

  function renderThemeCards() {
    const grid = document.getElementById('pc-theme-grid');
    if (!grid) return;

    grid.innerHTML = Object.values(state.themes).map(theme => {
      const isSelected = state.activeTheme === theme.id;
      const c = theme.colors;
      return `
        <div class="pc-theme-card ${isSelected ? 'pc-selected' : ''}" data-theme-id="${theme.id}">
          <div class="pc-theme-check">ACTIVE</div>
          <div class="pc-theme-mini-chat" style="background:${c.background}; border-color:${c.border};">
            <div class="pc-mini-bubble-user" style="background:${c.userBubble}; color:${c.userBubbleText || '#FFF'};">
              User Prompt
            </div>
            <div class="pc-mini-bubble-ai" style="color:${c.text};">
              AI Response Preview
            </div>
          </div>
          <div class="pc-theme-swatches">
            <div class="pc-theme-swatch" style="background:${c.background};" title="Background"></div>
            <div class="pc-theme-swatch" style="background:${c.primary};" title="Primary"></div>
            <div class="pc-theme-swatch" style="background:${c.secondary};" title="Secondary"></div>
          </div>
          <div class="pc-theme-name">${theme.name}</div>
          <div class="pc-theme-desc">${theme.description}</div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.pc-theme-card').forEach(card => {
      card.addEventListener('click', () => selectTheme(card.dataset.themeId));
    });
  }

  function updateThemeSelection() {
    document.querySelectorAll('.pc-theme-card').forEach(card => {
      card.classList.toggle('pc-selected', card.dataset.themeId === state.activeTheme);
    });
  }

  async function selectTheme(themeId) {
    state.activeTheme = themeId;
    state.settings.activeTheme = themeId;
    await setStorage({ settings: state.settings });
    applyCSSVarsFromTheme(themeId);
    applyPageTheme(themeId);
    updateThemeSelection();
    showToast('Theme applied');
  }

  function openSidebar() {
    if (!sidebarRoot) return;
    sidebarRoot.classList.add('pc-open');
    const toggleBtn = document.getElementById('pc-toggle-btn');
    if (toggleBtn) toggleBtn.classList.add('pc-hidden');
    state.open = true;
    state.settings.sidebarOpen = true;
    setStorage({ settings: state.settings });
  }

  function closeSidebar() {
    if (!sidebarRoot) return;
    sidebarRoot.classList.remove('pc-open');
    const toggleBtn = document.getElementById('pc-toggle-btn');
    if (toggleBtn) toggleBtn.classList.remove('pc-hidden');
    state.open = false;
    state.settings.sidebarOpen = false;
    setStorage({ settings: state.settings });
  }

  function toggleSidebar() {
    state.open ? closeSidebar() : openSidebar();
  }

  function switchTab(tabName) {
    document.querySelectorAll('.pc-tab').forEach(t => t.classList.remove('pc-active'));
    document.querySelectorAll('.pc-content').forEach(c => c.classList.remove('pc-active'));
    const targetTab = document.querySelector(`.pc-tab[data-tab="${tabName}"]`);
    const targetContent = document.getElementById(`pc-tab-${tabName}`);
    if (targetTab && targetContent) {
      targetTab.classList.add('pc-active');
      targetContent.classList.add('pc-active');
      state.activeTab = tabName;
    }
  }

  function openOptionsPage(panel = '') {
    const hash = panel ? `#${panel}` : '';
    if (!isExtensionValid()) {
      showToast('Please reload this tab to reconnect PromptCanvas');
      return;
    }
    try {
      const url = chrome.runtime?.getURL ? chrome.runtime.getURL(`options/options.html${hash}`) : '';
      if (!url) return;
      chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS', panel }, (res) => {
        try {
          if (safeLastError() || !res) {
            window.open(url, '_blank');
          }
        } catch (e) {
          window.open(url, '_blank');
        }
      });
    } catch (e) {
      // Context invalidated or window error
    }
  }

  function attachSidebarEvents() {
    document.getElementById('pc-close-btn')?.addEventListener('click', closeSidebar);

    // Tab switching
    document.querySelectorAll('.pc-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Options page openers
    document.getElementById('pc-header-options-btn')?.addEventListener('click', () => openOptionsPage());
    document.getElementById('btn-open-options-page')?.addEventListener('click', () => openOptionsPage('palette'));
    document.getElementById('btn-open-studio-card')?.addEventListener('click', () => openOptionsPage('palette'));
    document.getElementById('pc-btn-footer-options')?.addEventListener('click', () => openOptionsPage());

    // Font family
    document.getElementById('select-font')?.addEventListener('change', (e) => applyCustomFont(e.target.value));

    // Font size slider with live badge
    const fontSlider = document.getElementById('range-fontsize');
    const fontVal = document.getElementById('val-fontsize');
    fontSlider?.addEventListener('input', (e) => {
      const size = `${e.target.value}px`;
      if (fontVal) fontVal.textContent = size;
      document.documentElement.style.setProperty('--pc-font-size', size);
    });

    // Border radius slider with live badge
    const radSlider = document.getElementById('range-radius');
    const radVal = document.getElementById('val-radius');
    radSlider?.addEventListener('input', (e) => {
      const rad = `${e.target.value}px`;
      if (radVal) radVal.textContent = rad;
      document.documentElement.style.setProperty('--pc-radius', rad);
      document.documentElement.style.setProperty('--pc-msg-radius', rad);
    });

    // Search input & clear button
    const searchInput = document.getElementById('pc-search');
    const searchClear = document.getElementById('pc-search-clear');
    searchInput?.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (searchClear) searchClear.style.display = state.searchQuery ? 'block' : 'none';
      renderPromptsTab();
    });

    searchClear?.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      state.searchQuery = '';
      searchClear.style.display = 'none';
      renderPromptsTab();
      searchInput?.focus();
    });

    // Add prompt modal
    document.getElementById('pc-add-prompt-btn')?.addEventListener('click', openModal);
    document.getElementById('pc-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
    document.getElementById('modal-save')?.addEventListener('click', saveNewPrompt);
    document.getElementById('pc-modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'pc-modal-overlay') closeModal();
    });

    // Suggested category chips in modal
    document.querySelectorAll('.pc-chip-suggest').forEach(chip => {
      chip.addEventListener('click', () => {
        const catInput = document.getElementById('modal-category');
        if (catInput) catInput.value = chip.dataset.cat;
      });
    });

    // Quick variable helper chips in modal
    document.querySelectorAll('.pc-var-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const textarea = document.getElementById('modal-text');
        if (!textarea) return;
        const tag = chip.dataset.var;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;
        textarea.value = val.substring(0, start) + tag + val.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + tag.length;
        textarea.focus();
      });
    });

    // Toggles
    document.getElementById('toggle-theme-enabled')?.addEventListener('change', async (e) => {
      state.settings.themeEnabled = e.target.checked;
      await setStorage({ settings: state.settings });
      if (e.target.checked) applyPageTheme(state.activeTheme);
      else if (themeStyleEl) themeStyleEl.textContent = '';
      showToast(e.target.checked ? 'Theming enabled' : 'Theming disabled');
    });

    document.getElementById('toggle-prompts-enabled')?.addEventListener('change', async (e) => {
      state.settings.promptsEnabled = e.target.checked;
      await setStorage({ settings: state.settings });
    });

    // Reset button
    document.getElementById('btn-reset')?.addEventListener('click', async () => {
      if (!confirm('Reset all Tokyo Duo settings and prompt templates to factory defaults?')) return;
      if (isExtensionValid()) {
        try {
          await chrome.storage.local.clear();
        } catch (e) {}
      }
      showToast('Resetting...');
      setTimeout(() => window.location.reload(), 600);
    });
  }

  function applyCustomFont(font) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
    document.documentElement.style.setProperty('--pc-font', `'${font}', sans-serif`);
    showToast(`Font set to ${font}`);
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Alt+P: toggle sidebar
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        toggleSidebar();
        return;
      }
      // Esc: close modal or close sidebar
      if (e.key === 'Escape') {
        const modal = document.getElementById('pc-modal-overlay');
        if (modal && modal.classList.contains('pc-visible')) {
          closeModal();
          return;
        }
        if (state.open) {
          closeSidebar();
          return;
        }
      }
      // '/': focus prompt search when sidebar is open and user isn't in an input
      if (e.key === '/' && state.open) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        switchTab('prompts');
        const searchInput = document.getElementById('pc-search');
        if (searchInput) searchInput.focus();
      }
    });
  }

  function openModal() {
    document.getElementById('pc-modal-overlay')?.classList.add('pc-visible');
    document.getElementById('modal-title')?.focus();
  }

  function closeModal() {
    document.getElementById('pc-modal-overlay')?.classList.remove('pc-visible');
    ['modal-title', 'modal-category', 'modal-text'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  async function saveNewPrompt() {
    const title = document.getElementById('modal-title')?.value.trim();
    const category = document.getElementById('modal-category')?.value.trim();
    const text = document.getElementById('modal-text')?.value.trim();

    if (!title || !text) {
      showToast('Title and prompt content required');
      return;
    }

    const cat = category || 'General';
    state.prompts.unshift({
      id: `p_${Date.now()}`,
      title,
      category: cat,
      text,
      tags: [cat.toLowerCase()]
    });

    await setStorage({ prompts: state.prompts });
    closeModal();
    renderCategoryBar();
    renderPromptsTab();
    showToast('Prompt saved');
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('pc-toast');
    const msg = document.getElementById('pc-toast-msg');
    if (!toast || !msg) return;
    msg.textContent = message;
    toast.classList.add('pc-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('pc-show'), 2000);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init().catch(() => {});
    });
  } else {
    init().catch(() => {});
  }

})();
