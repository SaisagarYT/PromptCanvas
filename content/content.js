// PromptCanvas Content Script Orchestrator
// Modular SaaS Architecture: Uses PCIcons, PCComponents, PCThemeEngine, and PCComposer
// Zero external dependencies · High-precision Tokyo Duo & Active Color Studio

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

  const platformLabel = PLATFORM === 'chatgpt' ? 'ChatGPT' :
                        PLATFORM === 'claude' ? 'Claude' :
                        PLATFORM === 'deepseek' ? 'DeepSeek' :
                        PLATFORM === 'gemini' ? 'Gemini' : 'AI Chat';

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

  function getStorage(keys) {
    return new Promise((resolve) => {
      try {
        if (!isExtensionValid()) return resolve({});
        chrome.storage.local.get(keys, (res) => {
          try {
            if (!isExtensionValid() || safeLastError()) return resolve({});
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
      applyTheme();
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
    } catch (e) {}
  }

  function onStorageChanged(changes) {
    if (changes.settings) {
      state.settings = changes.settings.newValue || {};
      const newTheme = state.settings.activeTheme;
      if (newTheme && newTheme !== state.activeTheme) {
        state.activeTheme = newTheme;
        applyTheme();
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

  function applyTheme() {
    const theme = state.themes[state.activeTheme] || Object.values(state.themes)[0];
    if (!theme) return;
    window.PCThemeEngine?.applyCSSVars(theme, state.settings.themeEnabled);
    window.PCThemeEngine?.applyPageTheme(theme, PLATFORM, state.settings.themeEnabled);
  }

  // Styles the Extension UI (Sidebar & Toggle Handle) — never touches the AI workspace
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

  function injectSidebar() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'pc-toggle-btn';
    toggleBtn.title = 'PromptCanvas (Alt+P)';
    toggleBtn.innerHTML = `
      ${window.PCIcons?.toggle || ''}
      <span class="pc-toggle-label">PROMPTS</span>
    `;
    toggleBtn.addEventListener('click', toggleSidebar);
    document.body.appendChild(toggleBtn);

    sidebarRoot = document.createElement('div');
    sidebarRoot.id = 'promptcanvas-root';
    sidebarRoot.innerHTML = window.PCComponents.buildSidebarSkeleton(platformLabel);
    document.body.appendChild(sidebarRoot);

    attachSidebarEvents();
    renderCategoryBar();
    renderPromptsTab();
    renderThemeCards();
    renderStudioMiniPreview();

    if (state.settings.sidebarOpen) setTimeout(() => openSidebar(), 400);
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
      return window.PCComponents.renderCategoryChip(cat, counts[cat] || 0, state.activeCategory === cat);
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
          ${window.PCIcons?.empty || ''}
          <div class="pc-empty-title">${query ? 'No matching prompts' : 'Prompt library empty'}</div>
          <div class="pc-empty-text">${query ? 'Try a different keyword or select another category.' : 'Click "New" above to add your first template.'}</div>
        </div>`;
      return;
    }

    list.innerHTML = filtered.map(p => window.PCComponents.renderPromptCard(p)).join('');

    list.querySelectorAll('.pc-prompt-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.pc-card-btn, .pc-card-insert-btn');
        if (actionBtn) {
          e.stopPropagation();
          handlePromptAction(actionBtn.dataset.action, actionBtn.dataset.promptId, actionBtn);
        } else {
          const insertBtn = card.querySelector('.pc-card-insert-btn');
          handlePromptAction('insert', card.dataset.promptId, insertBtn);
        }
      });
    });
  }

  function handlePromptAction(action, promptId, btnEl) {
    const prompt = state.prompts.find(p => p.id === promptId);
    if (!prompt) return;

    if (action === 'insert') {
      const inserted = window.PCComposer.insert(prompt.text, PLATFORM, btnEl);
      window.PCComponents.showToast(inserted ? 'Prompt inserted' : 'Copied (paste manually)');
    } else if (action === 'copy') {
      navigator.clipboard.writeText(prompt.text).then(() => window.PCComponents.showToast('Copied to clipboard'));
    } else if (action === 'delete') {
      deletePrompt(promptId);
    }
  }

  async function deletePrompt(promptId) {
    try {
      state.prompts = state.prompts.filter(p => p.id !== promptId);
      await setStorage({ prompts: state.prompts });
      renderCategoryBar();
      renderPromptsTab();
      window.PCComponents.showToast('Prompt deleted');
    } catch (e) {}
  }

  function renderThemeCards() {
    const grid = document.getElementById('pc-theme-grid');
    if (!grid) return;

    grid.innerHTML = Object.values(state.themes).map(theme => {
      return window.PCComponents.renderThemeCard(theme, state.activeTheme === theme.id);
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
    try {
      state.activeTheme = themeId;
      state.settings.activeTheme = themeId;
      await setStorage({ settings: state.settings });
      applyTheme();
      updateThemeSelection();
      window.PCComponents.showToast('Theme applied');
    } catch (e) {}
  }

  function openSidebar() {
    try {
      if (!sidebarRoot) return;
      sidebarRoot.classList.add('pc-open');
      const toggleBtn = document.getElementById('pc-toggle-btn');
      if (toggleBtn) toggleBtn.classList.add('pc-hidden');
      state.open = true;
      state.settings.sidebarOpen = true;
      setStorage({ settings: state.settings }).catch(() => {});
    } catch (e) {}
  }

  function closeSidebar() {
    try {
      if (!sidebarRoot) return;
      sidebarRoot.classList.remove('pc-open');
      const toggleBtn = document.getElementById('pc-toggle-btn');
      if (toggleBtn) toggleBtn.classList.remove('pc-hidden');
      state.open = false;
      state.settings.sidebarOpen = false;
      setStorage({ settings: state.settings }).catch(() => {});
    } catch (e) {}
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
      window.PCComponents.showToast('Please reload this tab to reconnect PromptCanvas');
      return;
    }
    try {
      let url = '';
      try {
        url = chrome.runtime?.getURL ? chrome.runtime.getURL(`options/options.html${hash}`) : '';
      } catch (e) {}
      if (!url) return;

      chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS', panel }, (res) => {
        try {
          if (safeLastError() || !res) window.open(url, '_blank');
        } catch (e) {
          window.open(url, '_blank');
        }
      });
    } catch (e) {}
  }

  function attachSidebarEvents() {
    document.getElementById('pc-close-btn')?.addEventListener('click', closeSidebar);

    // Tab switching
    document.querySelectorAll('.pc-tab').forEach(tab => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Options openers
    document.getElementById('pc-header-options-btn')?.addEventListener('click', () => openOptionsPage());
    document.getElementById('btn-open-options-page')?.addEventListener('click', () => openOptionsPage('palette'));
    document.getElementById('btn-open-studio-card')?.addEventListener('click', () => openOptionsPage('palette'));
    document.getElementById('pc-btn-footer-options')?.addEventListener('click', () => openOptionsPage());

    // Font family
    document.getElementById('select-font')?.addEventListener('change', (e) => applyCustomFont(e.target.value));

    // Sliders with live value badges
    const fontSlider = document.getElementById('range-fontsize');
    const fontVal = document.getElementById('val-fontsize');
    fontSlider?.addEventListener('input', (e) => {
      const size = `${e.target.value}px`;
      if (fontVal) fontVal.textContent = size;
      document.documentElement.style.setProperty('--pc-font-size', size);
    });

    const radSlider = document.getElementById('range-radius');
    const radVal = document.getElementById('val-radius');
    radSlider?.addEventListener('input', (e) => {
      const rad = `${e.target.value}px`;
      if (radVal) radVal.textContent = rad;
      document.documentElement.style.setProperty('--pc-radius', rad);
      document.documentElement.style.setProperty('--pc-msg-radius', rad);
    });

    // Search input
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

    // Suggested categories in modal
    document.querySelectorAll('.pc-chip-suggest').forEach(chip => {
      chip.addEventListener('click', () => {
        const catInput = document.getElementById('modal-category');
        if (catInput) catInput.value = chip.dataset.cat;
      });
    });

    // Variable helper chips in modal
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

    // Settings toggles
    document.getElementById('toggle-theme-enabled')?.addEventListener('change', async (e) => {
      state.settings.themeEnabled = e.target.checked;
      await setStorage({ settings: state.settings });
      applyTheme();
      window.PCComponents.showToast(e.target.checked ? 'Theming enabled' : 'Theming disabled');
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
      window.PCComponents.showToast('Resetting...');
      setTimeout(() => window.location.reload(), 600);
    });
  }

  function applyCustomFont(font) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
    document.documentElement.style.setProperty('--pc-font', `'${font}', sans-serif`);
    window.PCComponents.showToast(`Font set to ${font}`);
  }

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        toggleSidebar();
        return;
      }
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
      window.PCComponents.showToast('Title and prompt content required');
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
    window.PCComponents.showToast('Prompt saved');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init().catch(() => {});
    });
  } else {
    init().catch(() => {});
  }
})();
