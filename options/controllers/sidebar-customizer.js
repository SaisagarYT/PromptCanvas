// PromptCanvas Options - ChatGPT Sidebar Customizer Controller

(function (root) {
  'use strict';

function initSidebarCustomizer() {
  const settings = storageData.settings || {};
  const sb = settings.sidebarStyle || {
    backgroundMode: 'transparent',
    glassBlur: 24,
    borderEnabled: true,
    accentHeaders: true,
    textColorMode: 'theme_harmony',
  };

  const bgControl = document.getElementById('sidebar-bg-mode-control');
  const blurRow = document.getElementById('row-sidebar-blur');
  const blurSlider = document.getElementById('opt-sidebar-blur');
  const valBlur = document.getElementById('val-sidebar-blur');
  const borderToggle = document.getElementById('opt-sidebar-border');
  const headersToggle = document.getElementById('opt-sidebar-accent-headers');
  const textControl = document.getElementById('sidebar-text-mode-control');
  const resetBtn = document.getElementById('btn-reset-sidebar-customizer');

  // Active theme swatches badge
  function updateHarmonyBadge() {
    const activeId = storageData.settings?.activeTheme || 'orchidNoir';
    const themes = (storageData.themes && Object.keys(storageData.themes).length) ? storageData.themes : DEFAULT_THEMES;
    const theme = themes[activeId] || DEFAULT_THEMES[activeId] || Object.values(DEFAULT_THEMES)[0];
    const swatches = theme.colors?.swatches || ['#141016', '#EF4444', '#F59E0B', '#F8FAFC'];

    const themeNameEl = document.getElementById('sidebar-active-theme-name');
    const swatchesEl = document.getElementById('sidebar-harmony-swatches');
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

  window.updateSidebarMockup = updateSidebarMockup;
  function updateSidebarMockup() {
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

    const frame = document.getElementById('mockup-sidebar-frame');
    if (frame) {
      if (bgUrl) {
        frame.style.backgroundImage = `url("${bgUrl}")`;
      } else {
        frame.style.backgroundImage = 'none';
        frame.style.backgroundColor = '#111827';
      }
    }

    const sbBox = document.getElementById('mockup-sidebar-box');
    const newChatBtn = document.getElementById('mock-sb-new-chat');
    const headerEl = document.getElementById('mock-sb-header');
    const chatActive = document.getElementById('mock-sb-chat-active');
    const chatHover = document.getElementById('mock-sb-chat-hover');
    const chatNormal = document.getElementById('mock-sb-chat-normal');

    const isSolid = sb.backgroundMode === 'solid';
    const blur = typeof sb.glassBlur !== 'undefined' ? sb.glassBlur : 24;

    if (sbBox) {
      if (isSolid) {
        sbBox.style.background = c1;
        sbBox.style.backdropFilter = 'none';
        sbBox.style.webkitBackdropFilter = 'none';
      } else {
        sbBox.style.background = hexToRgba(c1, 0.72);
        sbBox.style.backdropFilter = `blur(${blur}px) saturate(150%)`;
        sbBox.style.webkitBackdropFilter = `blur(${blur}px) saturate(150%)`;
      }
      sbBox.style.borderRight = sb.borderEnabled !== false ? `1px solid ${hexToRgba(c2, 0.28)}` : 'none';
    }

    if (newChatBtn) {
      newChatBtn.style.background = 'rgba(255, 255, 255, 0.08)';
      newChatBtn.style.border = `1px solid ${hexToRgba(c3, 0.25)}`;
      newChatBtn.style.color = '#F8FAFC';
    }

    if (headerEl) {
      headerEl.style.color = sb.accentHeaders !== false ? c3 : c2;
    }

    if (chatActive) {
      chatActive.style.background = hexToRgba(c2, 0.25);
      chatActive.style.color = '#FFFFFF';
      chatActive.style.fontWeight = '600';
      chatActive.style.borderLeft = `3px solid ${c2}`;
    }

    if (chatHover) {
      chatHover.style.background = hexToRgba(c2, 0.15);
      chatHover.style.color = '#FFFFFF';
    }

    if (chatNormal) {
      chatNormal.style.background = 'transparent';
      chatNormal.style.color = '#E2E8F0';
    }
  }

  window.updateSidebarMockup = updateSidebarMockup;

  // Initial Control States
  if (bgControl) {
    bgControl.querySelectorAll('.segmented-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === (sb.backgroundMode || 'transparent'));
      btn.addEventListener('click', async () => {
        bgControl.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sb.backgroundMode = btn.dataset.mode;
        if (blurRow) blurRow.style.opacity = sb.backgroundMode === 'solid' ? '0.4' : '1';
        await saveSidebarStyle();
        updateSidebarMockup();
        showToast(`Sidebar style: ${sb.backgroundMode === 'solid' ? 'Solid Theme Color' : 'Frosted Glass'}`);
      });
    });
  }

  if (blurSlider && valBlur) {
    blurSlider.value = typeof sb.glassBlur !== 'undefined' ? sb.glassBlur : 24;
    valBlur.textContent = `${blurSlider.value}px`;
    blurSlider.addEventListener('input', (e) => {
      valBlur.textContent = `${e.target.value}px`;
      sb.glassBlur = parseInt(e.target.value, 10);
      updateSidebarMockup();
    });
    blurSlider.addEventListener('change', saveSidebarStyle);
  }

  if (borderToggle) {
    borderToggle.checked = sb.borderEnabled !== false;
    borderToggle.addEventListener('change', async (e) => {
      sb.borderEnabled = e.target.checked;
      await saveSidebarStyle();
      updateSidebarMockup();
      showToast(sb.borderEnabled ? 'Sidebar divider border enabled' : 'Sidebar divider border hidden');
    });
  }

  if (headersToggle) {
    headersToggle.checked = sb.accentHeaders !== false;
    headersToggle.addEventListener('change', async (e) => {
      sb.accentHeaders = e.target.checked;
      await saveSidebarStyle();
      updateSidebarMockup();
      showToast(sb.accentHeaders ? 'Sidebar headers in secondary accent (c3)' : 'Sidebar headers in primary accent (c2)');
    });
  }

  if (textControl) {
    textControl.querySelectorAll('.segmented-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === (sb.textColorMode || 'theme_harmony'));
      btn.addEventListener('click', async () => {
        textControl.querySelectorAll('.segmented-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sb.textColorMode = btn.dataset.mode;
        await saveSidebarStyle();
        updateSidebarMockup();
        showToast(`Chat history text: ${sb.textColorMode === 'crisp_white' ? 'Crisp White' : 'Theme Harmony Tint'}`);
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      sb.backgroundMode = 'transparent';
      sb.glassBlur = 24;
      sb.borderEnabled = true;
      sb.accentHeaders = true;
      sb.textColorMode = 'theme_harmony';

      if (bgControl) {
        bgControl.querySelectorAll('.segmented-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'transparent'));
      }
      if (blurSlider) blurSlider.value = 24;
      if (valBlur) valBlur.textContent = '24px';
      if (borderToggle) borderToggle.checked = true;
      if (headersToggle) headersToggle.checked = true;
      if (textControl) {
        textControl.querySelectorAll('.segmented-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === 'theme_harmony'));
      }
      if (blurRow) blurRow.style.opacity = '1';

      await saveSidebarStyle();
      updateSidebarMockup();
      showToast('Sidebar controls reset to defaults');
    });
  }

  async function saveSidebarStyle() {
    const s = storageData.settings || {};
    s.sidebarStyle = sb;
    storageData.settings = s;
    await chrome.storage.local.set({ settings: s });
  }

  updateSidebarMockup();
}


  root.PCOptionsSidebarCustomizer = {
    init: initSidebarCustomizer
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
