// PromptCanvas Sidebar Component & Controller
// Complete Sidebar UI, UX, Interaction Logic, and State Management
// Tokyo Duo Engine · Modular Architecture

(function (root) {
  'use strict';

  function escapeHtml(text) {
    if (root.PCDomUtils?.escapeHtml) return root.PCDomUtils.escapeHtml(text);
    if (typeof root.escapeHtml === 'function') return root.escapeHtml(text);
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function hexToRgba(hex, alpha) {
    if (root.PCColorUtils?.hexToRgba) return root.PCColorUtils.hexToRgba(hex, alpha);
    if (typeof root.hexToRgba === 'function') return root.hexToRgba(hex, alpha);
    const clean = (hex || '').replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const defaultThemes = root.DEFAULT_THEMES || {};
  const defaultPrompts = root.DEFAULT_PROMPTS || [];

  const PCSidebar = {
    escapeHtml,

    state: {
      open: false,
      activeTab: 'prompts',
      activeCategory: 'All',
      searchQuery: '',
      prompts: defaultPrompts,
      themes: defaultThemes,
      activeTheme: 'ferrariCorse',
      activeFont: 'Inter',
      activeFontCategory: 'All',
      fontSampleText: '',
      fontSize: '15px',
      settings: {},
      uiPalette: null,
      platformLabel: 'AI Chat'
    },

    callbacks: {
      onInsertPrompt: null,
      onSavePrompt: null,
      onDeletePrompt: null,
      onSelectTheme: null,
      onUpdateWallpaper: null,
      onToggleTheme: null,
      onTogglePrompts: null,
      onFontChange: null,
      onFontSizeChange: null,
      onRadiusChange: null,
      onOpenOptions: null,
      onResetDefaults: null,
      onSidebarToggle: null
    },

    elements: {},

    // ===== COMPONENT RENDERERS =====

    // ===== COMPONENT TEMPLATE PROXIES =====

    renderPromptCard(p) {
      if (root.PCSidebarTemplates?.renderPromptCard) {
        return root.PCSidebarTemplates.renderPromptCard(p);
      }
      return '';
    },

    renderCategoryChip(cat, count, isActive) {
      if (root.PCSidebarTemplates?.renderCategoryChip) {
        return root.PCSidebarTemplates.renderCategoryChip(cat, count, isActive);
      }
      return '';
    },

    renderThemeCard(theme, isSelected) {
      if (root.PCSidebarTemplates?.renderThemeCard) {
        return root.PCSidebarTemplates.renderThemeCard(theme, isSelected);
      }
      return '';
    },

    renderFontCard(font, isActive, customSample) {
      if (root.PCSidebarTemplates?.renderFontCard) {
        return root.PCSidebarTemplates.renderFontCard(font, isActive, customSample);
      }
      return '';
    },

    renderFontCategoryChip(cat, count, isActive) {
      if (root.PCSidebarTemplates?.renderFontCategoryChip) {
        return root.PCSidebarTemplates.renderFontCategoryChip(cat, count, isActive);
      }
      return '';
    },

    buildSidebarSkeleton(platformLabel) {
      if (root.PCSidebarTemplates?.buildSidebarSkeleton) {
        return root.PCSidebarTemplates.buildSidebarSkeleton(platformLabel);
      }
      return '';
    },

    // ===== UI NOTIFICATIONS =====

    showToast(message) {
      const toast = document.getElementById('pc-toast');
      const msg = document.getElementById('pc-toast-msg');
      if (!toast || !msg) return;
      msg.textContent = message;
      toast.classList.add('pc-show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => toast.classList.remove('pc-show'), 2000);
    },

    // ===== SIDEBAR INITIALIZATION & MOUNTING =====

    mount(container = document.body, platformLabel = 'AI Chat') {
      const existingRoot = document.getElementById('promptcanvas-root');
      if (existingRoot) {
        this.elements.root = existingRoot;
        this.elements.toggleBtn = document.getElementById('pc-toggle-btn');
        this.bindEvents();
        this.renderCategories();
        this.renderPrompts();
        this.renderThemes();
        this.preloadFontPreviews();
        this.renderFontCategories();
        this.renderFonts();
        this.renderStudioMiniPreview();
        this.syncControls();
        return;
      }

      this.state.platformLabel = platformLabel;

      // 1. Create Floating Toggle Handle
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'pc-toggle-btn';
      toggleBtn.title = 'PromptCanvas (Alt+P)';
      toggleBtn.innerHTML = `
        ${root.PCIcons?.toggle || ''}
        <span class="pc-toggle-label">PROMPTS</span>
      `;
      toggleBtn.addEventListener('click', () => this.toggle());
      container.appendChild(toggleBtn);
      this.elements.toggleBtn = toggleBtn;

      // 2. Create Sidebar Root & Inject Skeleton
      const rootDiv = document.createElement('div');
      rootDiv.id = 'promptcanvas-root';
      rootDiv.innerHTML = this.buildSidebarSkeleton(platformLabel);
      container.appendChild(rootDiv);
      this.elements.root = rootDiv;

      // 3. Attach Events & Initial Render
      this.bindEvents();
      this.renderCategories();
      this.renderPrompts();
      this.renderThemes();
      this.preloadFontPreviews();
      this.renderFontCategories();
      this.renderFonts();
      this.renderStudioMiniPreview();
      this.syncControls();

      if (this.state.settings.sidebarOpen) {
        setTimeout(() => this.open(), 400);
      }
    },

    init(options = {}) {
      if (options.platformLabel) this.state.platformLabel = options.platformLabel;
      if (options.prompts) this.state.prompts = options.prompts;
      if (options.themes) this.state.themes = options.themes;
      if (options.settings) {
        this.state.settings = options.settings;
        if (options.settings.activeTheme) this.state.activeTheme = options.settings.activeTheme;
      }
      if (options.uiPalette) this.state.uiPalette = options.uiPalette;

      // Register callbacks
      Object.keys(this.callbacks).forEach(k => {
        if (typeof options[k] === 'function') this.callbacks[k] = options[k];
      });

      // Mount to container (default: document.body)
      this.mount(options.container || document.body, this.state.platformLabel);

      if (this.state.uiPalette) {
        this.applyUIPalette(this.state.uiPalette);
      }
    },

    // ===== OPEN / CLOSE / TOGGLE =====

    open() {
      const root = this.elements.root || document.getElementById('promptcanvas-root');
      const toggleBtn = this.elements.toggleBtn || document.getElementById('pc-toggle-btn');
      if (!root) return;
      root.classList.add('pc-open');
      if (toggleBtn) toggleBtn.classList.add('pc-hidden');
      this.state.open = true;
      this.callbacks.onSidebarToggle?.(true);
    },

    close() {
      const root = this.elements.root || document.getElementById('promptcanvas-root');
      const toggleBtn = this.elements.toggleBtn || document.getElementById('pc-toggle-btn');
      if (!root) return;
      root.classList.remove('pc-open');
      if (toggleBtn) toggleBtn.classList.remove('pc-hidden');
      this.state.open = false;
      this.callbacks.onSidebarToggle?.(false);
    },

    toggle() {
      this.state.open ? this.close() : this.open();
    },

    switchTab(tabName) {
      document.querySelectorAll('.pc-tab').forEach(t => t.classList.remove('pc-active'));
      document.querySelectorAll('.pc-content').forEach(c => c.classList.remove('pc-active'));
      const targetTab = document.querySelector(`.pc-tab[data-tab="${tabName}"]`);
      const targetContent = document.getElementById(`pc-tab-${tabName}`);
      if (targetTab && targetContent) {
        targetTab.classList.add('pc-active');
        targetContent.classList.add('pc-active');
        this.state.activeTab = tabName;
      }
    },

    // ===== RENDERERS & LIVE UPDATES =====

    updateState(updates = {}) {
      if (updates.prompts) {
        this.state.prompts = updates.prompts;
        this.renderCategories();
        this.renderPrompts();
      }
      if (updates.themes) {
        this.state.themes = updates.themes;
        this.renderThemes();
      }
      if (updates.settings) {
        this.state.settings = updates.settings;
        if (updates.settings.activeTheme && updates.settings.activeTheme !== this.state.activeTheme) {
          this.state.activeTheme = updates.settings.activeTheme;
          this.renderThemes();
        }
        this.syncControls();
      }
      if (updates.uiPalette) {
        this.state.uiPalette = updates.uiPalette;
        this.applyUIPalette(updates.uiPalette);
      }
    },

    applyUIPalette(p) {
      if (!p) return;
      const root = this.elements.root || document.getElementById('promptcanvas-root');
      const toggleBtn = this.elements.toggleBtn || document.getElementById('pc-toggle-btn');
      if (root) {
        if (p.canvas) {
          root.style.setProperty('--pc-ui-bg', p.canvas);
          root.style.setProperty('--pc-ui-card', '#FFFFFF');
        }
        if (p.controls) {
          root.style.setProperty('--pc-ui-primary', p.controls);
          const clean = (p.controls || '').replace('#', '');
          if (clean.length === 6) {
            const num = parseInt(clean, 16);
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            root.style.setProperty('--pc-ui-border', `rgba(${r}, ${g}, ${b}, 0.16)`);
            root.style.setProperty('--pc-ui-border-strong', `rgba(${r}, ${g}, ${b}, 0.32)`);
          }
        }
        // Always enforce crisp dark text and readable gray secondary text
        root.style.setProperty('--pc-ui-text', '#0F172A');
        root.style.setProperty('--pc-ui-muted', '#475569');
        if (p.accent) root.style.setProperty('--pc-ui-accent', p.accent);
      }
      if (toggleBtn) {
        if (p.controls) {
          toggleBtn.style.background = p.controls;
          toggleBtn.style.borderColor = p.controls;
        }
        if (p.canvas) toggleBtn.style.color = p.canvas;
      }
      this.renderStudioMiniPreview();
    },

    renderStudioMiniPreview() {
      const el = document.getElementById('pc-studio-mini-preview');
      if (!el) return;
      const p = this.state.uiPalette;
      const swatches = (p && p.swatches && p.swatches.length)
        ? p.swatches
        : ['#283845', '#151E25', '#FFA649', '#FFE8D1', '#FFFBF5'];
      el.innerHTML = swatches.map(c => `<span class="pc-mini-swatch" style="background:${c};" title="${c}"></span>`).join('');
    },

    renderCategories() {
      const bar = document.getElementById('pc-cat-bar');
      if (!bar) return;
      const cats = ['All'];
      const counts = { All: this.state.prompts.length };
      this.state.prompts.forEach(p => {
        const raw = p.category ? p.category.trim() : 'General';
        const c = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        if (!cats.includes(c)) cats.push(c);
        counts[c] = (counts[c] || 0) + 1;
      });

      if (!cats.includes(this.state.activeCategory)) this.state.activeCategory = 'All';

      bar.innerHTML = cats.map(cat => {
        return this.renderCategoryChip(cat, counts[cat] || 0, this.state.activeCategory === cat);
      }).join('');

      bar.querySelectorAll('.pc-cat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.state.activeCategory = chip.dataset.cat;
          this.renderCategories();
          this.renderPrompts();
        });
      });
    },

    renderPrompts() {
      const list = document.getElementById('pc-prompt-list');
      const badge = document.getElementById('pc-badge-prompts');
      if (badge) badge.textContent = this.state.prompts.length;
      if (!list) return;

      const query = this.state.searchQuery.toLowerCase().trim();
      const activeCat = this.state.activeCategory;

      const filtered = this.state.prompts.filter(p => {
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
            ${root.PCIcons?.empty || ''}
            <div class="pc-empty-title">${query ? 'No matching prompts' : 'Prompt library empty'}</div>
            <div class="pc-empty-text">${query ? 'Try a different keyword or select another category.' : 'Click "New" above to add your first template.'}</div>
          </div>`;
        return;
      }

      list.innerHTML = filtered.map(p => this.renderPromptCard(p)).join('');

      list.querySelectorAll('.pc-prompt-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const actionBtn = e.target.closest('.pc-card-btn, .pc-card-insert-btn');
          const promptId = card.dataset.promptId;
          const prompt = this.state.prompts.find(p => p.id === promptId);
          if (!prompt) return;

          if (actionBtn) {
            e.stopPropagation();
            const action = actionBtn.dataset.action;
            if (action === 'insert') {
              actionBtn.classList.add('pc-inserted');
              setTimeout(() => actionBtn.classList.remove('pc-inserted'), 650);
              this.callbacks.onInsertPrompt?.(prompt, actionBtn);
            } else if (action === 'copy') {
              navigator.clipboard?.writeText(prompt.text).then(() => this.showToast('Copied to clipboard'));
            } else if (action === 'delete') {
              this.deletePrompt(promptId);
            }
          } else {
            const insertBtn = card.querySelector('.pc-card-insert-btn');
            if (insertBtn) {
              insertBtn.classList.add('pc-inserted');
              setTimeout(() => insertBtn.classList.remove('pc-inserted'), 650);
            }
            this.callbacks.onInsertPrompt?.(prompt, insertBtn);
          }
        });
      });
    },

    deletePrompt(promptId) {
      this.state.prompts = this.state.prompts.filter(p => p.id !== promptId);
      this.renderCategories();
      this.renderPrompts();
      this.callbacks.onDeletePrompt?.(promptId, this.state.prompts);
      this.showToast('Prompt deleted');
    },

    themeFilter: 'all',

    renderThemeFilterBar() {
      const bar = document.getElementById('pc-theme-filter-bar');
      if (!bar) return;
      const categories = ['all', 'Luxury', 'Cyber', 'Vibrant', 'Nature', 'Warm', 'Cool'];
      bar.innerHTML = categories.map(cat => `
        <button class="pc-theme-filter-chip ${this.themeFilter === cat ? 'active' : ''}" data-cat="${cat}">
          ${cat === 'all' ? 'All (20)' : cat}
        </button>
      `).join('');

      bar.querySelectorAll('.pc-theme-filter-chip').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.themeFilter = btn.dataset.cat;
          this.renderThemeFilterBar();
          this.renderThemes();
        });
      });
    },

    renderThemes() {
      const grid = document.getElementById('pc-theme-grid');
      if (!grid) return;
      this.renderThemeFilterBar();
      const allThemes = Object.values(this.state.themes);
      const filtered = this.themeFilter === 'all'
        ? allThemes
        : allThemes.filter(t => (t.category || '').toLowerCase() === this.themeFilter.toLowerCase());

      grid.innerHTML = filtered.map(theme => {
        return this.renderThemeCard(theme, this.state.activeTheme === theme.id);
      }).join('');

      grid.querySelectorAll('.pc-theme-card').forEach(card => {
        card.addEventListener('click', () => {
          const themeId = card.dataset.themeId;
          this.state.activeTheme = themeId;
          this.renderThemes();
          this.syncControls();
          this.callbacks.onSelectTheme?.(themeId);
          this.showToast('Theme applied');
        });
      });
    },

    preloadFontPreviews() {
      if (document.getElementById('pc-fonts-preview-link')) return;
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          const popularBatch = ['Inter', 'Outfit', 'Playfair Display', 'Caveat', 'Fredoka', 'JetBrains Mono'];
          popularBatch.forEach(font => {
            chrome.runtime.sendMessage({ type: 'FETCH_INLINED_FONT', fontName: font });
          });
        }
      } catch (e) {}
      const link = document.createElement('link');
      link.id = 'pc-fonts-preview-link';
      link.rel = 'stylesheet';
      link.href = root.PCFonts?.getBatchedGoogleFontsUrl?.() || 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap';
      document.head.appendChild(link);
    },

    renderFontCategories() {
      const bar = document.getElementById('pc-font-cat-bar');
      if (!bar) return;
      const categories = root.PCFonts?.FONT_CATEGORIES || ['All', 'Premium', 'Stylish', 'Handwriting', 'Goofy', 'Monospace'];
      const allPresets = root.PCFonts?.FONT_PRESETS || [];
      const counts = { All: allPresets.length };
      allPresets.forEach(f => {
        counts[f.category] = (counts[f.category] || 0) + 1;
      });

      bar.innerHTML = categories.map(cat => {
        return this.renderFontCategoryChip(cat, counts[cat] || 0, this.state.activeFontCategory === cat);
      }).join('');

      bar.querySelectorAll('.pc-font-cat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.state.activeFontCategory = chip.dataset.cat;
          this.renderFontCategories();
          this.renderFonts();
        });
      });
    },

    renderFonts() {
      const list = document.getElementById('pc-font-list');
      if (!list) return;
      const allPresets = root.PCFonts?.FONT_PRESETS || [];
      const activeCat = this.state.activeFontCategory || 'All';
      const activeFont = this.state.activeFont || this.state.settings?.activeFont || 'Inter';
      const customSample = this.state.fontSampleText || '';

      const filtered = allPresets.filter(f => {
        if (activeCat === 'All') return true;
        return f.category.toLowerCase() === activeCat.toLowerCase();
      });

      list.innerHTML = filtered.map(f => {
        const isActive = f.name.toLowerCase() === activeFont.toLowerCase();
        return this.renderFontCard(f, isActive, customSample);
      }).join('');

      list.querySelectorAll('.pc-font-card').forEach(card => {
        card.addEventListener('click', () => {
          const fontName = card.dataset.font;
          if (fontName) this.applyFont(fontName);
        });
      });
    },

    applyFont(fontName) {
      this.state.activeFont = fontName;
      this.state.settings = this.state.settings || {};
      this.state.settings.activeFont = fontName;

      if (typeof root.PCApplyCustomFont === 'function') {
        root.PCApplyCustomFont(fontName);
      } else {
        document.documentElement.style.setProperty('--pc-font', `'${fontName}', sans-serif`);
        let fontStyleEl = document.getElementById('pc-chatgpt-font-style');
        if (!fontStyleEl) {
          fontStyleEl = document.createElement('style');
          fontStyleEl.id = 'pc-chatgpt-font-style';
          document.head.appendChild(fontStyleEl);
        }
        const isMonospace = ['JetBrains Mono', 'Fira Code', 'VT323'].includes(fontName);
        const codeFont = isMonospace ? `'${fontName}', monospace !important` : `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace !important`;
        fontStyleEl.textContent = `
          :root, html, body {
            --font-sans: '${fontName}', sans-serif !important;
            --font-serif: '${fontName}', serif !important;
            --pc-font: '${fontName}', sans-serif !important;
          }
          html, body,
          #prompt-textarea, #prompt-textarea *,
          .ProseMirror, .ProseMirror *,
          div[contenteditable="true"], div[contenteditable="true"] *,
          main, main *,
          article, article *,
          [data-message-author-role], [data-message-author-role] *,
          .markdown, .markdown *,
          [class*="font-sans"], [class*="font-user-message"], [class*="font-normal"], [class*="font-medium"], [class*="font-semibold"], [class*="font-bold"],
          [class*="text-token-text"], div[class*="conversation-"], div[class*="text-base"],
          p, h1, h2, h3, h4, h5, h6,
          textarea, input,
          button:not([class*="icon"]):not(.pc-tab-svg *):not(#promptcanvas-root *):not(#pc-toggle-btn *) {
            font-family: '${fontName}', sans-serif !important;
          }
          pre, pre *, code, code *, kbd, kbd *, samp, samp *,
          .font-mono, [class*="font-mono"], .hljs, .hljs * {
            font-family: ${codeFont};
          }
        `;

        try {
          if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
            chrome.runtime.sendMessage({ type: 'FETCH_INLINED_FONT', fontName: fontName }, (res) => {
              if (res && res.success && res.css) {
                let fontFaceEl = document.getElementById('pc-font-face-style');
                if (!fontFaceEl) {
                  fontFaceEl = document.createElement('style');
                  fontFaceEl.id = 'pc-font-face-style';
                  document.head.appendChild(fontFaceEl);
                }
                fontFaceEl.textContent = res.css;
              }
            });
          }
        } catch (e) {}
      }

      const statusEl = document.getElementById('pc-active-font-name');
      if (statusEl) statusEl.textContent = fontName;

      this.renderFonts();
      this.callbacks.onFontChange?.(fontName);
      this.showToast(`Font set to ${fontName}`);
    },

    updateActiveThemeWallpaper(patch) {
      const activeThemeId = this.state.activeTheme;
      if (!this.state.themes[activeThemeId]) return;
      const theme = this.state.themes[activeThemeId];
      theme.wallpaper = Object.assign({}, theme.wallpaper || {
        enabled: true,
        type: 'preset',
        presetId: 'ferrari-racing',
        url: '',
        blur: 0,
        brightness: 85,
        overlayOpacity: 42,
        panelBlur: 14
      }, patch);

      this.callbacks.onUpdateWallpaper?.(theme, this.state.themes);
      this.syncControls();
      this.renderThemes();

      if (root.PCThemeEngine) {
        root.PCThemeEngine.applyWallpaper(theme, this.state.settings?.themeEnabled);
        root.PCThemeEngine.applyCSSVars(theme, this.state.settings?.themeEnabled);
        root.PCThemeEngine.applyPageTheme(theme, this.state.platformLabel?.toLowerCase() || 'chatgpt', this.state.settings?.themeEnabled);
      }
    },

    syncControls() {
      const activeFont = this.state.settings?.activeFont || this.state.activeFont || 'Inter';
      const statusEl = document.getElementById('pc-active-font-name');
      if (statusEl) statusEl.textContent = activeFont;
      this.state.activeFont = activeFont;

      const fontTabSlider = document.getElementById('range-fonts-tab-size');
      const fontTabVal = document.getElementById('val-fonts-tab-size');
      const savedFontSize = parseInt(this.state.settings?.fontSize || '15', 10);
      if (fontTabSlider && !isNaN(savedFontSize)) {
        fontTabSlider.value = savedFontSize;
        if (fontTabVal) fontTabVal.textContent = `${savedFontSize}px`;
      }
      
      const s = this.state.settings || {};
      const themeToggle = document.getElementById('toggle-theme-enabled');
      if (themeToggle && typeof s.themeEnabled !== 'undefined') {
        themeToggle.checked = Boolean(s.themeEnabled);
      }
      const promptsToggle = document.getElementById('toggle-prompts-enabled');
      if (promptsToggle && typeof s.promptsEnabled !== 'undefined') {
        promptsToggle.checked = Boolean(s.promptsEnabled);
      }
      const fontSelect = document.getElementById('select-font');
      if (fontSelect && s.fontFamily) fontSelect.value = s.fontFamily;

      const fontSlider = document.getElementById('range-fontsize');
      const fontVal = document.getElementById('val-fontsize');
      if (fontSlider && s.fontSize) {
        fontSlider.value = parseInt(s.fontSize, 10);
        if (fontVal) fontVal.textContent = `${fontSlider.value}px`;
      }

      const radSlider = document.getElementById('range-radius');
      const radVal = document.getElementById('val-radius');
      if (radSlider && s.messageRadius) {
        radSlider.value = parseInt(s.messageRadius, 10);
        if (radVal) radVal.textContent = `${radSlider.value}px`;
      }

      // Wallpaper Controls Sync
      const activeTheme = this.state.themes[this.state.activeTheme];
      const wp = activeTheme?.wallpaper || {};
      const wpToggle = document.getElementById('toggle-wallpaper-enabled');
      const wpControls = document.getElementById('pc-wallpaper-controls');
      if (wpToggle) {
        wpToggle.checked = Boolean(wp.enabled);
      }
      if (wpControls) {
        wpControls.style.display = wp.enabled ? 'flex' : 'none';
      }

      const wpPresetSelect = document.getElementById('select-wallpaper-preset');
      const customUploadRow = document.getElementById('row-custom-upload');
      const customUrlInput = document.getElementById('input-wallpaper-url');
      if (wpPresetSelect) {
        wpPresetSelect.value = (wp.type === 'custom_upload' || wp.type === 'custom_url')
          ? 'custom'
          : (wp.presetId || 'ferrari-racing');
      }
      if (customUploadRow) {
        customUploadRow.style.display = (wp.type === 'custom_upload' || wp.type === 'custom_url' || wpPresetSelect?.value === 'custom')
          ? 'flex'
          : 'none';
      }
      if (customUrlInput && wp.type === 'custom_url') {
        customUrlInput.value = wp.url || '';
      }

      const blurSlider = document.getElementById('range-glass-blur');
      const blurVal = document.getElementById('val-glass-blur');
      if (blurSlider) {
        const val = typeof wp.panelBlur !== 'undefined' ? wp.panelBlur : 14;
        blurSlider.value = val;
        if (blurVal) blurVal.textContent = `${val}px`;
      }

      const tintSlider = document.getElementById('range-wallpaper-tint');
      const tintVal = document.getElementById('val-wallpaper-tint');
      if (tintSlider) {
        const val = typeof wp.overlayOpacity !== 'undefined' ? wp.overlayOpacity : 45;
        tintSlider.value = val;
        if (tintVal) tintVal.textContent = `${val}%`;
      }

      const brightSlider = document.getElementById('range-wallpaper-brightness');
      const brightVal = document.getElementById('val-wallpaper-brightness');
      if (brightSlider) {
        const val = typeof wp.brightness !== 'undefined' ? wp.brightness : 85;
        brightSlider.value = val;
        if (brightVal) brightVal.textContent = `${val}%`;
      }
    },

    // ===== MODAL LOGIC =====

    openModal() {
      document.getElementById('pc-modal-overlay')?.classList.add('pc-visible');
      document.getElementById('modal-title')?.focus();
    },

    closeModal() {
      document.getElementById('pc-modal-overlay')?.classList.remove('pc-visible');
      ['modal-title', 'modal-category', 'modal-text'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    },

    saveNewPrompt() {
      const title = document.getElementById('modal-title')?.value.trim();
      const category = document.getElementById('modal-category')?.value.trim();
      const text = document.getElementById('modal-text')?.value.trim();

      if (!title || !text) {
        this.showToast('Title and prompt content required');
        return;
      }

      const cat = category || 'General';
      const newPrompt = {
        id: `p_${Date.now()}`,
        title,
        category: cat,
        text,
        tags: [cat.toLowerCase()]
      };

      this.state.prompts.unshift(newPrompt);
      this.closeModal();
      this.renderCategories();
      this.renderPrompts();
      this.callbacks.onSavePrompt?.(newPrompt, this.state.prompts);
      this.showToast('Prompt saved');
    },

    // ===== EVENT BINDINGS =====

    bindEvents() {
      // Close button
      document.getElementById('pc-close-btn')?.addEventListener('click', () => this.close());

      // Tabs
      document.querySelectorAll('.pc-tab').forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
      });

      // Options & Studio buttons
      document.getElementById('pc-header-options-btn')?.addEventListener('click', () => this.callbacks.onOpenOptions?.());
      document.getElementById('btn-open-options-page')?.addEventListener('click', () => this.callbacks.onOpenOptions?.('palette'));
      document.getElementById('btn-open-studio-card')?.addEventListener('click', () => this.callbacks.onOpenOptions?.('palette'));
      document.getElementById('btn-open-wallpapers-studio')?.addEventListener('click', () => this.callbacks.onOpenOptions?.('wallpapers'));
      document.getElementById('pc-btn-footer-options')?.addEventListener('click', () => this.callbacks.onOpenOptions?.());

      // Search
      const searchInput = document.getElementById('pc-search');
      const searchClear = document.getElementById('pc-search-clear');
      searchInput?.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        if (searchClear) searchClear.style.display = this.state.searchQuery ? 'block' : 'none';
        this.renderPrompts();
      });
      searchClear?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.state.searchQuery = '';
        searchClear.style.display = 'none';
        this.renderPrompts();
        searchInput?.focus();
      });

      // Add Prompt Modal
      document.getElementById('pc-add-prompt-btn')?.addEventListener('click', () => this.openModal());
      document.getElementById('pc-modal-close')?.addEventListener('click', () => this.closeModal());
      document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal());
      document.getElementById('modal-save')?.addEventListener('click', () => this.saveNewPrompt());
      document.getElementById('pc-modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'pc-modal-overlay') this.closeModal();
      });

      // Modal Category Suggestion Chips
      document.querySelectorAll('.pc-chip-suggest').forEach(chip => {
        chip.addEventListener('click', () => {
          const catInput = document.getElementById('modal-category');
          if (catInput) catInput.value = chip.dataset.cat;
        });
      });

      // Modal Quick Variable Chips
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

      // Typography & Geometry Sliders
      // Interactive Font Preview Input
      const sampleInput = document.getElementById('input-font-sample');
      const sampleClear = document.getElementById('btn-clear-font-sample');
      sampleInput?.addEventListener('input', (e) => {
        this.state.fontSampleText = e.target.value;
        if (sampleClear) sampleClear.style.display = this.state.fontSampleText ? 'block' : 'none';
        this.renderFonts();
      });
      sampleClear?.addEventListener('click', () => {
        if (sampleInput) sampleInput.value = '';
        this.state.fontSampleText = '';
        sampleClear.style.display = 'none';
        this.renderFonts();
        sampleInput?.focus();
      });

      // Fonts Tab Size Slider
      const fontTabSlider = document.getElementById('range-fonts-tab-size');
      const fontTabVal = document.getElementById('val-fonts-tab-size');
      fontTabSlider?.addEventListener('input', (e) => {
        const size = `${e.target.value}px`;
        if (fontTabVal) fontTabVal.textContent = size;
        this.state.fontSize = size;
        document.documentElement.style.setProperty('--pc-font-size', size);
        this.callbacks.onFontSizeChange?.(size);
      });

      // Reset Font to Default
      document.getElementById('btn-reset-font')?.addEventListener('click', () => {
        this.applyFont('Inter');
      });

      document.getElementById('select-font')?.addEventListener('change', (e) => {
        this.callbacks.onFontChange?.(e.target.value);
        this.showToast(`Font set to ${e.target.value}`);
      });

      const fontSlider = document.getElementById('range-fontsize');
      const fontVal = document.getElementById('val-fontsize');
      fontSlider?.addEventListener('input', (e) => {
        const size = `${e.target.value}px`;
        if (fontVal) fontVal.textContent = size;
        this.callbacks.onFontSizeChange?.(size);
      });

      const radSlider = document.getElementById('range-radius');
      const radVal = document.getElementById('val-radius');
      radSlider?.addEventListener('input', (e) => {
        const rad = `${e.target.value}px`;
        if (radVal) radVal.textContent = rad;
        this.callbacks.onRadiusChange?.(rad);
      });

      // Wallpaper Controls Event Bindings
      document.getElementById('toggle-wallpaper-enabled')?.addEventListener('change', (e) => {
        this.updateActiveThemeWallpaper({ enabled: e.target.checked });
        this.showToast(e.target.checked ? 'Wallpaper enabled' : 'Wallpaper disabled');
      });

      document.getElementById('select-wallpaper-preset')?.addEventListener('change', (e) => {
        const val = e.target.value;
        const customUploadRow = document.getElementById('row-custom-upload');
        if (val === 'custom') {
          if (customUploadRow) customUploadRow.style.display = 'flex';
          this.updateActiveThemeWallpaper({ type: 'custom_url' });
        } else {
          if (customUploadRow) customUploadRow.style.display = 'none';
          this.updateActiveThemeWallpaper({
            type: 'preset',
            presetId: val,
            url: root.PCThemeEngine?.PRESET_WALLPAPERS?.[val]?.url || ''
          });
          this.showToast('Curated wallpaper set');
        }
      });

      const fileInput = document.getElementById('input-wallpaper-file');
      document.getElementById('btn-upload-wallpaper')?.addEventListener('click', () => {
        fileInput?.click();
      });

      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let w = img.width;
            let h = img.height;
            const maxDim = 1920;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            this.updateActiveThemeWallpaper({
              enabled: true,
              type: 'custom_upload',
              dataUrl: dataUrl
            });
            this.showToast('Custom wallpaper applied');
          };
          img.src = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      });

      const customUrlInput = document.getElementById('input-wallpaper-url');
      const applyCustomUrl = () => {
        const url = customUrlInput?.value.trim();
        if (url) {
          this.updateActiveThemeWallpaper({
            enabled: true,
            type: 'custom_url',
            url: url
          });
          this.showToast('Custom wallpaper URL applied');
        }
      };
      customUrlInput?.addEventListener('change', applyCustomUrl);
      customUrlInput?.addEventListener('blur', applyCustomUrl);

      const glassBlurSlider = document.getElementById('range-glass-blur');
      const glassBlurVal = document.getElementById('val-glass-blur');
      glassBlurSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (glassBlurVal) glassBlurVal.textContent = `${val}px`;
        this.updateActiveThemeWallpaper({ panelBlur: val });
      });

      const tintSlider = document.getElementById('range-wallpaper-tint');
      const tintVal = document.getElementById('val-wallpaper-tint');
      tintSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (tintVal) tintVal.textContent = `${val}%`;
        this.updateActiveThemeWallpaper({ overlayOpacity: val });
      });

      const brightSlider = document.getElementById('range-wallpaper-brightness');
      const brightVal = document.getElementById('val-wallpaper-brightness');
      brightSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (brightVal) brightVal.textContent = `${val}%`;
        this.updateActiveThemeWallpaper({ brightness: val });
      });

      // Workspace Toggles
      document.getElementById('toggle-theme-enabled')?.addEventListener('change', (e) => {
        this.callbacks.onToggleTheme?.(e.target.checked);
        this.showToast(e.target.checked ? 'Theming enabled' : 'Theming disabled');
      });

      document.getElementById('toggle-prompts-enabled')?.addEventListener('change', (e) => {
        this.callbacks.onTogglePrompts?.(e.target.checked);
      });

      // Reset Defaults
      document.getElementById('btn-reset')?.addEventListener('click', () => {
        this.callbacks.onResetDefaults?.();
      });
    },

    // Standalone Harness Runner (for when sidebar.html is opened directly)
    initStandalone() {
      if (document.body.dataset.pcStandaloneInit) return;
      document.body.dataset.pcStandaloneInit = 'true';

      this.init({
        platformLabel: 'Standalone',
        onInsertPrompt: (prompt) => {
          navigator.clipboard?.writeText(prompt.text).then(() => this.showToast('Copied to clipboard'));
        },
        onSelectTheme: (themeId) => {
          this.state.activeTheme = themeId;
        },
        onOpenOptions: (panel) => {
          alert(`Opening Options panel: ${panel || 'dashboard'}`);
        },
        onResetDefaults: () => {
          if (confirm('Reset defaults?')) {
            location.reload();
          }
        }
      });
    }
  };

  root.PCSidebar = PCSidebar;
  root.PCComponents = PCSidebar; // Alias for backward compatibility

  // Auto-init if loaded inside sidebar.html directly
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body.classList.contains('pc-sidebar-page')) {
          PCSidebar.initStandalone();
        }
      });
    } else {
      if (document.body.classList.contains('pc-sidebar-page')) {
        PCSidebar.initStandalone();
      }
    }
  }

})(typeof window !== 'undefined' ? window : this);
