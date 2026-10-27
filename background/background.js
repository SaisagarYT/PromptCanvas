// PromptCanvas Background Service Worker
// Theme Engine: Tokyo Duo, Anime Dusk & Curated Wallpaper Atmospheres

importScripts(
  '../common/utils/color.js',
  '../common/constants/themes.js',
  '../common/constants/defaults.js'
);

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
