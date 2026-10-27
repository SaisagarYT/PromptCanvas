// PromptCanvas Wallpaper Engine
// Injects and coordinates fixed background wallpapers, blur, tint, and opacity filters

(function (root) {
  'use strict';

  let wallpaperHostEl = null;
  let wallpaperOverlayEl = null;

  const PCWallpaperEngine = {
    getWallpaperUrl(wp) {
      if (root.PCWallpapers?.getWallpaperUrl) {
        return root.PCWallpapers.getWallpaperUrl(wp);
      }
      if (typeof root.getWallpaperUrl === 'function') {
        return root.getWallpaperUrl(wp);
      }
      return wp?.url || '';
    },

    applyWallpaper(themeOrWp, themeEnabled, globalWallpaper) {
      let wp = null;
      if (globalWallpaper !== undefined && globalWallpaper !== null) {
        wp = globalWallpaper;
      } else if (themeOrWp && (themeOrWp.presetId || themeOrWp.url || typeof themeOrWp.enabled !== 'undefined')) {
        wp = themeOrWp;
      } else if (themeOrWp && themeOrWp.wallpaper) {
        wp = themeOrWp.wallpaper;
      }

      const isEnabled = Boolean(themeEnabled && wp && wp.enabled && wp.presetId !== 'none' && (wp.presetId || wp.url || wp.dataUrl));

      if (!isEnabled) {
        if (wallpaperHostEl) {
          wallpaperHostEl.style.display = 'none';
        }
        return;
      }

      if (!wallpaperHostEl) {
        wallpaperHostEl = document.createElement('div');
        wallpaperHostEl.id = 'pc-wallpaper-host';
        wallpaperHostEl.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: -999999 !important;
          pointer-events: none !important;
          background-size: cover !important;
          background-position: center center !important;
          background-repeat: no-repeat !important;
          transition: filter 0.3s ease, opacity 0.3s ease !important;
        `;

        wallpaperOverlayEl = document.createElement('div');
        wallpaperOverlayEl.id = 'pc-wallpaper-overlay';
        wallpaperOverlayEl.style.cssText = `
          position: absolute !important;
          inset: 0 !important;
          pointer-events: none !important;
          transition: background-color 0.3s ease !important;
        `;

        wallpaperHostEl.appendChild(wallpaperOverlayEl);
        document.documentElement.appendChild(wallpaperHostEl);
      }

      const imgUrl = this.getWallpaperUrl(wp);
      if (imgUrl) {
        wallpaperHostEl.style.display = 'block';
        wallpaperHostEl.style.backgroundImage = `url("${imgUrl}")`;
        const blur = typeof wp.blur !== 'undefined' ? wp.blur : 0;
        const brightness = typeof wp.brightness !== 'undefined' ? wp.brightness : 85;
        wallpaperHostEl.style.filter = `blur(${blur}px) brightness(${brightness}%)`;

        const overlayPct = typeof wp.overlayOpacity !== 'undefined' ? wp.overlayOpacity : 35;
        wallpaperOverlayEl.style.backgroundColor = `rgba(10, 8, 18, ${overlayPct / 100})`;
      } else {
        wallpaperHostEl.style.display = 'none';
      }
    }
  };

  root.PCWallpaperEngine = PCWallpaperEngine;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCWallpaperEngine;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
