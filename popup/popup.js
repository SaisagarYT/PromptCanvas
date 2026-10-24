// PromptCanvas Popup Script
// Theme: Tokyo Duo — Golden Amber (#FFA649) & Slate Navy (#283845)

const SUPPORTED_PLATFORMS = {
  'chatgpt.com': { name: 'ChatGPT', id: 'chatgpt' },
  'chat.openai.com': { name: 'ChatGPT', id: 'chatgpt' },
  'gemini.google.com': { name: 'Gemini', id: 'gemini' },
  'claude.ai': { name: 'Claude', id: 'claude' },
  'chat.deepseek.com': { name: 'DeepSeek', id: 'deepseek' },
};

const THEME_COLORS = {
  ferrariCorse: { dot: '#EF4444', name: 'Ferrari' },
  violetRadiance: { dot: '#A855F7', name: 'Violet' },
  spidermanAction: { dot: '#38BDF8', name: 'Spider-Man' },
  spidermanNight: { dot: '#F43F5E', name: 'Noir' },
  twilightMirage: { dot: '#FB923C', name: 'Mirage' },
};

let currentTabId = null;
let currentPlatform = null;
let storageData = {};

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabId = tab?.id;

  const url = tab?.url || '';
  let hostname = 'unknown';
  try { hostname = new URL(url).hostname; } catch (e) {}

  for (const [key, value] of Object.entries(SUPPORTED_PLATFORMS)) {
    if (hostname.includes(key)) { currentPlatform = value; break; }
  }

  const platformName = document.getElementById('platform-name');
  if (platformName) platformName.textContent = currentPlatform ? currentPlatform.name : 'Standby';

  const platformDot = document.querySelector('.platform-dot-icon');
  if (platformDot) {
    platformDot.innerHTML = currentPlatform
      ? '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'
      : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
  }

  // Always fetch storage regardless of active tab
  storageData = await new Promise(resolve => chrome.storage.local.get(['themes', 'prompts', 'settings', 'uiPalette'], resolve));

  if (storageData.uiPalette) {
    applyUIPalette(storageData.uiPalette);
  }

  // If not on an AI platform, update banner status gracefully
  if (!currentPlatform) {
    const statusText = document.getElementById('status-text');
    const statusSub = document.querySelector('.status-sub');
    const sidebarBtn = document.getElementById('btn-toggle-sidebar');
    const pulseDot = document.querySelector('.status-pulse-dot');
    if (statusText) statusText.textContent = 'Standby';
    if (statusSub) statusSub.textContent = 'AI DETECTOR';
    if (pulseDot) pulseDot.style.opacity = '0.35';
    if (sidebarBtn) {
      sidebarBtn.innerHTML = `<span>OPEN AI</span><svg class="icon-svg icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`;
      sidebarBtn.onclick = () => chrome.tabs.create({ url: 'https://chatgpt.com' });
    }
  }

  updateStats();
  renderThemeChips();
  setupToggles();
  setupActions();
}

function applyUIPalette(p) {
  if (!p) return;
  const root = document.documentElement;
  if (p.canvas) root.style.setProperty('--color-light', p.canvas);
  if (p.controls) root.style.setProperty('--color-dark', p.controls);
  if (p.text) root.style.setProperty('--color-darker', p.text);
  if (p.accent) root.style.setProperty('--color-amber', p.accent);

  const clean = (p.controls || '').replace('#', '');
  if (clean.length === 6) {
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    root.style.setProperty('--color-dark-subtle', `rgba(${r}, ${g}, ${b}, 0.05)`);
    root.style.setProperty('--color-border', `rgba(${r}, ${g}, ${b}, 0.12)`);
    root.style.setProperty('--color-border-strong', `rgba(${r}, ${g}, ${b}, 0.25)`);
    root.style.setProperty('--color-dark-muted', `rgba(${r}, ${g}, ${b}, 0.70)`);
  }
}

function updateStats() {
  const settings = storageData.settings || {};
  const prompts = storageData.prompts || [];
  const themes = storageData.themes || {};
  const activeThemeId = settings.activeTheme || 'ferrariCorse';
  const activeTheme = themes[activeThemeId] || themes['ferrariCorse'] || Object.values(themes)[0];
  const statTheme = document.getElementById('stat-theme');
  const statPrompts = document.getElementById('stat-prompts');
  if (statTheme) statTheme.textContent = activeTheme?.name || 'Corse';
  if (statPrompts) statPrompts.textContent = prompts.length;
}

function renderThemeChips() {
  const container = document.getElementById('theme-chips');
  if (!container) return;
  const settings = storageData.settings || {};
  const activeThemeId = settings.activeTheme || 'ferrariCorse';

  container.innerHTML = Object.entries(THEME_COLORS).map(([id, info]) => `
    <div class="theme-chip ${activeThemeId === id ? 'active' : ''}" data-theme="${id}">
      <div class="theme-chip-dot" style="background:${info.dot};"></div>
      <span class="theme-chip-name">${info.name}</span>
      <span class="theme-chip-check">
        <svg class="icon-svg icon-tiny" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
    </div>`).join('');

  container.querySelectorAll('.theme-chip').forEach(chip => {
    chip.addEventListener('click', async () => {
      const themeId = chip.dataset.theme;
      const settings = storageData.settings || {};
      settings.activeTheme = themeId;
      storageData.settings = settings;
      await chrome.storage.local.set({ settings });
      container.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateStats();
    });
  });
}

function setupToggles() {
  const settings = storageData.settings || {};
  const masterToggle = document.getElementById('master-theme-toggle');
  if (masterToggle) {
    masterToggle.checked = settings.themeEnabled !== false;
    masterToggle.addEventListener('change', async (e) => {
      settings.themeEnabled = e.target.checked;
      storageData.settings = settings;
      await chrome.storage.local.set({ settings });
    });
  }
}

function setupActions() {
  document.getElementById('btn-toggle-sidebar')?.addEventListener('click', async () => {
    if (!currentPlatform) {
      await chrome.tabs.create({ url: 'https://chatgpt.com' });
      return;
    }
    if (!currentTabId) return;
    try {
      await chrome.scripting.executeScript({
        target: { tabId: currentTabId },
        func: () => {
          const root = document.getElementById('promptcanvas-root');
          if (root) root.classList.toggle('pc-open');
        },
      });
    } catch (e) { console.error('PromptCanvas:', e); }
  });

  document.getElementById('btn-open-prompts')?.addEventListener('click', () => openSidebarTab('prompts'));
  document.getElementById('btn-open-themes')?.addEventListener('click', () => openSidebarTab('themes'));
  document.getElementById('btn-open-settings')?.addEventListener('click', () => openSidebarTab('settings'));
  document.getElementById('btn-open-options')?.addEventListener('click', () => chrome.runtime.openOptionsPage());
  document.getElementById('link-options')?.addEventListener('click', (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); });
}

async function openSidebarTab(tabName) {
  if (!currentPlatform) {
    await chrome.tabs.create({ url: 'https://chatgpt.com' });
    window.close();
    return;
  }
  if (!currentTabId) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: currentTabId },
      func: (tab) => {
        const root = document.getElementById('promptcanvas-root');
        if (root) {
          root.classList.add('pc-open');
          const tabBtn = document.querySelector(`.pc-tab[data-tab="${tab}"]`);
          if (tabBtn) tabBtn.click();
        }
      },
      args: [tabName],
    });
    window.close();
  } catch (e) { console.error('PromptCanvas:', e); }
}

document.addEventListener('DOMContentLoaded', init);
