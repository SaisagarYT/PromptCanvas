// PromptCanvas Options Page Script
// Theme: Tokyo Duo & Active Color Studio

const THEME_PREVIEWS = {
  amberDuo: { bg: '#FFFBF5', bar1: '#283845', bar2: '#151E25', border: 'rgba(40, 56, 69, 0.2)' },
  slateDuo: { bg: '#283845', bar1: '#FFA649', bar2: '#FFA649', border: 'rgba(255, 166, 73, 0.3)' },
  contrastDuo: { bg: '#FFFBF5', bar1: '#151E25', bar2: '#283845', border: '#283845' },
};

const FALLBACK_THEMES = {
  amberDuo: {
    id: 'amberDuo',
    name: 'Tokyo Amber',
    description: 'Ultra-light #FFFBF5 linen canvas with Slate Navy #283845 elements',
    colors: { text: '#151E25', textMuted: 'rgba(40, 56, 69, 0.70)' }
  },
  slateDuo: {
    id: 'slateDuo',
    name: 'Tokyo Slate',
    description: 'Deep Slate Navy #283845 canvas with Golden Amber #FFA649 accents',
    colors: { text: '#FFA649', textMuted: 'rgba(255, 166, 73, 0.70)' }
  },
  contrastDuo: {
    id: 'contrastDuo',
    name: 'Tokyo Dual',
    description: 'High-contrast Slate borders & deep accents on warm linen',
    colors: { text: '#151E25', textMuted: 'rgba(40, 56, 69, 0.70)' }
  }
};

// Curated Designer Presets (based on UI Color Palette reference)
const DESIGNER_PRESETS = [
  {
    id: 'tokyoDuo',
    num: '00',
    name: 'Tokyo Duo',
    desc: 'Flagship · Warm & Architectural',
    canvas: '#FFFBF5',
    controls: '#283845',
    text: '#151E25',
    accent: '#FFA649',
    swatches: ['#283845', '#151E25', '#FFA649', '#FFE8D1', '#FFFBF5'],
  },
  {
    id: 'sunsetVibes',
    num: '04',
    name: 'Sunset Vibes',
    desc: 'Warm · Energetic · Friendly',
    canvas: '#FFF7ED',
    controls: '#F97316',
    text: '#7C2D12',
    accent: '#FB923C',
    swatches: ['#F97316', '#FB923C', '#FDBA74', '#FFF7ED', '#7C2D12'],
  },
  {
    id: 'oceanBreeze',
    num: '02',
    name: 'Ocean Breeze',
    desc: 'Calm · Fresh · Trustworthy',
    canvas: '#E0F2FE',
    controls: '#0EA5E9',
    text: '#0F172A',
    accent: '#38BDF8',
    swatches: ['#0EA5E9', '#38BDF8', '#BAE6FD', '#E0F2FE', '#0F172A'],
  },
  {
    id: 'natureGreen',
    num: '03',
    name: 'Nature Green',
    desc: 'Natural · Balanced · Calm',
    canvas: '#F0FDF4',
    controls: '#16A34A',
    text: '#14532D',
    accent: '#4ADE80',
    swatches: ['#16A34A', '#4ADE80', '#BBF7D0', '#F0FDF4', '#14532D'],
  },
  {
    id: 'modernPurple',
    num: '01',
    name: 'Modern Purple',
    desc: 'Creative · Modern · Premium',
    canvas: '#F5F3FF',
    controls: '#6D28D9',
    text: '#1F2937',
    accent: '#8B5CF6',
    swatches: ['#6D28D9', '#8B5CF6', '#C4B5FD', '#F5F3FF', '#1F2937'],
  },
  {
    id: 'deepBlue',
    num: '06',
    name: 'Deep Blue',
    desc: 'Professional · Strong · Reliable',
    canvas: '#EFF6FF',
    controls: '#1E3A8A',
    text: '#0B1220',
    accent: '#2563EB',
    swatches: ['#1E3A8A', '#2563EB', '#93C5FD', '#EFF6FF', '#0B1220'],
  },
  {
    id: 'tealHarmony',
    num: '08',
    name: 'Teal Harmony',
    desc: 'Modern · Clean · Balanced',
    canvas: '#ECFEFF',
    controls: '#14B8A6',
    text: '#134E4A',
    accent: '#2DD4BF',
    swatches: ['#14B8A6', '#2DD4BF', '#99F6E4', '#ECFEFF', '#134E4A'],
  },
  {
    id: 'blushPink',
    num: '05',
    name: 'Blush Pink',
    desc: 'Soft · Feminine · Elegant',
    canvas: '#FDF2F8',
    controls: '#EC4899',
    text: '#831843',
    accent: '#F472B6',
    swatches: ['#EC4899', '#F472B6', '#FBCFE8', '#FDF2F8', '#831843'],
  },
  {
    id: 'brightYellow',
    num: '07',
    name: 'Bright Yellow',
    desc: 'Cheerful · Optimistic · Bold',
    canvas: '#FFFBEB',
    controls: '#EAB308',
    text: '#713F12',
    accent: '#FACC15',
    swatches: ['#EAB308', '#FACC15', '#FDE68A', '#FFFBEB', '#713F12'],
  },
  {
    id: 'royalDark',
    num: '09',
    name: 'Royal Dark',
    desc: 'Luxury · Elegant · Sophisticated',
    canvas: '#EDE9FE',
    controls: '#4C1D95',
    text: '#111827',
    accent: '#6D28D9',
    swatches: ['#4C1D95', '#6D28D9', '#A78BFA', '#EDE9FE', '#111827'],
  },
  {
    id: 'minimalNeutral',
    num: '10',
    name: 'Minimal Neutral',
    desc: 'Clean · Simple · Timeless',
    canvas: '#F3F4F6',
    controls: '#374151',
    text: '#111827',
    accent: '#6B7280',
    swatches: ['#374151', '#6B7280', '#D1D5DB', '#F3F4F6', '#111827'],
  },
];

let storageData = {};

async function init() {
  storageData = await new Promise(resolve => chrome.storage.local.get(['themes', 'prompts', 'settings', 'uiPalette'], resolve));

  if (storageData.uiPalette) {
    applyRootStyles(storageData.uiPalette);
  }

  renderThemeGrid();
  renderPromptTable();
  loadSettings();
  setupNavigation();
  setupPromptForm();
  setupSettingsActions();
  initColorStudio();
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
}

function renderThemeGrid() {
  const grid = document.getElementById('options-theme-grid');
  if (!grid) return;
  const themes = (storageData.themes && Object.keys(storageData.themes).length) ? storageData.themes : FALLBACK_THEMES;
  const settings = storageData.settings || {};
  const activeId = settings.activeTheme || 'amberDuo';

  grid.innerHTML = Object.values(themes).map(theme => {
    const prev = THEME_PREVIEWS[theme.id] || { bg: '#FFFBF5', bar1: '#283845', bar2: '#151E25', border: 'rgba(40, 56, 69, 0.2)' };
    const textColor = theme.id === 'slateDuo' ? '#FFA649' : '#151E25';
    const textMutedColor = theme.id === 'slateDuo' ? 'rgba(255, 166, 73, 0.70)' : 'rgba(40, 56, 69, 0.70)';
    const name = FALLBACK_THEMES[theme.id]?.name || theme.name;
    const desc = FALLBACK_THEMES[theme.id]?.description || theme.description;
    return `
      <div class="theme-card-full ${activeId === theme.id ? 'selected' : ''}" data-theme-id="${theme.id}" style="background:${prev.bg};border-color:${prev.border};">
        <div class="theme-selected-badge">ACTIVE</div>
        <div class="theme-preview-full" style="background:${prev.bg};border:1px solid ${prev.border};">
          <div class="theme-preview-msg" style="background:${prev.bar1};"></div>
          <div class="theme-preview-msg short" style="background:${prev.bar2};"></div>
          <div class="theme-preview-msg" style="background:${prev.bar1};opacity:0.6;width:80%;"></div>
        </div>
        <div class="theme-name-full" style="color:${textColor};">${name}</div>
        <div class="theme-desc-full" style="color:${textMutedColor};">${desc}</div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.theme-card-full').forEach(card => {
    card.addEventListener('click', async () => {
      const themeId = card.dataset.themeId;
      const settings = storageData.settings || {};
      settings.activeTheme = themeId;
      storageData.settings = settings;
      await chrome.storage.local.set({ settings });
      document.querySelectorAll('.theme-card-full').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      showToast('Theme preset applied');
    });
  });
}

function renderPromptTable() {
  const tbody = document.getElementById('options-prompt-body');
  if (!tbody) return;
  const prompts = storageData.prompts || [];

  if (prompts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--color-dark-muted);padding:36px;font-size:13px;">Prompt library is empty. <a href="#" style="color:var(--color-dark);text-decoration:underline;font-weight:700;margin-left:6px;" id="link-to-add">Add template →</a></td></tr>`;
    document.getElementById('link-to-add')?.addEventListener('click', (e) => { e.preventDefault(); document.querySelector('[data-panel="new-prompt"]')?.click(); });
    return;
  }

  tbody.innerHTML = prompts.map(p => `
    <tr>
      <td style="font-weight:700;color:var(--color-darker);">${escapeHtml(p.title)}</td>
      <td><span class="prompt-tag-full">${escapeHtml(p.category || 'General')}</span></td>
      <td style="max-width:340px;color:var(--color-dark-muted);font-size:12px;line-height:1.5;">${escapeHtml(p.text.substring(0, 95))}${p.text.length > 95 ? '…' : ''}</td>
      <td style="text-align:right;">
        <button class="btn-icon" data-delete="${p.id}" title="Delete template">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </td>
    </tr>`).join('');

  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      storageData.prompts = (storageData.prompts || []).filter(p => p.id !== btn.dataset.delete);
      await chrome.storage.local.set({ prompts: storageData.prompts });
      renderPromptTable();
      showToast('Prompt template deleted');
    });
  });
}

function setupPromptForm() {
  document.getElementById('btn-save-prompt')?.addEventListener('click', async () => {
    const title = document.getElementById('new-title')?.value.trim();
    const category = document.getElementById('new-category')?.value.trim();
    const text = document.getElementById('new-text')?.value.trim();
    if (!title || !text) { showToast('Title and prompt required'); return; }
    const newPrompt = { id: `p_${Date.now()}`, title, category: category || 'General', text, tags: [category?.toLowerCase() || 'general'] };
    storageData.prompts = [newPrompt, ...(storageData.prompts || [])];
    await chrome.storage.local.set({ prompts: storageData.prompts });
    document.getElementById('new-title').value = '';
    document.getElementById('new-category').value = '';
    document.getElementById('new-text').value = '';
    renderPromptTable();
    showToast('Prompt template saved');
    document.querySelector('[data-panel="prompts"]')?.click();
  });

  document.getElementById('btn-clear-form')?.addEventListener('click', () => {
    ['new-title', 'new-category', 'new-text'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  });
}

function loadSettings() {
  const settings = storageData.settings || {};
  const t = document.getElementById('opt-theme-enabled'); if (t) t.checked = settings.themeEnabled !== false;
  const p = document.getElementById('opt-prompts-enabled'); if (p) p.checked = settings.promptsEnabled !== false;
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
    a.href = url; a.download = `promptcanvas-tokyo-backup-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('Configuration exported');
  });

  document.getElementById('btn-import')?.addEventListener('click', () => document.getElementById('file-import')?.click());

  document.getElementById('file-import')?.addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      await chrome.storage.local.set(data);
      storageData = data;
      renderThemeGrid(); renderPromptTable(); loadSettings();
      if (storageData.uiPalette) applyRootStyles(storageData.uiPalette);
      showToast('Configuration restored');
    } catch (err) { showToast('Invalid JSON file'); }
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

// ===== ACTIVE COLOR STUDIO IMPLEMENTATION =====
let currentStudioPalette = {
  canvas: '#FFFBF5',
  controls: '#283845',
  text: '#151E25',
  accent: '#FFA649',
};

function initColorStudio() {
  const initial = storageData.uiPalette || DESIGNER_PRESETS[0];
  currentStudioPalette = {
    canvas: initial.canvas || '#FFFBF5',
    controls: initial.controls || '#283845',
    text: initial.text || '#151E25',
    accent: initial.accent || '#FFA649',
  };

  renderStudioPresets();
  syncInputsWithPalette(currentStudioPalette);
  updateLiveMockPreview();
  setupStudioEvents();
}

function renderStudioPresets() {
  const container = document.getElementById('designer-presets-grid');
  if (!container) return;

  container.innerHTML = DESIGNER_PRESETS.map((p, idx) => `
    <div class="preset-chip-card ${idx === 0 ? 'active' : ''}" data-preset-id="${p.id}">
      <div class="preset-header">
        <span class="preset-name">${p.name}</span>
        <span class="preset-num">${p.num}</span>
      </div>
      <div class="preset-swatches">
        ${p.swatches.map(hex => `<span class="preset-swatch" style="background:${hex};"></span>`).join('')}
      </div>
      <span class="preset-desc">${p.desc}</span>
    </div>`).join('');

  container.querySelectorAll('.preset-chip-card').forEach(card => {
    card.addEventListener('click', () => {
      const preset = DESIGNER_PRESETS.find(p => p.id === card.dataset.presetId);
      if (!preset) return;

      container.querySelectorAll('.preset-chip-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      currentStudioPalette = {
        canvas: preset.canvas,
        controls: preset.controls,
        text: preset.text,
        accent: preset.accent,
      };

      syncInputsWithPalette(currentStudioPalette);
      updateLiveMockPreview();
    });
  });
}

function syncInputsWithPalette(p) {
  setPairValue('canvas', p.canvas);
  setPairValue('controls', p.controls);
  setPairValue('text', p.text);
  setPairValue('accent', p.accent);
}

function setPairValue(key, hex) {
  const picker = document.getElementById(`picker-${key}`);
  const input = document.getElementById(`hex-${key}`);
  if (picker) picker.value = hex;
  if (input) input.value = hex.toUpperCase();
}

function setupStudioEvents() {
  ['canvas', 'controls', 'text', 'accent'].forEach(key => {
    const picker = document.getElementById(`picker-${key}`);
    const hexInput = document.getElementById(`hex-${key}`);

    picker?.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase();
      if (hexInput) hexInput.value = val;
      currentStudioPalette[key] = val;
      updateLiveMockPreview();
    });

    hexInput?.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        if (picker) picker.value = val;
        currentStudioPalette[key] = val;
        updateLiveMockPreview();
      }
    });
  });

  // Apply to Extension UI
  document.getElementById('btn-apply-ui-palette')?.addEventListener('click', async () => {
    await chrome.storage.local.set({ uiPalette: currentStudioPalette });
    storageData.uiPalette = currentStudioPalette;
    applyRootStyles(currentStudioPalette);
    showToast('Extension UI palette applied!');
  });

  // Reset to Tokyo Duo
  document.getElementById('btn-reset-studio')?.addEventListener('click', () => {
    const tokyo = DESIGNER_PRESETS[0];
    currentStudioPalette = {
      canvas: tokyo.canvas,
      controls: tokyo.controls,
      text: tokyo.text,
      accent: tokyo.accent,
    };
    syncInputsWithPalette(currentStudioPalette);
    updateLiveMockPreview();
    document.querySelectorAll('.preset-chip-card').forEach((c, idx) => {
      c.classList.toggle('active', idx === 0);
    });
  });
}

function updateLiveMockPreview() {
  const mock = document.getElementById('studio-mock-popup');
  if (!mock) return;

  mock.style.setProperty('--prev-canvas', currentStudioPalette.canvas);
  mock.style.setProperty('--prev-controls', currentStudioPalette.controls);
  mock.style.setProperty('--prev-text', currentStudioPalette.text);
  mock.style.setProperty('--prev-accent', currentStudioPalette.accent);

  // Update contrast badge
  const ratio = getContrastRatio(currentStudioPalette.canvas, currentStudioPalette.text);
  const ratioVal = document.getElementById('contrast-ratio-val');
  const ratioBadge = document.getElementById('contrast-ratio-badge');
  if (ratioVal && ratioBadge) {
    ratioVal.textContent = `${ratio.toFixed(1)}:1`;
    if (ratio >= 7.0) {
      ratioBadge.innerHTML = `<span>${ratio.toFixed(1)}:1</span> <span>· WCAG AAA</span>`;
      ratioBadge.style.background = '#16A34A';
    } else if (ratio >= 4.5) {
      ratioBadge.innerHTML = `<span>${ratio.toFixed(1)}:1</span> <span>· WCAG AA</span>`;
      ratioBadge.style.background = '#2563EB';
    } else {
      ratioBadge.innerHTML = `<span>${ratio.toFixed(1)}:1</span> <span>· LOW CONTRAST</span>`;
      ratioBadge.style.background = '#DC2626';
    }
  }
}

function applyRootStyles(p) {
  if (!p) return;
  const root = document.documentElement;
  if (p.canvas) root.style.setProperty('--color-light', p.canvas);
  if (p.controls) root.style.setProperty('--color-dark', p.controls);
  if (p.text) root.style.setProperty('--color-darker', p.text);
  if (p.accent) root.style.setProperty('--color-amber', p.accent);

  const rgb = hexToRgb(p.controls);
  if (rgb) {
    root.style.setProperty('--color-dark-subtle', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
    root.style.setProperty('--color-border', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);
    root.style.setProperty('--color-border-strong', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`);
    root.style.setProperty('--color-dark-muted', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.70)`);
  }
}

// ===== COLOR MATH HELPERS =====
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1) || { r: 255, g: 255, b: 255 };
  const rgb2 = hexToRgb(hex2) || { r: 0, g: 0, b: 0 };
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

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

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

document.addEventListener('DOMContentLoaded', init);
