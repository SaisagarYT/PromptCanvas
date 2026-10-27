// PromptCanvas Options - Themes & Wallpapers Tab Controller

(function (root) {
  'use strict';

  let currentThemeCategory = 'all';

function renderThemeFilterBar() {
  const filterBar = document.getElementById('options-theme-filter-bar');
  if (!filterBar) return;

  const themes = (storageData.themes && Object.keys(storageData.themes).length) ? storageData.themes : DEFAULT_THEMES;
  const allThemesList = Object.values(themes);

  const categories = [
    { id: 'all', label: 'All', count: allThemesList.length },
    { id: 'Luxury', label: 'Luxury', count: allThemesList.filter(t => t.category === 'Luxury').length },
    { id: 'Cyber', label: 'Cyber', count: allThemesList.filter(t => t.category === 'Cyber').length },
    { id: 'Vibrant', label: 'Vibrant', count: allThemesList.filter(t => t.category === 'Vibrant').length },
    { id: 'Nature', label: 'Nature', count: allThemesList.filter(t => t.category === 'Nature').length },
    { id: 'Warm', label: 'Warm', count: allThemesList.filter(t => t.category === 'Warm').length },
    { id: 'Cool', label: 'Cool', count: allThemesList.filter(t => t.category === 'Cool').length }
  ];

  filterBar.innerHTML = categories.map(cat => `
    <button class="theme-filter-chip ${currentThemeCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
      <span>${cat.label}</span>
      <span class="chip-count">${cat.count}</span>
    </button>
  `).join('');

  filterBar.querySelectorAll('.theme-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentThemeCategory = chip.dataset.category;
      filterBar.querySelectorAll('.theme-filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderThemeGrid();
    });
  });
}

function renderThemeGrid() {
  const grid = document.getElementById('options-theme-grid');
  if (!grid) return;
  const themes = (storageData.themes && Object.keys(storageData.themes).length) ? storageData.themes : DEFAULT_THEMES;
  const settings = storageData.settings || {};
  const activeId = settings.activeTheme || 'orchidNoir';

  let filtered = Object.values(themes);
  if (currentThemeCategory !== 'all') {
    filtered = filtered.filter(t => t.category === currentThemeCategory);
  }

  grid.innerHTML = filtered.map(theme => {
    const swatches = theme.colors?.swatches || ['#141016', '#EF4444', '#F59E0B', '#F8FAFC'];
    const [c1, c2, c3, c4] = swatches;
    const isSelected = activeId === theme.id;
    const cat = theme.category || 'Luxury';

    return `
      <div class="theme-card-full ${isSelected ? 'selected' : ''}" data-theme-id="${theme.id}">
        <div class="theme-card-header">
          <div class="theme-card-title-group">
            <span class="theme-category-tag">${escapeHtml(cat)}</span>
            <span class="theme-card-name">${escapeHtml(theme.name)}</span>
          </div>
          <div class="theme-selected-badge">ACTIVE</div>
        </div>

        <!-- 4-Stripe Color Palette Harmony Bar with Tooltip Hex Codes -->
        <div class="opt-palette-harmony-bar" title="Palette Swatches">
          ${swatches.map(hex => `<div class="opt-palette-stripe" data-hex="${hex}" style="background-color: ${hex};"></div>`).join('')}
        </div>

        <!-- Live Chat Bubble Preview -->
        <div class="theme-preview-full" style="background: ${c1};">
          <div class="theme-preview-msg" style="background: ${c2}; box-shadow: 0 1px 4px rgba(0,0,0,0.2);"></div>
          <div class="theme-preview-msg short" style="background: ${c3};"></div>
          <div class="theme-preview-msg" style="background: ${c2}; opacity: 0.6; width: 85%;"></div>
        </div>

        <div class="theme-desc-full">${escapeHtml(theme.description || '')}</div>
      </div>`;
  }).join('');

  grid.querySelectorAll('.theme-card-full').forEach(card => {
    card.addEventListener('click', async () => {
      const themeId = card.dataset.themeId;
      const settings = storageData.settings || {};
      settings.activeTheme = themeId;
      storageData.settings = settings;
      await chrome.storage.local.set({ settings });
      grid.querySelectorAll('.theme-card-full').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      showToast('Theme palette activated: ' + (themes[themeId]?.name || themeId));
      window.updateSidebarMockup?.();
      window.updateInputBarMockup?.();
    });
  });
}

function initWallpaperStudio() {
  const wp = storageData.settings?.wallpaper || {
    enabled: true,
    type: 'preset',
    presetId: 'abstract-purple',
    url: '',
    dataUrl: '',
    blur: 0,
    brightness: 85,
    overlayOpacity: 35,
    panelBlur: 14
  };

  const toggle = document.getElementById('opt-wallpaper-enabled');
  const workbench = document.getElementById('wallpaper-workbench');
  const presetsGrid = document.getElementById('wallpaper-presets-grid');

  // Custom upload elements
  const dropzone = document.getElementById('wallpaper-upload-dropzone');
  const fileInput = document.getElementById('opt-wallpaper-file');
  const browseBtn = document.getElementById('btn-browse-wallpaper');
  const customStatus = document.getElementById('custom-wallpaper-status');
  const customThumb = document.getElementById('custom-wallpaper-thumb');
  const customName = document.getElementById('custom-wallpaper-name');
  const removeCustomBtn = document.getElementById('btn-remove-custom-wallpaper');

  // Custom URL elements
  const urlInput = document.getElementById('opt-wallpaper-url');
  const applyUrlBtn = document.getElementById('btn-apply-wallpaper-url');

  // Sliders and controls
  const resetSlidersBtn = document.getElementById('btn-reset-wallpaper-sliders');
  const blurSlider = document.getElementById('opt-wallpaper-blur');
  const brightSlider = document.getElementById('opt-wallpaper-brightness');
  const overlaySlider = document.getElementById('opt-wallpaper-overlay');
  const panelBlurSlider = document.getElementById('opt-wallpaper-panelblur');

  const valBlur = document.getElementById('val-wallpaper-blur');
  const valBright = document.getElementById('val-wallpaper-brightness');
  const valOverlay = document.getElementById('val-wallpaper-overlay');
  const valPanelBlur = document.getElementById('val-wallpaper-panelblur');

  const preview = document.getElementById('wallpaper-live-preview');
  const overlay = document.getElementById('wallpaper-live-overlay');
  const glassCard = document.getElementById('wallpaper-live-glass-card');

  function updateLivePreview() {
    if (!preview) return;
    const isEnabled = toggle ? toggle.checked : true;
    if (workbench) workbench.style.opacity = isEnabled ? '1' : '0.45';

    let bgUrl = '';
    if (wp.type === 'custom_upload' && wp.dataUrl) {
      bgUrl = wp.dataUrl;
    } else if (wp.presetId && wp.presetId !== 'none') {
      const p = WALLPAPER_PRESETS.find(item => item.id === wp.presetId);
      if (p && p.path) bgUrl = p.path;
    } else if (wp.url) {
      bgUrl = wp.url;
    }

    if (bgUrl) {
      preview.style.backgroundImage = `url("${bgUrl}")`;
      preview.style.backgroundColor = '#111827';
    } else {
      preview.style.backgroundImage = 'none';
      preview.style.backgroundColor = '#18181B';
    }

    const blur = blurSlider ? blurSlider.value : (wp.blur || 0);
    const brightness = brightSlider ? brightSlider.value : (wp.brightness || 85);
    preview.style.filter = `blur(${blur}px) brightness(${brightness}%)`;

    const overlayPct = overlaySlider ? overlaySlider.value : (wp.overlayOpacity || 35);
    if (overlay) overlay.style.backgroundColor = `rgba(10, 8, 18, ${overlayPct / 100})`;

    const panelBlur = panelBlurSlider ? panelBlurSlider.value : (wp.panelBlur || 14);
    if (glassCard) {
      glassCard.style.backdropFilter = `blur(${panelBlur}px) saturate(140%)`;
      glassCard.style.webkitBackdropFilter = `blur(${panelBlur}px) saturate(140%)`;
    }
    window.updateSidebarMockup?.();
    window.updateInputBarMockup?.();

    // Sync custom wallpaper status badge
    if (customStatus) {
      if (wp.type === 'custom_upload' && wp.dataUrl) {
        if (customThumb) customThumb.src = wp.dataUrl;
        if (customName) customName.textContent = 'Active Custom Upload';
        customStatus.style.display = 'block';
      } else {
        customStatus.style.display = 'none';
      }
    }
  }

  // Populate presets
  if (presetsGrid) {
    presetsGrid.innerHTML = WALLPAPER_PRESETS.map(preset => {
      const isActive = (wp.type === 'preset' || wp.type === 'none') && wp.presetId === preset.id;
      const bgStyle = preset.path ? `background-image: url('${preset.path}');` : 'background: #27272A; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #A1A1AA; font-weight: 700;';
      return `
        <div class="wallpaper-preset-card ${isActive ? 'active' : ''}" data-preset-id="${preset.id}">
          <div class="wallpaper-preset-thumb" style="${bgStyle}">
            ${preset.id === 'none' ? '<span>NO WALLPAPER</span>' : ''}
          </div>
          <div class="wallpaper-preset-name">${escapeHtml(preset.name)}</div>
        </div>
      `;
    }).join('');

    presetsGrid.querySelectorAll('.wallpaper-preset-card').forEach(card => {
      card.addEventListener('click', async () => {
        const presetId = card.dataset.presetId;
        wp.presetId = presetId;
        wp.type = presetId === 'none' ? 'none' : 'preset';
        wp.dataUrl = '';
        wp.url = '';
        if (urlInput) urlInput.value = '';
        if (customStatus) customStatus.style.display = 'none';

        presetsGrid.querySelectorAll('.wallpaper-preset-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        await saveWallpaperSettings();
        updateLivePreview();
        const pName = WALLPAPER_PRESETS.find(item => item.id === presetId)?.name || presetId;
        showToast('Wallpaper preset activated: ' + pName);
      });
    });
  }

  // Image File Upload Processor
  function processImageFile(file) {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const img = new Image();
      img.onload = async () => {
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

        wp.enabled = true;
        wp.type = 'custom_upload';
        wp.dataUrl = dataUrl;
        wp.presetId = '';
        wp.url = '';

        if (toggle) toggle.checked = true;
        if (urlInput) urlInput.value = '';
        presetsGrid?.querySelectorAll('.wallpaper-preset-card').forEach(c => c.classList.remove('active'));

        if (customStatus) {
          if (customThumb) customThumb.src = dataUrl;
          if (customName) customName.textContent = file.name || 'Custom Uploaded Wallpaper';
          customStatus.style.display = 'block';
        }

        await saveWallpaperSettings();
        updateLivePreview();
        showToast('Custom wallpaper uploaded and applied successfully!');
      };
      img.src = loadEvt.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Browse & Dropzone Events
  browseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput?.click();
  });

  if (dropzone) {
    dropzone.addEventListener('click', (e) => {
      if (e.target !== browseBtn) {
        fileInput?.click();
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('drag-over');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      const file = e.dataTransfer?.files?.[0];
      if (file) processImageFile(file);
    });
  }

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  });

  // Remove Custom Wallpaper
  removeCustomBtn?.addEventListener('click', async () => {
    wp.type = 'preset';
    wp.presetId = 'abstract-purple';
    wp.dataUrl = '';
    wp.url = '';
    if (customStatus) customStatus.style.display = 'none';
    if (urlInput) urlInput.value = '';

    presetsGrid?.querySelectorAll('.wallpaper-preset-card').forEach(c => {
      c.classList.toggle('active', c.dataset.presetId === 'abstract-purple');
    });

    await saveWallpaperSettings();
    updateLivePreview();
    showToast('Custom wallpaper removed. Reverted to Violet Radiance.');
  });

  // Custom Image URL Handlers
  const applyCustomUrl = async () => {
    const url = urlInput ? urlInput.value.trim() : '';
    if (url) {
      wp.type = 'custom_url';
      wp.url = url;
      wp.presetId = '';
      wp.dataUrl = '';
      if (customStatus) customStatus.style.display = 'none';
      presetsGrid?.querySelectorAll('.wallpaper-preset-card').forEach(c => c.classList.remove('active'));

      await saveWallpaperSettings();
      updateLivePreview();
      showToast('Custom wallpaper URL applied!');
    }
  };

  applyUrlBtn?.addEventListener('click', applyCustomUrl);
  urlInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyCustomUrl();
    }
  });

  urlInput?.addEventListener('input', async (e) => {
    const val = e.target.value.trim();
    if (val.startsWith('http://') || val.startsWith('https://')) {
      wp.url = val;
      wp.type = 'custom_url';
      wp.presetId = '';
      wp.dataUrl = '';
      if (customStatus) customStatus.style.display = 'none';
      presetsGrid?.querySelectorAll('.wallpaper-preset-card').forEach(c => c.classList.remove('active'));
      await saveWallpaperSettings();
      updateLivePreview();
    }
  });

  // Toggle Atmospheric Wallpaper
  if (toggle) {
    toggle.checked = wp.enabled !== false;
    toggle.addEventListener('change', async (e) => {
      wp.enabled = e.target.checked;
      await saveWallpaperSettings();
      updateLivePreview();
      showToast(wp.enabled ? 'Atmospheric wallpaper enabled' : 'Wallpaper disabled (clean glass mode)');
    });
  }

  // Sliders
  if (blurSlider && valBlur) {
    blurSlider.value = typeof wp.blur !== 'undefined' ? wp.blur : 0;
    valBlur.textContent = `${blurSlider.value}px`;
    blurSlider.addEventListener('input', (e) => {
      valBlur.textContent = `${e.target.value}px`;
      wp.blur = parseInt(e.target.value, 10);
      updateLivePreview();
    });
    blurSlider.addEventListener('change', saveWallpaperSettings);
  }

  if (brightSlider && valBright) {
    brightSlider.value = typeof wp.brightness !== 'undefined' ? wp.brightness : 85;
    valBright.textContent = `${brightSlider.value}%`;
    brightSlider.addEventListener('input', (e) => {
      valBright.textContent = `${e.target.value}%`;
      wp.brightness = parseInt(e.target.value, 10);
      updateLivePreview();
    });
    brightSlider.addEventListener('change', saveWallpaperSettings);
  }

  if (overlaySlider && valOverlay) {
    overlaySlider.value = typeof wp.overlayOpacity !== 'undefined' ? wp.overlayOpacity : 35;
    valOverlay.textContent = `${overlaySlider.value}%`;
    overlaySlider.addEventListener('input', (e) => {
      valOverlay.textContent = `${e.target.value}%`;
      wp.overlayOpacity = parseInt(e.target.value, 10);
      updateLivePreview();
    });
    overlaySlider.addEventListener('change', saveWallpaperSettings);
  }

  if (panelBlurSlider && valPanelBlur) {
    panelBlurSlider.value = typeof wp.panelBlur !== 'undefined' ? wp.panelBlur : 14;
    valPanelBlur.textContent = `${panelBlurSlider.value}px`;
    panelBlurSlider.addEventListener('input', (e) => {
      valPanelBlur.textContent = `${e.target.value}px`;
      wp.panelBlur = parseInt(e.target.value, 10);
      updateLivePreview();
    });
    panelBlurSlider.addEventListener('change', saveWallpaperSettings);
  }

  // Reset Sliders
  resetSlidersBtn?.addEventListener('click', async () => {
    wp.blur = 0;
    wp.brightness = 85;
    wp.overlayOpacity = 35;
    wp.panelBlur = 14;

    if (blurSlider) blurSlider.value = 0;
    if (valBlur) valBlur.textContent = '0px';

    if (brightSlider) brightSlider.value = 85;
    if (valBright) valBright.textContent = '85%';

    if (overlaySlider) overlaySlider.value = 35;
    if (valOverlay) valOverlay.textContent = '35%';

    if (panelBlurSlider) panelBlurSlider.value = 14;
    if (valPanelBlur) valPanelBlur.textContent = '14px';

    await saveWallpaperSettings();
    updateLivePreview();
    showToast('Atmospheric controls reset to defaults');
  });

  async function saveWallpaperSettings() {
    const settings = storageData.settings || {};
    settings.wallpaper = wp;
    storageData.settings = settings;
    await chrome.storage.local.set({ settings });
  }

  if (urlInput && wp.type === 'custom_url') {
    urlInput.value = wp.url || '';
  }

  updateLivePreview();
}

  root.PCOptionsThemesTab = {
    renderThemeFilterBar,
    renderThemeGrid,
    initWallpaperStudio
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
