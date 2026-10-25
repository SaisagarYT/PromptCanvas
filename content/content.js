// PromptCanvas Host Platform Orchestrator
// Coordinates AI Chat Theming & Host Composer Injection with PCSidebar
// Zero external dependencies · High-precision Tokyo Duo Engine

(function () {
  'use strict';

  if (document.getElementById('promptcanvas-root')) return;

  const host = window.location.hostname;
  if (!host.includes('chatgpt.com') && !host.includes('openai.com')) return;

  const PLATFORM = 'chatgpt';
  const platformLabel = 'ChatGPT';

  let state = {
    settings: {},
    themes: {},
    prompts: [],
    activeTheme: 'ferrariCorse',
    uiPalette: null
  };

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
      state.activeTheme = state.settings.activeTheme || 'ferrariCorse';

      // Initialize the Sidebar module from sidebar/sidebar.js
      if (window.PCSidebar) {
        window.PCSidebar.init({
          platformLabel,
          prompts: state.prompts,
          themes: state.themes,
          settings: state.settings,
          uiPalette: state.uiPalette,

          onInsertPrompt: (prompt, btnEl) => {
            const inserted = window.PCComposer?.insert(prompt.text, PLATFORM, btnEl);
            window.PCSidebar.showToast(inserted ? 'Prompt inserted' : 'Copied (paste manually)');
          },

          onSavePrompt: async (newPrompt, allPrompts) => {
            state.prompts = allPrompts;
            await setStorage({ prompts: state.prompts });
          },

          onDeletePrompt: async (promptId, remainingPrompts) => {
            state.prompts = remainingPrompts;
            await setStorage({ prompts: state.prompts });
          },

          onSelectTheme: async (themeId) => {
            state.activeTheme = themeId;
            state.settings.activeTheme = themeId;
            await setStorage({ settings: state.settings });
            applyTheme();
          },

          onUpdateWallpaper: async (updatedTheme, allThemes) => {
            state.themes = allThemes;
            await setStorage({ themes: allThemes });
            applyTheme();
          },

          onToggleTheme: async (enabled) => {
            state.settings.themeEnabled = enabled;
            await setStorage({ settings: state.settings });
            applyTheme();
          },

          onTogglePrompts: async (enabled) => {
            state.settings.promptsEnabled = enabled;
            await setStorage({ settings: state.settings });
          },

          onFontChange: (font) => applyCustomFont(font),

          onFontSizeChange: (size) => {
            document.documentElement.style.setProperty('--pc-font-size', size);
          },

          onRadiusChange: (rad) => {
            document.documentElement.style.setProperty('--pc-radius', rad);
            document.documentElement.style.setProperty('--pc-msg-radius', rad);
          },

          onOpenOptions: (panel) => openOptionsPage(panel),

          onResetDefaults: async () => {
            if (!confirm('Reset all Tokyo Duo settings and prompt templates to factory defaults?')) return;
            if (isExtensionValid()) {
              try {
                await chrome.storage.local.clear();
              } catch (e) {}
            }
            window.PCSidebar?.showToast('Resetting...');
            setTimeout(() => window.location.reload(), 600);
          },

          onSidebarToggle: (isOpen) => {
            state.settings.sidebarOpen = isOpen;
            setStorage({ settings: state.settings }).catch(() => {});
          }
        });
      }

      applyTheme();
      observeComposer();

      // Listen for Chrome storage changes
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

  function observeComposer() {
    // Strictly ChatGPT-only logic. Claude, Gemini, DeepSeek, and LeetCode must never execute this.
    if (PLATFORM !== 'chatgpt') return;

    function tagComposer() {
      if (state.settings?.themeEnabled === false) return;
      const input = document.querySelector('#prompt-textarea');
      if (!input) return;
      const formEl = input.closest('form');
      if (!formEl) return;
      const capsule = formEl.querySelector(':scope > div') || formEl;
      if (capsule && !capsule.hasAttribute('data-pc-composer')) {
        capsule.setAttribute('data-pc-composer', 'true');
      }

      // Ensure placeholder / hint text is active when empty
      if (input.tagName === 'TEXTAREA' && !input.getAttribute('placeholder')) {
        input.setAttribute('placeholder', 'Ask anything');
      }
      const p = input.querySelector('p');
      if (p && !p.getAttribute('data-placeholder') && (!p.textContent || p.textContent.trim() === '')) {
        p.setAttribute('data-placeholder', 'Ask anything');
      }
    }

    function checkSidebarState() {
      const openBtn = document.querySelector('button[aria-label*="Open sidebar" i], button[aria-label*="Open navigation" i], button[data-testid*="open-sidebar" i]');
      const closeBtn = document.querySelector('button[aria-label*="Close sidebar" i], button[aria-label*="Close navigation" i], button[data-testid*="close-sidebar" i]');

      let isClosed = false;
      if (openBtn && !closeBtn) {
        isClosed = true;
      } else {
        const historyLink = document.querySelector('nav a[href*="/c/"], nav ol li a');
        if (historyLink) {
          const r = historyLink.getBoundingClientRect();
          if (r.width === 0 || r.right <= 60 || r.left < -20) {
            isClosed = true;
          }
        } else {
          const shell = document.querySelector('#app-shell-sidebar');
          if (!shell || shell.getBoundingClientRect().width <= 60) {
            isClosed = true;
          }
        }
      }

      const nextVal = isClosed ? 'closed' : 'open';
      if (document.documentElement.getAttribute('data-pc-sidebar') !== nextVal) {
        document.documentElement.setAttribute('data-pc-sidebar', nextVal);
        document.body.setAttribute('data-pc-sidebar', nextVal);
      }
    }

    function tagStarters() {
      // Don't waste CPU querying while chatting inside a conversation
      if (window.location.pathname.startsWith('/c/')) return;
      const candidates = document.querySelectorAll(`
        button[data-testid*="starter"],
        button[data-testid*="suggestion"],
        [data-testid="use-case-prompt-chips"] button,
        main div[class*="grid"] button,
        main div[class*="flex"] > button:has(svg),
        main button:has(svg):has(span),
        main a:has(svg):has(span)
      `);
      candidates.forEach(btn => {
        if (btn.closest('form') || btn.closest('#composer-background') || btn.closest('nav') || btn.closest('aside') || btn.closest('header')) return;
        if (!btn.hasAttribute('data-pc-starter')) {
          btn.setAttribute('data-pc-starter', 'true');
        }
      });
    }

    tagComposer();
    checkSidebarState();
    tagStarters();

    // Fast reaction to sidebar collapse/expand clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button[aria-label*="sidebar" i], button[aria-label*="navigation" i], button[data-testid*="sidebar" i]');
      if (btn) {
        setTimeout(checkSidebarState, 50);
        setTimeout(checkSidebarState, 200);
      }
    }, true);

    // Heavily debounced, childList-only observer (never observes attributes/styles to prevent recursion)
    try {
      let debounceTimer = null;
      const observer = new MutationObserver(() => {
        if (debounceTimer) return;
        debounceTimer = setTimeout(() => {
          debounceTimer = null;
          tagComposer();
          checkSidebarState();
          tagStarters();
        }, 300);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }


  function onStorageChanged(changes) {
    const updates = {};
    if (changes.settings) {
      state.settings = changes.settings.newValue || {};
      updates.settings = state.settings;
      const newTheme = state.settings.activeTheme;
      if (newTheme && newTheme !== state.activeTheme) {
        state.activeTheme = newTheme;
      }
      applyTheme();
    }
    if (changes.uiPalette) {
      state.uiPalette = changes.uiPalette.newValue || null;
      updates.uiPalette = state.uiPalette;
    }
    if (changes.prompts) {
      state.prompts = changes.prompts.newValue || [];
      updates.prompts = state.prompts;
    }
    if (changes.themes) {
      state.themes = changes.themes.newValue || {};
      updates.themes = state.themes;
      applyTheme();
    }

    window.PCSidebar?.updateState(updates);
  }

  function applyTheme() {
    const theme = state.themes[state.activeTheme] || Object.values(state.themes)[0];
    if (!theme) return;
    const globalWp = state.settings.wallpaper;
    const sidebarStyle = state.settings.sidebarStyle;
    const inputBarStyle = state.settings.inputBarStyle;
    window.PCThemeEngine?.applyCSSVars(theme, state.settings.themeEnabled, globalWp);
    window.PCThemeEngine?.applyPageTheme(theme, PLATFORM, state.settings.themeEnabled, globalWp, sidebarStyle, inputBarStyle);
  }

  function applyCustomFont(font) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700&display=swap`;
    document.head.appendChild(link);
    document.documentElement.style.setProperty('--pc-font', `'${font}', sans-serif`);
  }

  function openOptionsPage(panel = '') {
    const hash = panel ? `#${panel}` : '';
    if (!isExtensionValid()) {
      window.PCSidebar?.showToast('Please reload this tab to reconnect PromptCanvas');
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

  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Alt + P -> Toggle sidebar
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        window.PCSidebar?.toggle();
        return;
      }

      // Escape -> Close modal or sidebar
      if (e.key === 'Escape') {
        const modal = document.getElementById('pc-modal-overlay');
        if (modal && modal.classList.contains('pc-visible')) {
          window.PCSidebar?.closeModal();
          return;
        }
        if (window.PCSidebar?.state.open) {
          window.PCSidebar?.close();
          return;
        }
      }

      // / -> Focus search when sidebar is open
      if (e.key === '/' && window.PCSidebar?.state.open) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        window.PCSidebar?.switchTab('prompts');
        const searchInput = document.getElementById('pc-search');
        if (searchInput) searchInput.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init().catch(() => {});
    });
  } else {
    init().catch(() => {});
  }
})();
