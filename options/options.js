// PromptCanvas Options Page - Main Coordinator
// Orchestrates modular tab controllers & global options state

var storageData = {};

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('options-toast');
  const msg = document.getElementById('toast-msg');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

async function init() {
  storageData = await new Promise(resolve => chrome.storage.local.get(['themes', 'prompts', 'settings', 'uiPalette'], resolve));
  window.storageData = storageData;

  if (storageData.uiPalette && window.PCOptionsColorStudio?.applyRootStyles) {
    window.PCOptionsColorStudio.applyRootStyles(storageData.uiPalette);
  }

  // Initialize modular tab controllers
  if (window.PCOptionsThemesTab) {
    window.PCOptionsThemesTab.renderThemeFilterBar();
    window.PCOptionsThemesTab.renderThemeGrid();
    window.PCOptionsThemesTab.initWallpaperStudio();
  }

  if (window.PCOptionsSidebarCustomizer) {
    window.PCOptionsSidebarCustomizer.init();
  }

  if (window.PCOptionsInputBarCustomizer) {
    window.PCOptionsInputBarCustomizer.init();
  }

  if (window.PCOptionsPromptsTab) {
    window.PCOptionsPromptsTab.renderPromptTable();
    window.PCOptionsPromptsTab.setupPromptForm();
  }

  loadSettings();
  setupNavigation();
  setupSettingsActions();

  if (window.PCOptionsColorStudio) {
    window.PCOptionsColorStudio.init();
  }
}

function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const panelId = item.dataset.panel;
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      document.getElementById(`panel-${panelId}`)?.classList.add('active');
    });
  });

  const hash = window.location.hash.replace('#', '');
  const params = new URLSearchParams(window.location.search);
  const target = hash || params.get('panel');
  if (target) {
    const targetNav = document.querySelector(`.nav-item[data-panel="${target}"]`) ||
                      document.querySelector(`.nav-item[data-panel="${target === 'studio' ? 'palette' : target}"]`);
    if (targetNav) targetNav.click();
  }
}

function loadSettings() {
  const settings = storageData.settings || {};
  const t = document.getElementById('opt-theme-enabled');
  if (t) t.checked = settings.themeEnabled !== false;
  const p = document.getElementById('opt-prompts-enabled');
  if (p) p.checked = settings.promptsEnabled !== false;
}

function setupSettingsActions() {
  ['opt-theme-enabled', 'opt-prompts-enabled'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', saveSettings);
  });

  document.getElementById('btn-export')?.addEventListener('click', async () => {
    const data = await new Promise(resolve => chrome.storage.local.get(null, resolve));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptcanvas-tokyo-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Configuration exported');
  });

  document.getElementById('btn-import')?.addEventListener('click', () => {
    document.getElementById('file-import')?.click();
  });

  document.getElementById('file-import')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      await chrome.storage.local.set(data);
      storageData = data;
      window.storageData = storageData;

      if (window.PCOptionsThemesTab) window.PCOptionsThemesTab.renderThemeGrid();
      if (window.PCOptionsPromptsTab) window.PCOptionsPromptsTab.renderPromptTable();
      loadSettings();
      if (storageData.uiPalette && window.PCOptionsColorStudio?.applyRootStyles) {
        window.PCOptionsColorStudio.applyRootStyles(storageData.uiPalette);
      }
      showToast('Configuration restored');
    } catch (err) {
      showToast('Invalid JSON file');
    }
  });

  document.getElementById('btn-reset-all')?.addEventListener('click', async () => {
    if (confirm('Reset all PromptCanvas configurations to Tokyo Duo defaults?')) {
      await chrome.storage.local.clear();
      showToast('Resetting to defaults...');
      setTimeout(() => window.location.reload(), 600);
    }
  });
}

async function saveSettings() {
  const settings = storageData.settings || {};
  settings.themeEnabled = document.getElementById('opt-theme-enabled')?.checked;
  settings.promptsEnabled = document.getElementById('opt-prompts-enabled')?.checked;
  storageData.settings = settings;
  await chrome.storage.local.set({ settings });
  showToast('Settings saved');
}

document.addEventListener('DOMContentLoaded', init);
