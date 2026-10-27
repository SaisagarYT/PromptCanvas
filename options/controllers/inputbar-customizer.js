// PromptCanvas Options - ChatGPT Input Bar (Composer) Customizer Controller

(function (root) {
  'use strict';

function initInputBarCustomizer() {
  const settings = storageData.settings || {};
  const ib = settings.inputBarStyle || {
    backgroundMode: 'transparent',
    borderAccent: true,
    actionButtonsMode: 'accent',
    toolPillsMode: 'accent',
    glassBlur: 16,
  };

  const bgControl = document.getElementById('inputbar-bg-mode-control');
  const blurRow = document.getElementById('row-inputbar-blur');
  const blurSlider = document.getElementById('opt-inputbar-blur');
  const valBlur = document.getElementById('val-inputbar-blur');
  const borderToggle = document.getElementById('opt-inputbar-border-accent');
  const actionToggle = document.getElementById('opt-inputbar-action-accent');
  const toolToggle = document.getElementById('opt-inputbar-tool-accent');
  const resetBtn = document.getElementById('btn-reset-inputbar-customizer');

  // Active theme swatches badge
  function updateHarmonyBadge() {
    const activeId = storageData.settings?.activeTheme || 'orchidNoir';
    const themes = (storageData.themes && Object.keys(storageData.themes).length) ? storageData.themes : DEFAULT_THEMES;
    const theme = themes[activeId] || DEFAULT_THEMES[activeId] || Object.values(DEFAULT_THEMES)[0];
    const swatches = theme.colors?.swatches || ['#141016', '#EF4444', '#F59E0B', '#F8FAFC'];

    const themeNameEl = document.getElementById('inputbar-active-theme-name');
    const swatchesEl = document.getElementById('inputbar-harmony-swatches');
    if (themeNameEl) themeNameEl.textContent = theme.name || activeId;
    if (swatchesEl) {
      const labels = ['Base Canvas', 'Primary Accent', 'Tools Accent', 'Text Contrast'];
      swatchesEl.innerHTML = swatches.map((hex, i) => `
        <div class="harmony-swatch-chip" title="${labels[i]}: ${hex}">
          <span class="harmony-dot" style="background-color: ${hex};"></span>
          <span><b>${labels[i]}</b> (${hex})</span>
        </div>
      `).join('');
    }
  }

  window.updateInputBarMockup = updateInputBarMockup;
  function updateInputBarMockup() {
    updateHarmonyBadge();
    const activeId = storageData.settings?.activeTheme || 'orchidNoir';
    const themes = (storageData.themes && Object.keys(storageData.themes).length) ? storageData.themes : DEFAULT_THEMES;
    const theme = themes[activeId] || DEFAULT_THEMES[activeId] || Object.values(DEFAULT_THEMES)[0];
    const swatches = theme.colors?.swatches || ['#141016', '#EF4444', '#F59E0B', '#F8FAFC'];
    const [c1, c2, c3, c4] = swatches;

    const wp = storageData.settings?.wallpaper || {};
    let bgUrl = '';
    if (wp.type === 'custom_upload' && wp.dataUrl) bgUrl = wp.dataUrl;
    else if (wp.presetId && wp.presetId !== 'none') {
      const p = WALLPAPER_PRESETS.find(item => item.id === wp.presetId);
      if (p && p.path) bgUrl = p.path;
    } else if (wp.url) bgUrl = wp.url;

    const frame = document.getElementById('mockup-inputbar-frame');
    if (frame) {
      if (bgUrl) {
        frame.style.backgroundImage = `url("${bgUrl}")`;
      } else {
        frame.style.backgroundImage = 'none';
        frame.style.backgroundColor = '#111827';
      }
    }

    const composerBox = document.getElementById('mockup-composer-box');
    const attachBtn = document.getElementById('mock-ib-attach');
    const placeholder = document.getElementById('mock-ib-placeholder');
    const thinkPill = document.getElementById('mock-ib-think');
    const voiceBtn = document.getElementById('mock-ib-voice');
    const sendBtn = document.getElementById('mock-ib-send');

    const isSolid = ib.backgroundMode === 'solid';
    const blur = typeof ib.glassBlur !== 'undefined' ? ib.glassBlur : 16;

    if (composerBox) {
      if (isSolid) {
        composerBox.style.background = c1;
        composerBox.style.backdropFilter = 'none';
        composerBox.style.webkitBackdropFilter = 'none';
      } else {
        composerBox.style.background = hexToRgba(c1, 0.40);
        composerBox.style.backdropFilter = `blur(${blur}px) saturate(140%)`;
        composerBox.style.webkitBackdropFilter = `blur(${blur}px) saturate(140%)`;
      }

      if (ib.borderAccent !== false) {
        composerBox.style.border = `1px solid ${hexToRgba(c2, 0.40)}`;
        composerBox.style.boxShadow = `0 10px 40px rgba(0, 0, 0, 0.65), 0 0 20px ${hexToRgba(c2, 0.20)}`;
      } else {
        composerBox.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        composerBox.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.65)';
      }
    }

    if (placeholder) {
      placeholder.style.color = c4;
    }

    if (sendBtn) {
      sendBtn.style.background = `linear-gradient(135deg, ${c2}, ${c3})`;
      sendBtn.style.boxShadow = `0 0 16px ${hexToRgba(c2, 0.4)}`;
    }

    if (voiceBtn) {
      if (ib.actionButtonsMode !== 'default') {
        voiceBtn.style.background = hexToRgba(c2, 0.22);
        voiceBtn.style.color = c2;
        voiceBtn.style.border = `1px solid ${hexToRgba(c2, 0.35)}`;
      } else {
        voiceBtn.style.background = 'rgba(255, 255, 255, 0.08)';
        voiceBtn.style.color = '#CBD5E1';
        voiceBtn.style.border = '1px solid rgba(255, 255, 255, 0.12)';
      }
    }

    if (attachBtn) {
      if (ib.toolPillsMode !== 'default') {
        attachBtn.style.background = hexToRgba(c3, 0.18);
        attachBtn.style.color = c3;
        attachBtn.style.border = `1px solid ${hexToRgba(c3, 0.35)}`;
      } else {
        attachBtn.style.background = 'rgba(255, 255, 255, 0.08)';
        attachBtn.style.color = '#F8FAFC';
        attachBtn.style.border = '1px solid rgba(255, 255, 255, 0.15)';
      }
    }

    if (thinkPill) {
      if (ib.toolPillsMode !== 'default') {
        thinkPill.style.background = hexToRgba(c3, 0.18);
        thinkPill.style.color = c3;
        thinkPill.style.border = `1px solid ${hexToRgba(c3, 0.35)}`;
      } else {
        thinkPill.style.background = 'rgba(255, 255, 255, 0.09)';
        thinkPill.style.color = '#F8FAFC';
        thinkPill.style.border = '1px solid rgba(255, 255, 255, 0.15)';
      }
    }
  }

  window.updateInputBarMockup = updateInputBarMockup;

  // Initial Control States
  if (bgControl) {
    bgControl.querySelectorAll('.segmented-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === (ib.backgroundMode || 'transparent'));
      btn.addEventListener('click', async () => {
        bgControl.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        ib.backgroundMode = btn.dataset.mode;
        if (blurRow) blurRow.style.opacity = ib.backgroundMode === 'solid' ? '0.4' : '1';
        await saveInputBarStyle();
        updateInputBarMockup();
        showToast(`Composer style: ${ib.backgroundMode === 'solid' ? 'Solid Theme Color' : 'Frosted Glass'}`);
      });
    });
  }

  if (blurSlider && valBlur) {
    blurSlider.value = typeof ib.glassBlur !== 'undefined' ? ib.glassBlur : 16;
    valBlur.textContent = `${blurSlider.value}px`;
    blurSlider.addEventListener('input', (e) => {
      valBlur.textContent = `${e.target.value}px`;
      ib.glassBlur = parseInt(e.target.value, 10);
      updateInputBarMockup();
    });
    blurSlider.addEventListener('change', saveInputBarStyle);
  }

  if (borderToggle) {
    borderToggle.checked = ib.borderAccent !== false;
    borderToggle.addEventListener('change', async (e) => {
      ib.borderAccent = e.target.checked;
      await saveInputBarStyle();
      updateInputBarMockup();
      showToast(ib.borderAccent ? 'Composer accent glow enabled' : 'Composer accent glow hidden');
    });
  }

  if (actionToggle) {
    actionToggle.checked = ib.actionButtonsMode !== 'default';
    actionToggle.addEventListener('change', async (e) => {
      ib.actionButtonsMode = e.target.checked ? 'accent' : 'default';
      await saveInputBarStyle();
      updateInputBarMockup();
      showToast(e.target.checked ? 'Action buttons in primary accent (c2)' : 'Action buttons default');
    });
  }

  if (toolToggle) {
    toolToggle.checked = ib.toolPillsMode !== 'default';
    toolToggle.addEventListener('change', async (e) => {
      ib.toolPillsMode = e.target.checked ? 'accent' : 'default';
      await saveInputBarStyle();
      updateInputBarMockup();
      showToast(e.target.checked ? 'Tool pills in secondary accent (c3)' : 'Tool pills default');
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      ib.backgroundMode = 'transparent';
      ib.glassBlur = 16;
      ib.borderAccent = true;
      ib.actionButtonsMode = 'accent';
      ib.toolPillsMode = 'accent';

      if (bgControl) {
        bgControl.querySelectorAll('.segmented-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'transparent'));
      }
      if (blurSlider) blurSlider.value = 16;
      if (valBlur) valBlur.textContent = '16px';
      if (borderToggle) borderToggle.checked = true;
      if (actionToggle) actionToggle.checked = true;
      if (toolToggle) toolToggle.checked = true;
      if (blurRow) blurRow.style.opacity = '1';

      await saveInputBarStyle();
      updateInputBarMockup();
      showToast('Input bar controls reset to defaults');
    });
  }

  async function saveInputBarStyle() {
    const s = storageData.settings || {};
    s.inputBarStyle = ib;
    storageData.settings = s;
    await chrome.storage.local.set({ settings: s });
  }

  updateInputBarMockup();
}


  root.PCOptionsInputBarCustomizer = {
    init: initInputBarCustomizer
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
