// PromptCanvas Sidebar HTML Templates & Skeleton

(function (root) {
  'use strict';

  function _escapeHtml(text) {
    if (root.PCDomUtils?.escapeHtml) return root.PCDomUtils.escapeHtml(text);
    if (typeof root.escapeHtml === 'function') return root.escapeHtml(text);
    return text || '';
  }

  const PCSidebarTemplates = {
    renderPromptCard(p) {
      const iconVar = root.PCIcons?.variable || `
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h2"/>
          <path d="M16 3h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-2"/>
        </svg>`;
      const iconCopy = root.PCIcons?.copy || `
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>`;
      const iconTrash = root.PCIcons?.trash || `
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>`;

      const bracketMatches = p.text.match(/\[([^\]]+)\]/g) || [];
      const varCount = bracketMatches.length;
      const highlightedPreview = escapeHtml(p.text).replace(
        /\[([^\]]+)\]/g,
        '<span class="pc-prompt-var-pill">[$1]</span>'
      );
      const rawCat = p.category ? p.category.trim() : 'General';
      const cat = escapeHtml(rawCat.charAt(0).toUpperCase() + rawCat.slice(1));
      const catKey = rawCat.toLowerCase();

      return `
        <div class="pc-prompt-card" data-prompt-id="${p.id}">
          <div class="pc-card-header">
            <div class="pc-card-badges">
              <span class="pc-card-tag pc-tag-${catKey}">
                <span class="pc-tag-dot"></span>
                <span>${cat}</span>
              </span>
              ${varCount > 0 ? `
                <span class="pc-card-var-badge" title="${varCount} dynamic variable${varCount > 1 ? 's' : ''}">
                  ${iconVar}
                  <span>${varCount} ${varCount === 1 ? 'var' : 'vars'}</span>
                </span>` : ''}
            </div>

            <div class="pc-card-actions">
              <button class="pc-card-btn pc-card-btn-copy" data-action="copy" data-prompt-id="${p.id}" title="Copy prompt text">
                ${iconCopy}
              </button>
              <button class="pc-card-btn pc-card-btn-del" data-action="delete" data-prompt-id="${p.id}" title="Delete template">
                ${iconTrash}
              </button>
            </div>
          </div>

          <div class="pc-card-body">
            <div class="pc-card-title">${escapeHtml(p.title)}</div>
            <div class="pc-card-preview">${highlightedPreview}</div>
          </div>

          <div class="pc-card-footer">
            <span class="pc-card-hint">
              <span>Click to insert</span>
            </span>
            <button class="pc-card-insert-btn" data-action="insert" data-prompt-id="${p.id}" title="Insert into chat">
              <span>Insert</span>
              <kbd class="pc-insert-kbd">↵</kbd>
            </button>
          </div>
        </div>`;
    },

    renderCategoryChip(cat, count, isActive) {
      const rawCat = cat ? cat.trim() : 'General';
      const catDisplay = rawCat.charAt(0).toUpperCase() + rawCat.slice(1);
      const catKey = rawCat.toLowerCase();
      return `
        <button class="pc-cat-chip ${isActive ? 'pc-active' : ''}" data-cat="${escapeHtml(cat)}">
          <span class="pc-tag-dot pc-cat-dot pc-cat-dot-${catKey}"></span>
          <span>${escapeHtml(catDisplay)}</span>
          <span class="pc-cat-count">${count || 0}</span>
        </button>`;
    },

    renderThemeCard(theme, isSelected) {
      const c = theme.colors;
      const wp = theme.wallpaper;
      const hasWp = Boolean(wp && wp.enabled);
      const wpUrl = root.PCThemeEngine?.getWallpaperUrl(wp) || wp?.url;
      const swatches = c.swatches || [c.background, c.primary, c.secondary, c.text];
      const miniChatBg = hasWp && wpUrl 
        ? `background-image: url('${wpUrl}'); background-size: cover; background-position: center;` 
        : `background: ${c.background};`;

      const aiBg = hasWp 
        ? (c.aiBubble || 'rgba(28, 24, 44, 0.65)')
        : (c.aiBubble || 'rgba(0,0,0,0.04)');

      return `
        <div class="pc-theme-card ${isSelected ? 'pc-selected' : ''}" data-theme-id="${theme.id}">
          <div class="pc-theme-card-header">
            <div class="pc-theme-header-left">
              <span class="pc-theme-name">${escapeHtml(theme.name)}</span>
              <span class="pc-theme-category-tag">${escapeHtml(theme.category || 'Preset')}</span>
            </div>
            ${isSelected ? `<span class="pc-theme-active-pill">ACTIVE ✓</span>` : ''}
          </div>

          <!-- 4-Color Palette Harmony Bar -->
          <div class="pc-palette-harmony-bar" title="4-Color Palette Harmony">
            <span class="pc-palette-stripe" style="background:${swatches[0]};" title="Base: ${swatches[0]}"><span class="pc-hex-tooltip">${swatches[0]}</span></span>
            <span class="pc-palette-stripe" style="background:${swatches[1]};" title="Primary: ${swatches[1]}"><span class="pc-hex-tooltip">${swatches[1]}</span></span>
            <span class="pc-palette-stripe" style="background:${swatches[2]};" title="Secondary: ${swatches[2]}"><span class="pc-hex-tooltip">${swatches[2]}</span></span>
            <span class="pc-palette-stripe" style="background:${swatches[3]};" title="Highlight: ${swatches[3]}"><span class="pc-hex-tooltip">${swatches[3]}</span></span>
          </div>

          <div class="pc-theme-mini-chat ${hasWp ? 'pc-mini-chat-wallpaper' : ''}" style="${miniChatBg} border: 1px solid ${c.border};">
            <div class="pc-mini-bubble-user" style="background:${c.userBubble}; color:${c.userBubbleText || '#FFF'}; border: 1px solid ${c.border};">
              User Prompt
            </div>
            <div class="pc-mini-bubble-ai" style="background:${aiBg}; color:${c.text}; border: 1px solid ${c.border};">
              AI Response Preview
            </div>
          </div>
          <div class="pc-theme-desc">${escapeHtml(theme.description)}</div>
        </div>`;
    },

    buildSidebarSkeleton(platformLabel = 'AI Chat') {
      const icons = root.PCIcons || {};
      const brandIcon = icons.brand || `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5Z"/>
          <path d="m2 17 10 5 10-5"/>
          <path d="m2 12 10 5 10-5"/>
        </svg>`;
      const gearIcon = icons.gear || `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>`;
      const closeIcon = icons.close || `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        </svg>`;
      const tabPromptsIcon = icons.tabPrompts || `
        <svg class="pc-tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m18 16 4-4-4-4"/>
          <path d="m6 8-4 4 4 4"/>
          <path d="m14.5 4-5 16"/>
        </svg>`;
      const tabThemesIcon = icons.tabThemes || `
        <svg class="pc-tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>`;
      const tabSettingsIcon = icons.tabSettings || `
        <svg class="pc-tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>`;
      const searchIcon = icons.search || `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>`;
      const plusIcon = icons.plus || `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14"/>
          <path d="M5 12h14"/>
        </svg>`;
      const infoIcon = icons.info || `
        <svg class="pc-callout-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>`;
      const arrowRightIcon = icons.arrowRight || `
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        </svg>`;
      const checkIcon = icons.check || `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>`;

      return `
        <div id="pc-sidebar">
          <!-- Header -->
          <div id="pc-header">
            <div class="pc-header-top">
              <div class="pc-brand-group">
                <div class="pc-logo-icon">
                  ${brandIcon}
                </div>
                <span class="pc-logo-text">PromptCanvas</span>
              </div>

              <div class="pc-header-actions">
                <div class="pc-platform-pill" title="Active on ${platformLabel}">
                  <span class="pc-platform-dot"></span>
                  <span>${platformLabel}</span>
                </div>
                <button class="pc-header-icon-btn" id="pc-header-options-btn" title="Open Active Color Studio & Options">
                  ${gearIcon}
                </button>
                <button class="pc-close-btn" id="pc-close-btn" title="Close (Esc)">
                  ${closeIcon}
                </button>
              </div>
            </div>

            <!-- Segmented Tabs Navigation -->
            <div class="pc-tabs">
              <button class="pc-tab pc-active" data-tab="prompts">
                ${tabPromptsIcon}
                <span>Prompts</span>
                <span class="pc-tab-badge" id="pc-badge-prompts">0</span>
              </button>
              <button class="pc-tab" data-tab="themes">
                ${tabThemesIcon}
                <span>Themes</span>
              </button>
              <button class="pc-tab" data-tab="settings">
                ${tabSettingsIcon}
                <span>Settings</span>
              </button>
            </div>
          </div>

          <!-- Prompts Tab (Default SaaS Productivity Hub) -->
          <div class="pc-content pc-active" id="pc-tab-prompts">
            <div class="pc-prompts-toolbar">
              <div class="pc-search-box">
                <span class="pc-search-icon">
                  ${searchIcon}
                </span>
                <input type="text" class="pc-search-input" id="pc-search" placeholder="Search prompts, categories, [variables]...">
                <kbd class="pc-search-kbd" title="Press / to search">/</kbd>
                <button class="pc-search-clear" id="pc-search-clear" style="display:none;" title="Clear search">✕</button>
              </div>
              <button class="pc-add-btn" id="pc-add-prompt-btn" title="Create reusable template">
                ${plusIcon}
                <span>New</span>
              </button>
            </div>

            <div class="pc-cat-bar" id="pc-cat-bar"></div>

            <div class="pc-prompt-list" id="pc-prompt-list"></div>
          </div>

          <!-- Themes Tab (AI Chatspace Styling) -->
          <div class="pc-content" id="pc-tab-themes">
            <div class="pc-callout">
              ${infoIcon}
              <div class="pc-callout-text">
                These presets style the AI conversation workspace. To customize the sidebar and popup colors, use the <strong>Active Color Studio</strong> in Options.
              </div>
            </div>

            <div class="pc-section-label">AI Chat Presets</div>
            <div class="pc-theme-grid" id="pc-theme-grid"></div>

            <div class="pc-section-label" style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
              <span>Atmospheric Wallpaper & Glass</span>
              <button type="button" class="pc-link-btn" id="btn-open-wallpapers-studio" style="font-size:10px; opacity:0.8; text-transform:none; letter-spacing:0; cursor:pointer; background:none; border:none; color:inherit; text-decoration:underline;">Options Studio ↗</button>
            </div>
            <div class="pc-control-group">
              <div class="pc-control-row">
                <span class="pc-control-label">Enable Wallpaper</span>
                <label class="pc-toggle">
                  <input type="checkbox" id="toggle-wallpaper-enabled">
                  <span class="pc-toggle-slider"></span>
                </label>
              </div>

              <div id="pc-wallpaper-controls" class="pc-wallpaper-subgroup">
                <div class="pc-control-row">
                  <span class="pc-control-label">Curated Preset</span>
                  <select class="pc-select" id="select-wallpaper-preset">
                    <option value="ferrari-racing">Scuderia Ferrari Corse</option>
                    <option value="abstract-purple">Violet Radiance</option>
                    <option value="spiderman-action">Spider-Man Skyline Action</option>
                    <option value="spiderman-night">Spider-Man Night City</option>
                    <option value="cosmic-sunset">Twilight Mirage Sunset</option>
                    <option value="custom">Custom Image...</option>
                  </select>
                </div>

                <div class="pc-control-row" id="row-custom-upload" style="display:none;">
                  <span class="pc-control-label">Custom Image</span>
                  <div class="pc-upload-actions">
                    <button type="button" class="pc-btn-secondary pc-btn-sm" id="btn-upload-wallpaper">Choose Image File</button>
                    <input type="file" id="input-wallpaper-file" accept="image/*" style="display:none;">
                    <input type="text" class="pc-input pc-input-sm" id="input-wallpaper-url" placeholder="Or paste image URL...">
                  </div>
                </div>

                <div class="pc-control-row">
                  <span class="pc-control-label">Panel Glass Blur</span>
                  <div class="pc-range-wrap">
                    <input type="range" class="pc-range-slider" id="range-glass-blur" min="0" max="24" value="14">
                    <span class="pc-range-val" id="val-glass-blur">14px</span>
                  </div>
                </div>

                <div class="pc-control-row">
                  <span class="pc-control-label">Dark Tint Dimming</span>
                  <div class="pc-range-wrap">
                    <input type="range" class="pc-range-slider" id="range-wallpaper-tint" min="10" max="80" value="45">
                    <span class="pc-range-val" id="val-wallpaper-tint">45%</span>
                  </div>
                </div>

                <div class="pc-control-row">
                  <span class="pc-control-label">Artwork Brightness</span>
                  <div class="pc-range-wrap">
                    <input type="range" class="pc-range-slider" id="range-wallpaper-brightness" min="50" max="120" value="85">
                    <span class="pc-range-val" id="val-wallpaper-brightness">85%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pc-section-label" style="margin-top:8px;">Typography & Geometry</div>
            <div class="pc-control-group">
              <div class="pc-control-row">
                <span class="pc-control-label">Font Family</span>
                <select class="pc-select" id="select-font">
                  <option value="Inter">Inter (Clean)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Editorial)</option>
                  <option value="JetBrains Mono">JetBrains Mono (Developer)</option>
                  <option value="Roboto">Roboto (Classic)</option>
                </select>
              </div>
              <div class="pc-control-row">
                <span class="pc-control-label">Font Size</span>
                <div class="pc-range-wrap">
                  <input type="range" class="pc-range-slider" id="range-fontsize" min="13" max="18" value="15">
                  <span class="pc-range-val" id="val-fontsize">15px</span>
                </div>
              </div>
              <div class="pc-control-row">
                <span class="pc-control-label">Message Radius</span>
                <div class="pc-range-wrap">
                  <input type="range" class="pc-range-slider" id="range-radius" min="0" max="12" value="4">
                  <span class="pc-range-val" id="val-radius">4px</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Tab -->
          <div class="pc-content" id="pc-tab-settings">
            <div class="pc-section-label">Active Workspace</div>
            <div class="pc-settings-section">
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">${platformLabel} Theming</div>
                  <div class="pc-settings-desc">Apply theme styling to ${platformLabel} chat</div>
                </div>
                <label class="pc-toggle">
                  <input type="checkbox" id="toggle-theme-enabled">
                  <span class="pc-toggle-slider"></span>
                </label>
              </div>
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">1-Click Prompt Inserter</div>
                  <div class="pc-settings-desc">Direct injection into ${platformLabel} composer</div>
                </div>
                <label class="pc-toggle">
                  <input type="checkbox" id="toggle-prompts-enabled">
                  <span class="pc-toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="pc-section-label" style="margin-top:10px;">Extension Appearance</div>
            <div class="pc-settings-section">
              <div class="pc-settings-item" id="btn-open-studio-card" style="cursor:pointer;" title="Click to open Color Studio in Options">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">Active Color Studio</div>
                  <div class="pc-settings-desc">10 Designer palettes for Sidebar & Popup</div>
                  <div class="pc-studio-mini-preview" id="pc-studio-mini-preview"></div>
                </div>
                <button class="pc-btn pc-btn-primary pc-btn-xs" id="btn-open-options-page">OPEN STUDIO →</button>
              </div>
            </div>

            <div class="pc-section-label" style="margin-top:10px;">Keyboard Shortcuts</div>
            <div class="pc-settings-section">
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">Toggle Sidebar</div>
                  <div class="pc-settings-desc">Show or hide the PromptCanvas panel</div>
                </div>
                <kbd class="pc-kbd">Alt + P</kbd>
              </div>
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">Close Sidebar / Modal</div>
                  <div class="pc-settings-desc">Dismiss active drawer or dialog</div>
                </div>
                <kbd class="pc-kbd">Esc</kbd>
              </div>
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">Focus Search</div>
                  <div class="pc-settings-desc">Jump straight to prompt search</div>
                </div>
                <kbd class="pc-kbd">/</kbd>
              </div>
            </div>

            <div class="pc-section-label" style="margin-top:10px;">System & Storage</div>
            <div class="pc-settings-section">
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">Reset Defaults</div>
                  <div class="pc-settings-desc">Restore original Tokyo Duo settings & prompts</div>
                </div>
                <button class="pc-btn pc-btn-ghost pc-btn-xs" id="btn-reset">RESET</button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div id="pc-footer">
            <div class="pc-footer-left">
              <span class="pc-footer-dot"></span>
              <span class="pc-footer-text">Tokyo Duo Engine · v2.0</span>
            </div>
            <button class="pc-footer-btn" id="pc-btn-footer-options" title="Open Options Dashboard">
              <span>Dashboard</span>
              ${arrowRightIcon}
            </button>
          </div>
        </div>

        <!-- Add Prompt Modal -->
        <div class="pc-modal-overlay" id="pc-modal-overlay">
          <div class="pc-modal">
            <div class="pc-modal-header">
              <div class="pc-modal-header-title">
                ${brandIcon}
                <span>New Prompt Template</span>
              </div>
              <button class="pc-close-btn" id="pc-modal-close" title="Close (Esc)">
                ${closeIcon}
              </button>
            </div>

            <div class="pc-modal-body">
              <div class="pc-form-group">
                <label class="pc-form-label">Template Title</label>
                <input type="text" class="pc-input" id="modal-title" placeholder="e.g. Code Reviewer & Bug Hunter">
              </div>

              <div class="pc-form-group">
                <label class="pc-form-label">Category</label>
                <input type="text" class="pc-input" id="modal-category" placeholder="e.g. Coding, Writing, Productivity">
                <div class="pc-modal-quick-chips">
                  <button type="button" class="pc-chip-suggest" data-cat="Coding">Coding</button>
                  <button type="button" class="pc-chip-suggest" data-cat="Writing">Writing</button>
                  <button type="button" class="pc-chip-suggest" data-cat="Productivity">Productivity</button>
                  <button type="button" class="pc-chip-suggest" data-cat="Strategy">Strategy</button>
                </div>
              </div>

              <div class="pc-form-group">
                <div class="pc-form-label-row">
                  <label class="pc-form-label">Prompt Content</label>
                  <span class="pc-form-hint">Use [TAGS] for dynamic fields</span>
                </div>
                <textarea class="pc-textarea" id="modal-text" placeholder="Enter prompt text. Use [BRACKETS] for dynamic placeholders..."></textarea>
                
                <div class="pc-var-helper">
                  <span class="pc-var-helper-label">Quick Variables:</span>
                  <div class="pc-var-chips">
                    <button type="button" class="pc-var-chip" data-var="[TOPIC]">+ [TOPIC]</button>
                    <button type="button" class="pc-var-chip" data-var="[LANGUAGE]">+ [LANGUAGE]</button>
                    <button type="button" class="pc-var-chip" data-var="[TARGET]">+ [TARGET]</button>
                    <button type="button" class="pc-var-chip" data-var="[FORMAT]">+ [FORMAT]</button>
                    <button type="button" class="pc-var-chip" data-var="[TONE]">+ [TONE]</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="pc-modal-footer">
              <button class="pc-btn pc-btn-ghost" id="modal-cancel">Cancel</button>
              <button class="pc-btn pc-btn-primary" id="modal-save">Save Template</button>
            </div>
          </div>
        </div>

        <!-- Toast Feedback -->
        <div class="pc-toast" id="pc-toast">
          ${checkIcon}
          <span id="pc-toast-msg">Saved</span>
        </div>
      `;
    },
  };

  root.PCSidebarTemplates = PCSidebarTemplates;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCSidebarTemplates;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
