// PromptCanvas Background Service Worker
// Theme Engine: Tokyo Duo, Anime Dusk & Curated Wallpaper Atmospheres

const DEFAULT_THEMES = {
  ferrariCorse: {
    id: 'ferrariCorse',
    name: 'Scuderia Corse',
    description: 'Italian Ferrari racing red with sleek carbon fiber glass and golden emblem accents',
    category: 'Racing',
    colors: {
      primary: '#EF4444',
      secondary: '#F59E0B',
      accent: '#EF4444',
      background: 'rgba(20, 16, 22, 0.80)',
      surface: 'rgba(28, 20, 26, 0.82)',
      surfaceGlass: 'rgba(34, 24, 32, 0.70)',
      text: '#F8FAFC',
      textMuted: '#CBD5E1',
      border: 'rgba(239, 68, 68, 0.32)',
      inputBg: 'rgba(20, 16, 22, 0.85)',
      userBubble: 'rgba(239, 68, 68, 0.28)',
      userBubbleText: '#FFFFFF',
      aiBubble: 'rgba(28, 20, 26, 0.55)',
      sidebar: 'rgba(16, 12, 18, 0.88)',
      sidebarHover: 'rgba(239, 68, 68, 0.14)',
    },
    wallpaper: {
      enabled: true,
      type: 'preset',
      presetId: 'ferrari-racing',
      url: '',
      blur: 0,
      brightness: 85,
      overlayOpacity: 38,
      panelBlur: 14
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '6px',
    messageBorderRadius: '6px',
  },
  violetRadiance: {
    id: 'violetRadiance',
    name: 'Violet Radiance',
    description: 'Luminous cybernetic purple pillar glow with deep midnight indigo glass',
    category: 'Cyber',
    colors: {
      primary: '#A855F7',
      secondary: '#C084FC',
      accent: '#A855F7',
      background: 'rgba(14, 10, 30, 0.80)',
      surface: 'rgba(20, 14, 40, 0.82)',
      surfaceGlass: 'rgba(26, 18, 52, 0.70)',
      text: '#F8FAFC',
      textMuted: '#D8B4FE',
      border: 'rgba(168, 85, 247, 0.35)',
      inputBg: 'rgba(14, 10, 30, 0.85)',
      userBubble: 'rgba(168, 85, 247, 0.30)',
      userBubbleText: '#FFFFFF',
      aiBubble: 'rgba(24, 16, 48, 0.55)',
      sidebar: 'rgba(12, 8, 26, 0.88)',
      sidebarHover: 'rgba(168, 85, 247, 0.14)',
    },
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
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '6px',
    messageBorderRadius: '6px',
  },
  spidermanAction: {
    id: 'spidermanAction',
    name: 'Spider-Man Skyline',
    description: 'Dynamic heroic crimson and electric web-blue battle across Manhattan dusk',
    category: 'Heroic',
    colors: {
      primary: '#EF4444',
      secondary: '#38BDF8',
      accent: '#EF4444',
      background: 'rgba(16, 18, 28, 0.82)',
      surface: 'rgba(22, 26, 38, 0.82)',
      surfaceGlass: 'rgba(26, 32, 48, 0.70)',
      text: '#F8FAFC',
      textMuted: '#CBD5E1',
      border: 'rgba(239, 68, 68, 0.32)',
      inputBg: 'rgba(16, 18, 28, 0.85)',
      userBubble: 'rgba(239, 68, 68, 0.28)',
      userBubbleText: '#FFFFFF',
      aiBubble: 'rgba(20, 24, 40, 0.55)',
      sidebar: 'rgba(14, 16, 26, 0.88)',
      sidebarHover: 'rgba(239, 68, 68, 0.14)',
    },
    wallpaper: {
      enabled: true,
      type: 'preset',
      presetId: 'spiderman-action',
      url: '',
      blur: 0,
      brightness: 85,
      overlayOpacity: 38,
      panelBlur: 14
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '6px',
    messageBorderRadius: '6px',
  },
  spidermanNight: {
    id: 'spidermanNight',
    name: 'Spider-Man Noir City',
    description: 'Iconic white spider emblem with deep urban midnight and amber streetlight bokeh',
    category: 'Heroic',
    colors: {
      primary: '#F43F5E',
      secondary: '#FBBF24',
      accent: '#F43F5E',
      background: 'rgba(12, 18, 24, 0.84)',
      surface: 'rgba(18, 26, 36, 0.84)',
      surfaceGlass: 'rgba(24, 34, 46, 0.70)',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      border: 'rgba(244, 63, 94, 0.32)',
      inputBg: 'rgba(12, 18, 24, 0.88)',
      userBubble: 'rgba(244, 63, 94, 0.26)',
      userBubbleText: '#FFFFFF',
      aiBubble: 'rgba(18, 26, 36, 0.55)',
      sidebar: 'rgba(10, 15, 20, 0.90)',
      sidebarHover: 'rgba(244, 63, 94, 0.14)',
    },
    wallpaper: {
      enabled: true,
      type: 'preset',
      presetId: 'spiderman-night',
      url: '',
      blur: 0,
      brightness: 85,
      overlayOpacity: 42,
      panelBlur: 14
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '6px',
    messageBorderRadius: '6px',
  },
  twilightMirage: {
    id: 'twilightMirage',
    name: 'Twilight Mirage',
    description: 'Radiant neon sunset reflection with vivid magenta, coral glow, and twilight purple sea',
    category: 'Scenery',
    colors: {
      primary: '#F43F5E',
      secondary: '#FB923C',
      accent: '#F43F5E',
      background: 'rgba(24, 12, 28, 0.78)',
      surface: 'rgba(32, 16, 38, 0.80)',
      surfaceGlass: 'rgba(40, 20, 48, 0.68)',
      text: '#F8FAFC',
      textMuted: '#FDA4AF',
      border: 'rgba(244, 63, 94, 0.36)',
      inputBg: 'rgba(24, 12, 28, 0.82)',
      userBubble: 'rgba(244, 63, 94, 0.30)',
      userBubbleText: '#FFFFFF',
      aiBubble: 'rgba(36, 18, 42, 0.55)',
      sidebar: 'rgba(20, 10, 24, 0.88)',
      sidebarHover: 'rgba(244, 63, 94, 0.14)',
    },
    wallpaper: {
      enabled: true,
      type: 'preset',
      presetId: 'cosmic-sunset',
      url: '',
      blur: 0,
      brightness: 85,
      overlayOpacity: 35,
      panelBlur: 14
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '6px',
    messageBorderRadius: '6px',
  },
};

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
  activeTheme: 'ferrariCorse',
  sidebarOpen: false,
  sidebarPosition: 'right',
  promptsEnabled: true,
  themeEnabled: true,
  customTheme: null,
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(['themes', 'settings', 'prompts']);
  const deprecatedIds = ['duskSunset', 'cyberpunkNeon', 'lofiMidnight', 'auroraPeaks', 'zenMinimal', 'amberDuo', 'slateDuo'];
  const userThemes = existing.themes || {};
  deprecatedIds.forEach(id => {
    delete userThemes[id];
  });

  const mergedThemes = Object.assign({}, DEFAULT_THEMES, userThemes);
  const currentSettings = existing.settings || {};
  if (!mergedThemes[currentSettings.activeTheme]) {
    currentSettings.activeTheme = 'ferrariCorse';
  }

  await chrome.storage.local.set({
    themes: mergedThemes,
    settings: Object.assign({}, DEFAULT_SETTINGS, currentSettings),
  });
  if (!existing.prompts || existing.prompts.length === 0) {
    await chrome.storage.local.set({ prompts: DEFAULT_PROMPTS });
  }
  console.log('[PromptCanvas] Initialized with 5 Curated Atmospheric Wallpapers.');
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
