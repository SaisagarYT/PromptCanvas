// PromptCanvas Options Page Script
// Theme: Tokyo Duo & Active Color Studio

function hexToRgba(hex, alpha) {
  const clean = (hex || '#000000').replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function buildTheme(id, name, category, desc, swatches, defaultWpPreset = 'abstract-purple') {
  const [c1, c2, c3, c4] = swatches;
  return {
    id,
    name,
    category,
    description: desc,
    colors: {
      primary: c2,
      secondary: c3,
      accent: c2,
      background: hexToRgba(c1, 0.82),
      surface: hexToRgba(c1, 0.88),
      surfaceGlass: hexToRgba(c1, 0.70),
      text: '#F8FAFC',
      textMuted: hexToRgba(c4, 0.75),
      border: hexToRgba(c2, 0.35),
      inputBg: hexToRgba(c1, 0.86),
      userBubble: hexToRgba(c2, 0.28),
      userBubbleText: '#FFFFFF',
      aiBubble: hexToRgba(c1, 0.60),
      sidebar: hexToRgba(c1, 0.88),
      sidebarHover: hexToRgba(c2, 0.14),
      swatches
    },
    wallpaper: {
      enabled: false,
      type: 'preset',
      presetId: defaultWpPreset,
      url: '',
      blur: 0,
      brightness: 85,
      overlayOpacity: 35,
      panelBlur: 14
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '8px',
    messageBorderRadius: '14px'
  };
}

const PALETTE_DEFINITIONS = [
  // Row 13 from reference image
  { id: 'orchidNoir', name: 'Orchid Noir', category: 'Luxury', desc: 'Velvet plum and mauve orchid with rose mist glass', swatches: ['#4D3A4D', '#BE5CA9', '#D59CC5', '#EADADA'] },
  { id: 'cyberTeal', name: 'Electric Cyber Teal', category: 'Cyber', desc: 'Deep space indigo with high-voltage electric cyan', swatches: ['#2A2C5F', '#43D9E7', '#3EC4D0', '#393C83'] },
  { id: 'crimsonVelvet', name: 'Crimson Velvet', category: 'Vibrant', desc: 'Espresso charcoal with radiant neon cerise and crisp white', swatches: ['#2B2024', '#FD0053', '#A80139', '#FFFFFF'] },
  { id: 'abyssalGold', name: 'Abyssal Gold', category: 'Luxury', desc: 'Midnight oceanic navy with sunburst gold and emerald jade', swatches: ['#001F3E', '#FFD716', '#0DA574', '#073358'] },

  // Row 14 from reference image
  { id: 'denimSunset', name: 'Denim Sunset', category: 'Warm', desc: 'Classic denim slate with crimson flame and sky turquoise', swatches: ['#3B4A6B', '#F23456', '#23B2DA', '#F1D43A'] },
  { id: 'neonSeafoam', name: 'Neon Seafoam', category: 'Cyber', desc: 'Electric violet with refreshing mint seafoam and sky blue', swatches: ['#7A56D0', '#5BE7C4', '#4FC0E8', '#F6F7FB'] },
  { id: 'ultramarineMagenta', name: 'Ultramarine Magenta', category: 'Vibrant', desc: 'Cobalt ultramarine with fluorescent neon magenta', swatches: ['#124E96', '#FF008E', '#0C8ABC', '#DAEAF7'] },
  { id: 'peacockNoir', name: 'Peacock Noir', category: 'Nature', desc: 'Pitch obsidian black with teal peacock and lime chartreuse', swatches: ['#000000', '#1A8B9D', '#B1D430', '#FFF5F4'] },

  // Row 15 from reference image
  { id: 'terracottaSlate', name: 'Terracotta Slate', category: 'Warm', desc: 'Midnight steel with warm burnt terracotta and silver ash', swatches: ['#1A273A', '#C24D2C', '#3E4A62', '#D9D9D7'] },
  { id: 'alpineMeadow', name: 'Alpine Meadow', category: 'Nature', desc: 'Deep alpine spruce with fresh matcha green and pale lemon', swatches: ['#073835', '#66D47E', '#C6E772', '#FAFFA3'] },
  { id: 'apricotEmerald', name: 'Apricot Emerald', category: 'Nature', desc: 'Persian pine teal with warm apricot sand and almond cream', swatches: ['#007064', '#F4C180', '#00A79D', '#FFEED0'] },
  { id: 'amethystMint', name: 'Amethyst Mint', category: 'Luxury', desc: 'Velvet amethyst purple with radiant turquoise mint', swatches: ['#9765C8', '#15CDA9', '#099A97', '#F0E4E4'] },

  // Row 16 from reference image
  { id: 'mandarinEmber', name: 'Mandarin Ember', category: 'Warm', desc: 'Dark roasted espresso with electric mandarin flame', swatches: ['#4E413B', '#FF6D24', '#857671', '#E2DED3'] },
  { id: 'nordicGlacier', name: 'Nordic Glacier', category: 'Cool', desc: 'Nordic fjord blue with dandelion gold and glacier mint', swatches: ['#4A89AC', '#FAEE5A', '#ACE5F6', '#E3FCF9'] },
  { id: 'twilightPersimmon', name: 'Twilight Persimmon', category: 'Warm', desc: 'Twilight plum purple with sunset persimmon and marigold', swatches: ['#423465', '#ED743F', '#FFAF50', '#824C97'] },
  { id: 'sageOlive', name: 'Sage & Olive', category: 'Nature', desc: 'Charcoal graphite with sage evergreen and vanilla cream', swatches: ['#3F3F3F', '#437A5B', '#B4CD93', '#FBF5B7'] },

  // Flagship luxury palettes to complete 20
  { id: 'ferrariCorse', name: 'Scuderia Corse', category: 'Vibrant', desc: 'Italian racing red with carbon fiber glass and gold emblem', swatches: ['#141016', '#EF4444', '#F59E0B', '#F8FAFC'], defaultWp: 'ferrari-racing' },
  { id: 'cyberpunkTokyo', name: 'Cyberpunk Tokyo', category: 'Cyber', desc: 'High-voltage Tokyo cyan with neon pink and laser yellow', swatches: ['#0B0C16', '#00F0FF', '#FF0055', '#FFE600'], defaultWp: 'abstract-purple' },
  { id: 'roseGoldMirage', name: 'Rose Gold Mirage', category: 'Luxury', desc: 'Luxurious rose gold velvet with coral blush and champagne', swatches: ['#1C131D', '#FB7185', '#F43F5E', '#FFE4E6'], defaultWp: 'cosmic-sunset' },
  { id: 'solarFlare', name: 'Solar Flare Obsidian', category: 'Warm', desc: 'Midnight slate obsidian with molten amber and sunset gold', swatches: ['#0F172A', '#F59E0B', '#FB923C', '#FEF3C7'], defaultWp: 'spiderman-night' }
];

const DEFAULT_THEMES = PALETTE_DEFINITIONS.reduce((acc, p) => {
  acc[p.id] = buildTheme(p.id, p.name, p.category, p.desc, p.swatches, p.defaultWp || 'abstract-purple');
  return acc;
}, {});

const WALLPAPER_PRESETS = [
  { id: 'ferrari-racing', name: 'Ferrari Sunset', path: '../assets/wallpapers/ferrari-racing.jpg' },
  { id: 'abstract-purple', name: 'Violet Radiance', path: '../assets/wallpapers/abstract-purple.jpg' },
  { id: 'spiderman-action', name: 'Spider-Man Skyline', path: '../assets/wallpapers/spiderman-action.jpg' },
  { id: 'spiderman-night', name: 'Spider-Man Noir', path: '../assets/wallpapers/spiderman-night.jpg' },
  { id: 'cosmic-sunset', name: 'Twilight Mirage', path: '../assets/wallpapers/cosmic-sunset.jpg' },
  { id: 'none', name: 'Solid Acrylic', path: '' }
];

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

  renderThemeFilterBar();
  renderThemeGrid();
  initWallpaperStudio();
  initSidebarCustomizer();
  initInputBarCustomizer();
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

  const hash = window.location.hash.replace('#', '');
  const params = new URLSearchParams(window.location.search);
  const target = hash || params.get('panel');
  if (target) {
    const targetNav = document.querySelector(`.nav-item[data-panel="${target}"]`) ||
                      document.querySelector(`.nav-item[data-panel="${target === 'studio' ? 'palette' : target}"]`);
    if (targetNav) targetNav.click();
  }
}

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

// ===== CHATGPT SIDEBAR CUSTOMIZER =====
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

// ===== CHATGPT INPUT BAR (COMPOSER) CUSTOMIZER =====
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
