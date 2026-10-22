// PromptCanvas Options Page Script
// Theme: Tokyo Duo — Golden Amber (#FFA649) & Slate Navy (#283845)

const THEME_PREVIEWS = {
  amberDuo: { bg: '#FFA649', bar1: '#283845', bar2: '#151E25', border: 'rgba(40, 56, 69, 0.3)' },
  slateDuo: { bg: '#283845', bar1: '#FFA649', bar2: '#FFA649', border: 'rgba(255, 166, 73, 0.3)' },
  contrastDuo: { bg: '#FFA649', bar1: '#151E25', bar2: '#283845', border: '#283845' },
};

let storageData = {};

async function init() {
  storageData = await new Promise(resolve => chrome.storage.local.get(['themes', 'prompts', 'settings'], resolve));
  renderThemeGrid();
  renderPromptTable();
  loadSettings();
  setupNavigation();
  setupPromptForm();
  setupSettingsActions();
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
  const themes = storageData.themes || {};
  const settings = storageData.settings || {};
  const activeId = settings.activeTheme || 'amberDuo';

  grid.innerHTML = Object.values(themes).map(theme => {
    const prev = THEME_PREVIEWS[theme.id] || { bg: '#FFA649', bar1: '#283845', bar2: '#151E25', border: 'rgba(40, 56, 69, 0.3)' };
    return `
      <div class="theme-card-full ${activeId === theme.id ? 'selected' : ''}" data-theme-id="${theme.id}" style="background:${prev.bg};border-color:${prev.border};">
        <div class="theme-selected-badge">ACTIVE</div>
        <div class="theme-preview-full" style="background:${prev.bg};border:1px solid ${prev.border};">
          <div class="theme-preview-msg" style="background:${prev.bar1};"></div>
          <div class="theme-preview-msg short" style="background:${prev.bar2};"></div>
          <div class="theme-preview-msg" style="background:${prev.bar1};opacity:0.6;width:80%;"></div>
        </div>
        <div class="theme-name-full" style="color:${theme.colors.text};">${theme.name}</div>
        <div class="theme-desc-full" style="color:${theme.colors.textMuted};">${theme.description}</div>
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
      showToast('Theme applied');
    });
  });
}

function renderPromptTable() {
  const tbody = document.getElementById('options-prompt-body');
  if (!tbody) return;
  const prompts = storageData.prompts || [];

  if (prompts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:32px;">Prompt library is empty. <a href="#" style="color:var(--primary);text-decoration:none;font-weight:700;" id="link-to-add">Add template →</a></td></tr>`;
    document.getElementById('link-to-add')?.addEventListener('click', (e) => { e.preventDefault(); document.querySelector('[data-panel="new-prompt"]')?.click(); });
    return;
  }

  tbody.innerHTML = prompts.map(p => `
    <tr>
      <td style="font-weight:700;color:var(--text);">${escapeHtml(p.title)}</td>
      <td><span class="prompt-tag-full">${escapeHtml(p.category || 'General')}</span></td>
      <td style="max-width:320px;color:var(--muted);font-size:12px;line-height:1.5;">${escapeHtml(p.text.substring(0, 90))}${p.text.length > 90 ? '…' : ''}</td>
      <td><button class="btn-icon" data-delete="${p.id}">✕</button></td>
    </tr>`).join('');

  tbody.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      storageData.prompts = (storageData.prompts || []).filter(p => p.id !== btn.dataset.delete);
      await chrome.storage.local.set({ prompts: storageData.prompts });
      renderPromptTable();
      updateAboutStats();
      showToast('Prompt deleted');
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
    updateAboutStats();
    showToast('Prompt template saved');
  });

  document.getElementById('btn-clear-form')?.addEventListener('click', () => {
    ['new-title', 'new-category', 'new-text'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  });
}

function loadSettings() {
  const settings = storageData.settings || {};
  const t = document.getElementById('opt-theme-enabled'); if (t) t.checked = settings.themeEnabled !== false;
  const p = document.getElementById('opt-prompts-enabled'); if (p) p.checked = settings.promptsEnabled !== false;
  updateAboutStats();
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
    a.href = url; a.download = `promptcanvas-editorial-backup-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported');
  });

  document.getElementById('btn-import')?.addEventListener('click', () => document.getElementById('file-import')?.click());

  document.getElementById('file-import')?.addEventListener('change', async (e) => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      await chrome.storage.local.set(data);
      storageData = data;
      renderThemeGrid(); renderPromptTable(); loadSettings();
      showToast('Data restored');
    } catch (err) { showToast('Invalid JSON file'); }
  });

  document.getElementById('btn-reset-all')?.addEventListener('click', async () => {
    if (confirm('Reset all PromptCanvas configurations to editorial defaults?')) {
      await chrome.storage.local.clear();
      showToast('Resetting...');
      setTimeout(() => window.location.reload(), 800);
    }
  });
}

async function saveSettings() {
  const settings = storageData.settings || {};
  settings.themeEnabled = document.getElementById('opt-theme-enabled')?.checked;
  settings.promptsEnabled = document.getElementById('opt-prompts-enabled')?.checked;
  storageData.settings = settings;
  await chrome.storage.local.set({ settings });
  showToast('Settings updated');
}

function updateAboutStats() {
  const count = document.getElementById('about-prompt-count');
  if (count) count.textContent = (storageData.prompts || []).length;
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
