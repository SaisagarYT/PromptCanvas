// PromptCanvas Content Script
// Injected into ChatGPT, Claude, DeepSeek, and Gemini
// Palette: Burgundy Brown (#3C0016), Bright Red Plus (#F92424), Sand (#D1C0A5)
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
    activeTab: 'themes',
    settings: {},
    themes: {},
    prompts: [],
    activeTheme: 'amberDuo',
    searchQuery: '',
  };

  let themeStyleEl = null;
  let sidebarRoot = null;

  async function init() {
    const data = await getStorage(['themes', 'prompts', 'settings']);
    state.themes = data.themes || {};
    state.prompts = data.prompts || [];
    state.settings = data.settings || {};
    state.activeTheme = state.settings.activeTheme || 'amberDuo';

    injectSidebar();
    applyCSSVarsFromTheme(state.activeTheme);
    applyPageTheme(state.activeTheme);

    chrome.storage.onChanged.addListener(onStorageChanged);
  }

  function getStorage(keys) {
    return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
  }

  function setStorage(data) {
    return new Promise((resolve) => chrome.storage.local.set(data, resolve));
  }

  function onStorageChanged(changes) {
    if (changes.settings) {
      state.settings = changes.settings.newValue;
      const newTheme = state.settings.activeTheme;
      if (newTheme && newTheme !== state.activeTheme) {
        state.activeTheme = newTheme;
        applyCSSVarsFromTheme(newTheme);
        applyPageTheme(newTheme);
        updateThemeSelection();
      }
    }
    if (changes.prompts) {
      state.prompts = changes.prompts.newValue;
      renderPromptsTab();
    }
    if (changes.themes) {
      state.themes = changes.themes.newValue;
      renderThemeCards();
    }
  }

  function getTheme(themeId) {
    return state.themes[themeId] || Object.values(state.themes)[0];
  }

  function applyCSSVarsFromTheme(themeId) {
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
    root.style.setProperty('--pc-font-size', theme.fontSize || '14px');
    root.style.setProperty('--pc-radius', theme.borderRadius || '4px');
    root.style.setProperty('--pc-msg-radius', theme.messageBorderRadius || '4px');
    root.style.setProperty('--pc-blur', '0px');
  }

  function applyPageTheme(themeId) {
    if (state.settings.themeEnabled === false) return;
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
        font-size: ${theme.fontSize || '14px'} !important;
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
        font-size: ${theme.fontSize || '14px'} !important;
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
        font-size: ${theme.fontSize || '14px'} !important;
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
        font-size: ${theme.fontSize || '14px'} !important;
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
    toggleBtn.title = 'PromptCanvas (Editorial)';
    toggleBtn.innerHTML = `<span class="pc-toggle-label">PC</span>`;
    toggleBtn.addEventListener('click', toggleSidebar);
    document.body.appendChild(toggleBtn);

    sidebarRoot = document.createElement('div');
    sidebarRoot.id = 'promptcanvas-root';
    sidebarRoot.innerHTML = buildSidebarHTML();
    document.body.appendChild(sidebarRoot);

    attachSidebarEvents();
    renderThemeCards();
    renderPromptsTab();

    if (state.settings.sidebarOpen) setTimeout(() => openSidebar(), 500);
  }

  function buildSidebarHTML() {
    const platformLabel = PLATFORM === 'chatgpt' ? 'ChatGPT' : PLATFORM === 'claude' ? 'Claude' : PLATFORM === 'deepseek' ? 'DeepSeek' : 'Gemini';

    return `
      <div id="pc-sidebar">
        <div id="pc-header">
          <div class="pc-header-top">
            <div class="pc-logo">
              <div class="pc-logo-icon">PC</div>
              <span class="pc-logo-text">PromptCanvas</span>
              <span class="pc-logo-badge">PRO</span>
            </div>
            <button class="pc-close-btn" id="pc-close-btn" title="Close">✕</button>
          </div>
          <div class="pc-tabs">
            <button class="pc-tab pc-active" data-tab="themes"><span class="pc-tab-icon">■</span> Themes</button>
            <button class="pc-tab" data-tab="prompts"><span class="pc-tab-icon">■</span> Prompts</button>
            <button class="pc-tab" data-tab="settings"><span class="pc-tab-icon">■</span> Settings</button>
          </div>
        </div>

        <div class="pc-content pc-active" id="pc-tab-themes">
          <div class="pc-section-label">Editorial Palettes</div>
          <div class="pc-theme-grid" id="pc-theme-grid"></div>

          <div class="pc-section-label">Fine-Tune 3 Colors</div>
          <div class="pc-control-group">
            <div class="pc-control-row">
              <span class="pc-control-label">Accent / User Bubble</span>
              <div class="pc-color-swatch"><div class="pc-color-preview" id="preview-primary"></div><input type="color" id="color-primary"></div>
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Typography / Text</span>
              <div class="pc-color-swatch"><div class="pc-color-preview" id="preview-secondary"></div><input type="color" id="color-secondary"></div>
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Canvas Background</span>
              <div class="pc-color-swatch"><div class="pc-color-preview" id="preview-bg"></div><input type="color" id="color-bg"></div>
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Font Family</span>
              <select class="pc-select" id="select-font">
                <option value="Inter">Inter (Swiss)</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="Roboto">Roboto</option>
                <option value="Space Grotesk">Space Grotesk</option>
              </select>
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Font Size</span>
              <input type="range" class="pc-range-slider" id="range-fontsize" min="12" max="18" value="14">
            </div>
            <div class="pc-control-row">
              <span class="pc-control-label">Border Radius</span>
              <input type="range" class="pc-range-slider" id="range-radius" min="0" max="10" value="4">
            </div>
          </div>
        </div>

        <div class="pc-content" id="pc-tab-prompts">
          <div class="pc-search-box">
            <span class="pc-search-icon">🔍</span>
            <input type="text" class="pc-search-input" id="pc-search" placeholder="Filter prompt library...">
          </div>
          <button class="pc-add-btn" id="pc-add-prompt-btn">＋ New Prompt Template</button>
          <div class="pc-prompt-list" id="pc-prompt-list"></div>
        </div>

        <div class="pc-content" id="pc-tab-settings">
          <div class="pc-section-label">Active Platform</div>
          <div class="pc-settings-section">
            <div class="pc-settings-item">
              <div class="pc-settings-info">
                <div class="pc-settings-title">${platformLabel}</div>
                <div class="pc-settings-desc">Inject 3-color palette into active view</div>
              </div>
              <label class="pc-toggle"><input type="checkbox" id="toggle-theme-enabled" ${state.settings.themeEnabled !== false ? 'checked' : ''}><span class="pc-toggle-slider"></span></label>
            </div>
            <div class="pc-settings-item">
              <div class="pc-settings-info">
                <div class="pc-settings-title">Prompt Inserter</div>
                <div class="pc-settings-desc">1-click insert to active chat box</div>
              </div>
              <label class="pc-toggle"><input type="checkbox" id="toggle-prompts-enabled" ${state.settings.promptsEnabled !== false ? 'checked' : ''}><span class="pc-toggle-slider"></span></label>
            </div>
          </div>
          <div class="pc-section-label">Storage</div>
          <div class="pc-settings-section">
            <div class="pc-settings-item">
              <div class="pc-settings-info">
                <div class="pc-settings-title">Reset Defaults</div>
                <div class="pc-settings-desc">Restore Burgundy Brown, Bright Red & Sand</div>
              </div>
              <button class="pc-btn pc-btn-ghost" id="btn-reset" style="flex:none;padding:5px 12px;font-size:11px;">Reset</button>
            </div>
          </div>
        </div>

        <div id="pc-footer">
          <span class="pc-footer-text">3-Color Editorial</span>
          <span class="pc-footer-badge">PROMPTCANVAS</span>
        </div>
      </div>

      <div class="pc-modal-overlay" id="pc-modal-overlay">
        <div class="pc-modal">
          <div class="pc-modal-header">
            <span class="pc-modal-title">New Prompt Template</span>
            <button class="pc-close-btn" id="pc-modal-close">✕</button>
          </div>
          <input type="text" class="pc-input" id="modal-title" placeholder="Title (e.g. Expert Mode)">
          <input type="text" class="pc-input" id="modal-category" placeholder="Category (e.g. Coding, Editorial)">
          <textarea class="pc-textarea" id="modal-text" placeholder="Prompt template. Use [BRACKETS] for dynamic placeholders..."></textarea>
          <div class="pc-modal-footer">
            <button class="pc-btn pc-btn-ghost" id="modal-cancel">Cancel</button>
            <button class="pc-btn pc-btn-primary" id="modal-save">Save Template</button>
          </div>
        </div>
      </div>

      <div class="pc-toast" id="pc-toast">
        <span id="pc-toast-msg">Saved</span>
      </div>
    `;
  }

  function renderThemeCards() {
    const grid = document.getElementById('pc-theme-grid');
    if (!grid) return;

    grid.innerHTML = Object.values(state.themes).map(theme => {
      const isSelected = state.activeTheme === theme.id;
      return `
        <div class="pc-theme-card ${isSelected ? 'pc-selected' : ''}" data-theme-id="${theme.id}">
          <div class="pc-theme-check">✓ ACTIVE</div>
          <div class="pc-theme-swatches">
            <div class="pc-theme-swatch" style="background:${theme.colors.background};" title="Background"></div>
            <div class="pc-theme-swatch" style="background:${theme.colors.primary};" title="Accent"></div>
            <div class="pc-theme-swatch" style="background:${theme.colors.secondary};" title="Secondary"></div>
          </div>
          <div class="pc-theme-name">${theme.name}</div>
          <div class="pc-theme-desc">${theme.description}</div>
        </div>`;
    }).join('');

    grid.querySelectorAll('.pc-theme-card').forEach(card => {
      card.addEventListener('click', () => selectTheme(card.dataset.themeId));
    });

    initColorPickers();
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
    initColorPickers();
    showToast('Theme applied');
  }

  function initColorPickers() {
    const theme = getTheme(state.activeTheme);
    if (!theme) return;
    const set = (id, val) => {
      const input = document.getElementById(id);
      const preview = document.getElementById(id.replace('color-', 'preview-'));
      if (input) input.value = val;
      if (preview) preview.style.background = val;
    };
    set('color-primary', theme.colors.primary);
    set('color-secondary', theme.colors.secondary);
    set('color-bg', theme.colors.background);
    const font = document.getElementById('select-font');
    if (font) font.value = theme.font || 'Inter';
    const fs = document.getElementById('range-fontsize');
    if (fs) fs.value = parseInt(theme.fontSize) || 14;
    const rr = document.getElementById('range-radius');
    if (rr) rr.value = parseInt(theme.borderRadius) || 4;
  }

  function renderPromptsTab() {
    const list = document.getElementById('pc-prompt-list');
    if (!list) return;

    const query = state.searchQuery.toLowerCase();
    const filtered = state.prompts.filter(p =>
      !query || p.title.toLowerCase().includes(query) || p.text.toLowerCase().includes(query) || (p.category || '').toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      list.innerHTML = `<div class="pc-empty"><div class="pc-empty-icon">■</div><div class="pc-empty-text">${query ? 'No matching prompts.' : 'Prompt library empty.'}</div></div>`;
      return;
    }

    list.innerHTML = filtered.map(p => `
      <div class="pc-prompt-card" data-prompt-id="${p.id}">
        <div class="pc-prompt-title">${escapeHtml(p.title)}</div>
        <div class="pc-prompt-preview">${escapeHtml(p.text)}</div>
        <div class="pc-prompt-meta">
          ${p.category ? `<span class="pc-prompt-tag">${escapeHtml(p.category)}</span>` : ''}
          <div class="pc-prompt-actions">
            <button class="pc-prompt-action-btn" data-action="insert" data-prompt-id="${p.id}" title="Insert into chat">↗</button>
            <button class="pc-prompt-action-btn" data-action="copy" data-prompt-id="${p.id}" title="Copy">⎘</button>
            <button class="pc-prompt-action-btn" data-action="delete" data-prompt-id="${p.id}" title="Delete">✕</button>
          </div>
        </div>
      </div>`).join('');

    list.querySelectorAll('.pc-prompt-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const btn = e.target.closest('.pc-prompt-action-btn');
        if (btn) {
          e.stopPropagation();
          handlePromptAction(btn.dataset.action, btn.dataset.promptId);
        } else {
          handlePromptAction('insert', card.dataset.promptId);
        }
      });
    });
  }

  function handlePromptAction(action, promptId) {
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!prompt) return;
    if (action === 'insert') insertPromptIntoChat(prompt.text);
    else if (action === 'copy') navigator.clipboard.writeText(prompt.text).then(() => showToast('Copied to clipboard'));
    else if (action === 'delete') deletePrompt(promptId);
  }

  function insertPromptIntoChat(text) {
    let textarea = null;
    if (PLATFORM === 'chatgpt') {
      textarea = document.querySelector('#prompt-textarea') || document.querySelector('.ProseMirror') || document.querySelector('textarea[placeholder]');
    } else if (PLATFORM === 'gemini') {
      textarea = document.querySelector('.ql-editor') || document.querySelector('[contenteditable="true"]') || document.querySelector('textarea');
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
      showToast('Prompt inserted');
    } else {
      navigator.clipboard.writeText(text).then(() => showToast('Copied (paste manually)'));
    }
  }

  async function deletePrompt(promptId) {
    state.prompts = state.prompts.filter(p => p.id !== promptId);
    await setStorage({ prompts: state.prompts });
    renderPromptsTab();
    showToast('Prompt deleted');
  }

  function openSidebar() { sidebarRoot.classList.add('pc-open'); state.open = true; state.settings.sidebarOpen = true; setStorage({ settings: state.settings }); }
  function closeSidebar() { sidebarRoot.classList.remove('pc-open'); state.open = false; state.settings.sidebarOpen = false; setStorage({ settings: state.settings }); }
  function toggleSidebar() { state.open ? closeSidebar() : openSidebar(); }

  function attachSidebarEvents() {
    document.getElementById('pc-close-btn')?.addEventListener('click', closeSidebar);

    document.querySelectorAll('.pc-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.pc-tab').forEach(t => t.classList.remove('pc-active'));
        document.querySelectorAll('.pc-content').forEach(c => c.classList.remove('pc-active'));
        tab.classList.add('pc-active');
        document.getElementById(`pc-tab-${tab.dataset.tab}`)?.classList.add('pc-active');
      });
    });

    ['primary', 'secondary', 'bg'].forEach(key => {
      const input = document.getElementById(`color-${key}`);
      const preview = document.getElementById(`preview-${key}`);
      input?.addEventListener('input', (e) => {
        if (preview) preview.style.background = e.target.value;
        applyCustomColor(key, e.target.value);
      });
    });

    document.getElementById('select-font')?.addEventListener('change', (e) => applyCustomFont(e.target.value));

    document.getElementById('range-fontsize')?.addEventListener('input', (e) => {
      const size = `${e.target.value}px`;
      document.documentElement.style.setProperty('--pc-font-size', size);
    });

    document.getElementById('range-radius')?.addEventListener('input', (e) => {
      document.documentElement.style.setProperty('--pc-radius', `${e.target.value}px`);
      document.documentElement.style.setProperty('--pc-msg-radius', `${e.target.value}px`);
    });

    document.getElementById('pc-search')?.addEventListener('input', (e) => { state.searchQuery = e.target.value; renderPromptsTab(); });

    document.getElementById('pc-add-prompt-btn')?.addEventListener('click', openModal);
    document.getElementById('pc-modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-cancel')?.addEventListener('click', closeModal);
    document.getElementById('modal-save')?.addEventListener('click', saveNewPrompt);
    document.getElementById('pc-modal-overlay')?.addEventListener('click', (e) => { if (e.target.id === 'pc-modal-overlay') closeModal(); });

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

    document.getElementById('btn-reset')?.addEventListener('click', async () => {
      await chrome.storage.local.clear();
      showToast('Resetting...');
      setTimeout(() => window.location.reload(), 800);
    });
  }

  function applyCustomColor(key, value) {
    const varMap = { primary: '--pc-primary', secondary: '--pc-secondary', bg: '--pc-bg' };
    if (varMap[key]) document.documentElement.style.setProperty(varMap[key], value);
    const theme = getTheme(state.activeTheme);
    if (theme && themeStyleEl) {
      const mc = { ...theme.colors };
      if (key === 'primary') mc.primary = value;
      if (key === 'secondary') mc.secondary = value;
      if (key === 'bg') mc.background = value;
      if (PLATFORM === 'chatgpt') themeStyleEl.textContent = buildChatGPTTheme(mc, theme);
      else if (PLATFORM === 'gemini') themeStyleEl.textContent = buildGeminiTheme(mc, theme);
      else if (PLATFORM === 'claude') themeStyleEl.textContent = buildClaudeTheme(mc, theme);
      else if (PLATFORM === 'deepseek') themeStyleEl.textContent = buildDeepSeekTheme(mc, theme);
      else themeStyleEl.textContent = buildGenericTheme(mc, theme);
    }
  }

  function applyCustomFont(font) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
    document.documentElement.style.setProperty('--pc-font', `'${font}', sans-serif`);
  }

  function openModal() { document.getElementById('pc-modal-overlay')?.classList.add('pc-visible'); document.getElementById('modal-title')?.focus(); }
  function closeModal() {
    document.getElementById('pc-modal-overlay')?.classList.remove('pc-visible');
    ['modal-title', 'modal-category', 'modal-text'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  }

  async function saveNewPrompt() {
    const title = document.getElementById('modal-title')?.value.trim();
    const category = document.getElementById('modal-category')?.value.trim();
    const text = document.getElementById('modal-text')?.value.trim();
    if (!title || !text) { showToast('Title and prompt required'); return; }
    state.prompts.unshift({ id: `p_${Date.now()}`, title, category: category || 'General', text, tags: [category?.toLowerCase() || 'general'] });
    await setStorage({ prompts: state.prompts });
    closeModal();
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
    div.textContent = text;
    return div.innerHTML;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
