// PromptCanvas Background Service Worker
// Theme: Tokyo Duo — Golden Amber (#FFA649) & Slate Navy (#283845)

const DEFAULT_THEMES = {
  amberDuo: {
    id: 'amberDuo',
    name: 'Tokyo Amber',
    description: 'Ultra-light #FFFBF5 linen canvas with Slate Navy #283845 elements',
    colors: {
      primary: '#283845',
      secondary: '#FFA649',
      accent: '#283845',
      background: '#FFFBF5',
      surface: '#FFFBF5',
      surfaceGlass: '#FFFBF5',
      text: '#151E25',
      textMuted: 'rgba(40, 56, 69, 0.70)',
      border: 'rgba(40, 56, 69, 0.12)',
      inputBg: '#FFFFFF',
      userBubble: '#283845',
      userBubbleText: '#FFFBF5',
      aiBubble: 'rgba(40, 56, 69, 0.04)',
      sidebar: '#FFFBF5',
      sidebarHover: 'rgba(40, 56, 69, 0.08)',
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '4px',
    messageBorderRadius: '4px',
    blur: '0px',
  },
  slateDuo: {
    id: 'slateDuo',
    name: 'Tokyo Slate',
    description: 'Deep Slate Navy #283845 canvas with Golden Amber #FFA649 accents',
    colors: {
      primary: '#FFA649',
      secondary: '#283845',
      accent: '#FFA649',
      background: '#283845',
      surface: '#283845',
      surfaceGlass: '#283845',
      text: '#FFA649',
      textMuted: 'rgba(255, 166, 73, 0.7)',
      border: 'rgba(255, 166, 73, 0.25)',
      inputBg: '#283845',
      userBubble: '#FFA649',
      userBubbleText: '#151E25',
      aiBubble: 'rgba(255, 166, 73, 0.08)',
      sidebar: '#283845',
      sidebarHover: 'rgba(255, 166, 73, 0.12)',
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '4px',
    messageBorderRadius: '4px',
    blur: '0px',
  },
  contrastDuo: {
    id: 'contrastDuo',
    name: 'Tokyo Dual',
    description: 'High-contrast Slate borders & deep accents on warm linen',
    colors: {
      primary: '#283845',
      secondary: '#FFA649',
      accent: '#283845',
      background: '#FFFBF5',
      surface: '#FFFBF5',
      surfaceGlass: '#FFFBF5',
      text: '#151E25',
      textMuted: 'rgba(40, 56, 69, 0.70)',
      border: '#283845',
      inputBg: '#FFFFFF',
      userBubble: '#151E25',
      userBubbleText: '#FFFBF5',
      aiBubble: 'rgba(40, 56, 69, 0.06)',
      sidebar: '#FFFBF5',
      sidebarHover: 'rgba(40, 56, 69, 0.12)',
    },
    font: 'Inter',
    fontSize: '15px',
    borderRadius: '4px',
    messageBorderRadius: '4px',
    blur: '0px',
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
  activeTheme: 'amberDuo',
  sidebarOpen: false,
  sidebarPosition: 'right',
  promptsEnabled: true,
  themeEnabled: false,
  customTheme: null,
};

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({
    themes: DEFAULT_THEMES,
    settings: DEFAULT_SETTINGS,
  });
  const existing = await chrome.storage.local.get(['prompts']);
  if (!existing.prompts || existing.prompts.length === 0) {
    await chrome.storage.local.set({ prompts: DEFAULT_PROMPTS });
  }
  console.log('[PromptCanvas] Initialized with Tokyo Amber & Slate Duo palette.');
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
