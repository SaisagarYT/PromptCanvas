// PromptCanvas Options - Active Color Studio Controller

(function (root) {
  'use strict';

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

  root.PCOptionsColorStudio = {
    init: initColorStudio,
    applyRootStyles
  };
  root.applyRootStyles = applyRootStyles;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
