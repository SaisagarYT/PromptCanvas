// PromptCanvas Background Service Worker
// Theme Engine: Tokyo Duo, Anime Dusk & Curated Wallpaper Atmospheres

function hexToRgba(hex, alpha) {
  const clean = hex.replace('#', '');
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

const DEFAULT_PROMPTS = [
  {
    id: 'p1',
    title: 'Expert Mode',
    category: 'Productivity',
    text: 'You are an expert in [FIELD]. Respond with deep technical precision, be concise, and use clear concrete examples. Avoid filler phrases.',
    tags: ['expert', 'productivity'],
  },
  {
    id: 'p2',
    title: 'Socratic Teacher',
    category: 'Learning',
    text: 'Guide me through [TOPIC] using the Socratic method. Ask questions that prompt critical thinking. Do not provide direct answers immediately.',
    tags: ['learning', 'teaching'],
  },
  {
    id: 'p3',
    title: 'Executive Summary',
    category: 'Writing',
    text: 'Summarize the following text into 5-7 key bullet points. Be concise, preserve essential insights, and eliminate jargon:\n\n[PASTE TEXT HERE]',
    tags: ['summary', 'writing'],
  },
  {
    id: 'p4',
    title: 'Debug Code',
    category: 'Coding',
    text: 'I have a bug in my [LANGUAGE] code. Expected behavior: [EXPECTED]. Actual behavior: [ACTUAL]. Code:\n\n```\n[CODE]\n```\n\nIdentify the root cause and provide the minimal fix.',
    tags: ['coding', 'debug'],
  },
  {
    id: 'p5',
    title: 'Editorial Polish',
    category: 'Writing',
    text: 'Rewrite the following text in an authoritative, clear, and elegant editorial tone. Enhance precision and rhythm:\n\n[PASTE TEXT]',
    tags: ['writing', 'tone'],
  },
  {
    id: 'p6',
    title: 'Idea Critic',
    category: 'Strategy',
    text: 'Analyze this concept: [IDEA]. Evaluate target audience, market dynamics, distribution risks, and defensibility. Be objective and direct.',
    tags: ['strategy', 'business'],
  },
];

const DEFAULT_SETTINGS = {
  activeTheme: 'orchidNoir',
  sidebarOpen: false,
  sidebarPosition: 'right',
  promptsEnabled: true,
  themeEnabled: true,
  wallpaper: {
    enabled: true,
    type: 'preset',
    presetId: 'abstract-purple',
    url: '',
    blur: 0,
    brightness: 85,
    overlayOpacity: 35,
    panelBlur: 14
  },
  sidebarStyle: {
    backgroundMode: 'transparent', // 'transparent' | 'solid'
    glassBlur: 24,                  // 0 to 40px
    borderEnabled: true,            // show subtle theme border
    accentHeaders: true,            // highlight Recents / Projects in c3
    textColorMode: 'theme_harmony', // 'theme_harmony' (c4) | 'crisp_white'
  },
  inputBarStyle: {
    backgroundMode: 'transparent', // 'transparent' | 'solid'
    borderAccent: true,             // glowing accent border in c2
    actionButtonsMode: 'accent',    // Send/voice in c2
    toolPillsMode: 'accent',        // "+", "Think" in c3
    glassBlur: 16,                  // 0 to 30px
  },
  customTheme: null,
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(['themes', 'settings', 'prompts']);
  const deprecatedIds = ['duskSunset', 'cyberpunkNeon', 'lofiMidnight', 'auroraPeaks', 'zenMinimal', 'amberDuo', 'slateDuo'];
  const userThemes = existing.themes || {};
  deprecatedIds.forEach(id => {
    delete userThemes[id];
  });

  // Always ensure all 20 curated themes are present and refreshed with full swatch palettes
  const mergedThemes = Object.assign({}, DEFAULT_THEMES, userThemes);
  for (const [id, theme] of Object.entries(DEFAULT_THEMES)) {
    if (!userThemes[id] || !userThemes[id].colors?.swatches) {
      mergedThemes[id] = theme;
    }
  }

  const currentSettings = existing.settings || {};
  if (!mergedThemes[currentSettings.activeTheme]) {
    currentSettings.activeTheme = 'orchidNoir';
  }

  // Ensure decoupled wallpaper settings exist
  if (!currentSettings.wallpaper) {
    currentSettings.wallpaper = Object.assign({}, DEFAULT_SETTINGS.wallpaper);
  }
  if (!currentSettings.sidebarStyle) {
    currentSettings.sidebarStyle = Object.assign({}, DEFAULT_SETTINGS.sidebarStyle);
  }
  if (!currentSettings.inputBarStyle) {
    currentSettings.inputBarStyle = Object.assign({}, DEFAULT_SETTINGS.inputBarStyle);
  }

  await chrome.storage.local.set({
    themes: mergedThemes,
    settings: Object.assign({}, DEFAULT_SETTINGS, currentSettings),
  });
  if (!existing.prompts || existing.prompts.length === 0) {
    await chrome.storage.local.set({ prompts: DEFAULT_PROMPTS });
  }
  console.log('[PromptCanvas] Initialized with 20 Curated Palette Themes.');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STORAGE') {
    chrome.storage.local.get(message.keys).then(sendResponse);
    return true;
  }
  if (message.type === 'SET_STORAGE') {
    chrome.storage.local.set(message.data).then(() => sendResponse({ success: true }));
    return true;
  }
  if (message.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage ? chrome.runtime.openOptionsPage() : chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
    sendResponse({ success: true });
    return true;
  }
});
