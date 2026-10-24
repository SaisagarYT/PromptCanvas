// PromptCanvas Host Platform Orchestrator
// Coordinates AI Chat Theming & Host Composer Injection with PCSidebar
// Zero external dependencies · High-precision Tokyo Duo Engine

(function () {
  'use strict';

  if (document.getElementById('promptcanvas-root')) return;

  const PLATFORM = (() => {
    const host = window.location.hostname;
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return 'chatgpt';
    if (host.includes('gemini.google.com')) return 'gemini';
    if (host.includes('claude.ai')) return 'claude';
    if (host.includes('deepseek.com')) return 'deepseek';
    if (host.includes('leetcode.com')) return 'leetcode';
    return 'unknown';
  })();

  const platformLabel = PLATFORM === 'chatgpt' ? 'ChatGPT' :
                        PLATFORM === 'claude' ? 'Claude' :
                        PLATFORM === 'deepseek' ? 'DeepSeek' :
                        PLATFORM === 'gemini' ? 'Gemini' :
                        PLATFORM === 'leetcode' ? 'LeetCode' : 'AI Chat';

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
    function tagComposer() {
      if (state.settings?.themeEnabled === false) return;

      const input = document.querySelector('#prompt-textarea') ||
                    document.querySelector('.ProseMirror') ||
                    document.querySelector('textarea[placeholder]') ||
                    document.querySelector('div[contenteditable="true"]:not(#promptcanvas-root *)');
      if (!input) return;

      const formEl = input.closest('form');
      let capsule = null;

      // 1. Walk upward from input to find the immediate pill capsule that wraps input and buttons
      let current = input.parentElement;
      while (current && current !== formEl && current !== document.body && current !== document.documentElement) {
        const cls = String(current.className || '');
        const id = String(current.id || '');
        const hasButtons = Boolean(current.querySelector('button'));

        // Check if element has rounded styling (via Tailwind classes or computed style) and buttons
        let isRounded = cls.includes('rounded') || id.includes('composer') || current.hasAttribute('data-composer-surface');
        if (!isRounded && window.getComputedStyle) {
          try {
            const br = parseInt(window.getComputedStyle(current).borderRadius, 10);
            if (br >= 14) isRounded = true;
          } catch (e) {}
        }

        if (isRounded && hasButtons) {
          capsule = current;
          break;
        }
        current = current.parentElement;
      }

      // 2. Fallbacks if not found by the walk
      if (!capsule) {
        capsule = input.closest('#composer-background') ||
                  input.closest('[data-composer-surface]') ||
                  input.closest('[data-testid*="composer"]') ||
                  input.closest('form div:has(button):has(#prompt-textarea)') ||
                  input.parentElement;
      }

      if (capsule) {
        // Tag the capsule
        if (!capsule.hasAttribute('data-pc-composer')) {
          capsule.setAttribute('data-pc-composer', 'true');
          capsule.classList.add('pc-composer-capsule');
        }

        // Ensure outer form and parents do NOT paint white
        let p = capsule.parentElement;
        while (p && p !== document.body && p !== document.documentElement) {
          if (p === formEl || (p.classList && (p.classList.contains('stretch') || p.className.includes('w-full')))) {
            p.style.setProperty('background', 'transparent', 'important');
            p.style.setProperty('background-color', 'transparent', 'important');
          }
          p = p.parentElement;
        }

        // Ensure ALL inner container divs inside capsule don't paint solid white
        const innerDivs = capsule.querySelectorAll('div, span');
        innerDivs.forEach((d) => {
          if (d !== capsule && !d.matches('button') && !d.hasAttribute('data-pc-composer')) {
            d.style.setProperty('background', 'transparent', 'important');
            d.style.setProperty('background-color', 'transparent', 'important');
            d.style.setProperty('box-shadow', 'none', 'important');
          }
        });

        // Tag and directly style all buttons and interactive controls inside capsule and form
        const buttons = capsule.querySelectorAll('button, [role="button"]');
        buttons.forEach((btn, idx) => {
          const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
          const testid = (btn.getAttribute('data-testid') || '').toLowerCase();
          const txt = (btn.innerText || '').toLowerCase();

          // Reset parent wrappers between button and capsule to transparent
          let par = btn.parentElement;
          while (par && par !== capsule) {
            par.style.setProperty('background', 'transparent', 'important');
            par.style.setProperty('background-color', 'transparent', 'important');
            par.style.setProperty('box-shadow', 'none', 'important');
            par = par.parentElement;
          }

          // Clear any background on internal child nodes inside the button
          btn.querySelectorAll('*').forEach((el) => {
            el.style.setProperty('background', 'transparent', 'important');
            el.style.setProperty('background-color', 'transparent', 'important');
            el.style.setProperty('color', 'inherit', 'important');
          });

          // Style according to button type
          const isReasoningBtn = aria.includes('think') || testid.includes('think') || txt.includes('think') || aria.includes('reason') || Boolean(btn.querySelector('span')) || Boolean(btn.innerText && btn.innerText.trim().length > 0);

          if (isReasoningBtn && !aria.includes('send') && !testid.includes('send')) {
            btn.setAttribute('data-pc-btn', 'think');
            btn.style.setProperty('width', 'auto', 'important');
            btn.style.setProperty('min-width', 'fit-content', 'important');
            btn.style.setProperty('max-width', 'none', 'important');
            btn.style.setProperty('height', '36px', 'important');
            btn.style.setProperty('padding', '0 12px 0 10px', 'important');
            btn.style.setProperty('gap', '7px', 'important');
            btn.style.setProperty('display', 'inline-flex', 'important');
            btn.style.setProperty('align-items', 'center', 'important');
            btn.style.setProperty('justify-content', 'center', 'important');
            btn.style.setProperty('background', 'rgba(255, 255, 255, 0.09)', 'important');
            btn.style.setProperty('background-color', 'rgba(255, 255, 255, 0.09)', 'important');
            btn.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.18)', 'important');
            btn.style.setProperty('border-radius', '9999px', 'important');
            btn.style.setProperty('color', '#F8FAFC', 'important');
            btn.style.setProperty('box-shadow', '0 2px 8px rgba(0, 0, 0, 0.25)', 'important');
          } else if (aria.includes('send') || testid.includes('send')) {
            btn.setAttribute('data-pc-btn', 'send');
            btn.style.setProperty('width', '36px', 'important');
            btn.style.setProperty('height', '36px', 'important');
            btn.style.setProperty('border-radius', '50%', 'important');
            btn.style.setProperty('border', 'none', 'important');
            btn.style.setProperty('color', '#FFFFFF', 'important');
          } else if (idx === 0 || aria.includes('attach') || aria.includes('upload') || aria.includes('add') || aria.includes('file') || aria.includes('tool') || aria.includes('more') || testid.includes('attach')) {
            btn.setAttribute('data-pc-btn', 'attach');
            btn.style.setProperty('width', '36px', 'important');
            btn.style.setProperty('height', '36px', 'important');
            btn.style.setProperty('background', 'rgba(255, 255, 255, 0.08)', 'important');
            btn.style.setProperty('background-color', 'rgba(255, 255, 255, 0.08)', 'important');
            btn.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.15)', 'important');
            btn.style.setProperty('border-radius', '50%', 'important');
            btn.style.setProperty('color', '#F8FAFC', 'important');
            btn.style.setProperty('box-shadow', '0 2px 8px rgba(0, 0, 0, 0.25)', 'important');
          } else {
            // Voice, dictation, microphone, or any other trailing circular action buttons
            btn.setAttribute('data-pc-btn', 'voice');
            btn.style.setProperty('width', '36px', 'important');
            btn.style.setProperty('height', '36px', 'important');
            btn.style.setProperty('background', 'rgba(255, 255, 255, 0.06)', 'important');
            btn.style.setProperty('background-color', 'rgba(255, 255, 255, 0.06)', 'important');
            btn.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.12)', 'important');
            btn.style.setProperty('border-radius', '50%', 'important');
            btn.style.setProperty('color', '#CBD5E1', 'important');
            btn.style.setProperty('box-shadow', '0 2px 8px rgba(0, 0, 0, 0.2)', 'important');
          }
        });
      }
    }

    tagComposer();
    try {
      const observer = new MutationObserver(() => tagComposer());
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
    window.PCThemeEngine?.applyCSSVars(theme, state.settings.themeEnabled, globalWp);
    window.PCThemeEngine?.applyPageTheme(theme, PLATFORM, state.settings.themeEnabled, globalWp);
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
