// PromptCanvas Curated Wallpaper Presets & Resolver

(function (root) {
  'use strict';

  const WALLPAPER_PRESETS_MAP = {
    'ferrari-racing': {
      id: 'ferrari-racing',
      name: 'Scuderia Ferrari Corse',
      shortName: 'Ferrari Sunset',
      localPath: 'assets/wallpapers/ferrari-racing.jpg'
    },
    'abstract-purple': {
      id: 'abstract-purple',
      name: 'Violet Radiance',
      shortName: 'Violet Radiance',
      localPath: 'assets/wallpapers/abstract-purple.jpg'
    },
    'spiderman-action': {
      id: 'spiderman-action',
      name: 'Spider-Man Skyline Action',
      shortName: 'Spider-Man Skyline',
      localPath: 'assets/wallpapers/spiderman-action.jpg'
    },
    'spiderman-night': {
      id: 'spiderman-night',
      name: 'Spider-Man Night City',
      shortName: 'Spider-Man Noir',
      localPath: 'assets/wallpapers/spiderman-night.jpg'
    },
    'cosmic-sunset': {
      id: 'cosmic-sunset',
      name: 'Twilight Mirage Sunset',
      shortName: 'Twilight Mirage',
      localPath: 'assets/wallpapers/cosmic-sunset.jpg'
    },
    'none': {
      id: 'none',
      name: 'Solid Acrylic (No Wallpaper)',
      shortName: 'Solid Acrylic',
      localPath: ''
    }
  };

  const WALLPAPER_PRESETS = [
    { id: 'ferrari-racing', name: 'Ferrari Sunset', path: '../assets/wallpapers/ferrari-racing.jpg' },
    { id: 'abstract-purple', name: 'Violet Radiance', path: '../assets/wallpapers/abstract-purple.jpg' },
    { id: 'spiderman-action', name: 'Spider-Man Skyline', path: '../assets/wallpapers/spiderman-action.jpg' },
    { id: 'spiderman-night', name: 'Spider-Man Noir', path: '../assets/wallpapers/spiderman-night.jpg' },
    { id: 'cosmic-sunset', name: 'Twilight Mirage', path: '../assets/wallpapers/cosmic-sunset.jpg' },
    { id: 'none', name: 'Solid Acrylic', path: '' }
  ];

  function getWallpaperUrl(wp) {
    if (!wp) return '';
    if (wp.type === 'custom_upload' && wp.dataUrl) return wp.dataUrl;
    if (wp.type === 'custom_url' && wp.url) return wp.url;

    const presetId = wp.presetId;
    if (presetId && presetId !== 'none') {
      const preset = WALLPAPER_PRESETS_MAP[presetId];
      const relPath = preset?.localPath || `assets/wallpapers/${presetId}.jpg`;
      try {
        if (typeof chrome !== 'undefined' && chrome.runtime?.getURL && chrome.runtime.id && !chrome.runtime.id.includes('mock')) {
          return chrome.runtime.getURL(relPath);
        }
      } catch (e) { }
      return '../' + relPath;
    }
    return wp.url || '';
  }

  const PCWallpapers = {
    PRESETS: WALLPAPER_PRESETS,
    PRESETS_MAP: WALLPAPER_PRESETS_MAP,
    getWallpaperUrl
  };

  root.PCWallpapers = PCWallpapers;
  root.WALLPAPER_PRESETS = WALLPAPER_PRESETS;
  root.PRESET_WALLPAPERS = WALLPAPER_PRESETS_MAP;
  root.getWallpaperUrl = getWallpaperUrl;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCWallpapers;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
