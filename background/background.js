// PromptCanvas Background Service Worker
// Theme Engine: Tokyo Duo, Anime Dusk & Curated Wallpaper Atmospheres

importScripts(
  '../common/utils/color.js',
  '../common/constants/themes.js',
  '../common/constants/defaults.js',
  '../common/constants/fonts.js'
);

// In-memory cache for ultra-fast instant font switching
const inlinedFontCache = new Map();

function bufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function getInlinedFont(fontName) {
  if (!fontName) fontName = 'Inter';
  if (inlinedFontCache.has(fontName)) {
    return inlinedFontCache.get(fontName);
  }

  // Check persistent storage cache
  try {
    const storageKey = `pc_font_data_${fontName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const stored = await chrome.storage.local.get([storageKey]);
    if (stored && stored[storageKey] && stored[storageKey].css) {
      inlinedFontCache.set(fontName, stored[storageKey]);
      return stored[storageKey];
    }
  } catch (e) {}

  // Build Google Font URL with exact weight variants
  const fontUrl = (typeof PCFonts !== 'undefined' && PCFonts.getFontGoogleUrl)
    ? PCFonts.getFontGoogleUrl(fontName)
    : `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName).replace(/%20/g, '+')}&display=swap`;

  // Fetch CSS with Chrome User-Agent so Google Fonts provides modern, lightweight .woff2 files
  const cssRes = await fetch(fontUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!cssRes.ok) {
    throw new Error(`Google Fonts CSS fetch failed: HTTP ${cssRes.status}`);
  }
  let css = await cssRes.text();

  // Find all font binary URLs (.woff2 / .ttf)
  const matches = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)];
  const uniqueUrls = [...new Set(matches.map(m => m[1]))];
  const urlToBase64 = {};
  let primaryBase64 = null;

  // Fetch each font file from fonts.gstatic.com in parallel (bypasses page CSP because service worker has host permissions)
  await Promise.all(uniqueUrls.map(async (url) => {
    try {
      const fRes = await fetch(url);
      if (fRes.ok) {
        const buf = await fRes.arrayBuffer();
        const b64 = bufferToBase64(buf);
        const mime = url.endsWith('.woff2') ? 'font/woff2' : 'font/ttf';
        urlToBase64[url] = `data:${mime};charset=utf-8;base64,${b64}`;
        if (!primaryBase64 || url.includes('latin')) {
          primaryBase64 = b64;
        }
      }
    } catch (err) {
      console.warn('[PromptCanvas] Font binary fetch failed:', url, err);
    }
  }));

  // Replace external gstatic URLs in CSS with self-contained data: URIs
  for (const [url, dataUri] of Object.entries(urlToBase64)) {
    css = css.split(url).join(dataUri);
  }

  const payload = {
    fontName,
    css,
    base64: primaryBase64
  };

  inlinedFontCache.set(fontName, payload);

  // Cache in storage for instant offline / reload
  try {
    const storageKey = `pc_font_data_${fontName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    await chrome.storage.local.set({ [storageKey]: payload });
  } catch (e) {}

  return payload;
}

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
  if (message.type === 'FETCH_INLINED_FONT' || message.type === 'FETCH_FONT_CSS') {
    const fontName = message.fontName || message.font || (message.url ? decodeURIComponent(message.url).match(/family=([^:&]+)/)?.[1]?.replace(/\+/g, ' ') : null) || 'Inter';
    getInlinedFont(fontName)
      .then(result => sendResponse(Object.assign({ success: true }, result)))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
