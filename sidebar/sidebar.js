// PromptCanvas Sidebar Component & Controller
// Complete Sidebar UI, UX, Interaction Logic, and State Management
// Tokyo Duo Engine · Zero external dependencies

(function (root) {
  'use strict';

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  const defaultThemes = {
    ferrariCorse: {
      id: 'ferrariCorse',
      name: 'Scuderia Corse',
      description: 'Italian Ferrari racing red with sleek carbon fiber glass and golden emblem accents',
      category: 'Racing',
      colors: {
        background: 'rgba(20, 16, 22, 0.80)',
        primary: '#EF4444',
        secondary: '#F59E0B',
        border: 'rgba(239, 68, 68, 0.32)',
        text: '#F8FAFC',
        userBubble: 'rgba(239, 68, 68, 0.28)',
        userBubbleText: '#FFFFFF',
        aiBubble: 'rgba(28, 20, 26, 0.55)'
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
      }
    },
    violetRadiance: {
      id: 'violetRadiance',
      name: 'Violet Radiance',
      description: 'Luminous cybernetic purple pillar glow with deep midnight indigo glass',
      category: 'Cyber',
      colors: {
        background: 'rgba(14, 10, 30, 0.80)',
        primary: '#A855F7',
        secondary: '#C084FC',
        border: 'rgba(168, 85, 247, 0.35)',
        text: '#F8FAFC',
        userBubble: 'rgba(168, 85, 247, 0.30)',
        userBubbleText: '#FFFFFF',
        aiBubble: 'rgba(24, 16, 48, 0.55)'
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
      }
    },
    spidermanAction: {
      id: 'spidermanAction',
      name: 'Spider-Man Skyline',
      description: 'Dynamic heroic crimson and electric web-blue battle across Manhattan dusk',
      category: 'Heroic',
      colors: {
        background: 'rgba(16, 18, 28, 0.82)',
        primary: '#EF4444',
        secondary: '#38BDF8',
        border: 'rgba(239, 68, 68, 0.32)',
        text: '#F8FAFC',
        userBubble: 'rgba(239, 68, 68, 0.28)',
        userBubbleText: '#FFFFFF',
        aiBubble: 'rgba(20, 24, 40, 0.55)'
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
      }
    },
    spidermanNight: {
      id: 'spidermanNight',
      name: 'Spider-Man Noir City',
      description: 'Iconic white spider emblem with deep urban midnight and amber streetlight bokeh',
      category: 'Heroic',
      colors: {
        background: 'rgba(12, 18, 24, 0.84)',
        primary: '#F43F5E',
        secondary: '#FBBF24',
        border: 'rgba(244, 63, 94, 0.32)',
        text: '#F8FAFC',
        userBubble: 'rgba(244, 63, 94, 0.26)',
        userBubbleText: '#FFFFFF',
        aiBubble: 'rgba(18, 26, 36, 0.55)'
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
      }
    },
    twilightMirage: {
      id: 'twilightMirage',
      name: 'Twilight Mirage',
      description: 'Radiant neon sunset reflection with vivid magenta, coral glow, and twilight purple sea',
      category: 'Scenery',
      colors: {
        background: 'rgba(24, 12, 28, 0.78)',
        primary: '#F43F5E',
        secondary: '#FB923C',
        border: 'rgba(244, 63, 94, 0.36)',
        text: '#F8FAFC',
        userBubble: 'rgba(244, 63, 94, 0.30)',
        userBubbleText: '#FFFFFF',
        aiBubble: 'rgba(36, 18, 42, 0.55)'
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
      }
    }
  };


  const defaultPrompts = [
    {
      id: 'p_1',
      title: 'Code Reviewer & Bug Hunter',
      category: 'Coding',
      text: 'Review this [LANGUAGE] code for security vulnerabilities, edge cases, and performance optimizations:\n\n```[LANGUAGE]\n[CODE]\n```',
      tags: ['coding', 'review', 'security']
    },
    {
      id: 'p_2',
      title: 'Executive Summary Generator',
      category: 'Writing',
      text: 'Summarize the following text into 3 executive bullet points with actionable next steps for [AUDIENCE]:\n\n[CONTENT]',
      tags: ['writing', 'summary']
    },
    {
      id: 'p_3',
      title: 'Step-by-Step Task Decomposer',
      category: 'Productivity',
      text: 'Break down the following goal into atomic, sequentially ordered steps with estimated completion times:\n\nGoal: [GOAL]',
      tags: ['productivity', 'planning']
    }
  ];

  const PCSidebar = {
    escapeHtml,

    state: {
      open: false,
      activeTab: 'prompts',
      activeCategory: 'All',
      searchQuery: '',
      prompts: defaultPrompts,
      themes: defaultThemes,
      activeTheme: 'ferrariCorse',
      settings: {},
      uiPalette: null,
      platformLabel: 'AI Chat'
    },

    callbacks: {
      onInsertPrompt: null,
      onSavePrompt: null,
      onDeletePrompt: null,
      onSelectTheme: null,
      onUpdateWallpaper: null,
      onToggleTheme: null,
      onTogglePrompts: null,
      onFontChange: null,
      onFontSizeChange: null,
      onRadiusChange: null,
      onOpenOptions: null,
      onResetDefaults: null,
      onSidebarToggle: null
    },

    elements: {},

    // ===== COMPONENT RENDERERS =====

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
              ${hasWp ? `<span class="pc-theme-badge-pill">WALLPAPER</span>` : ''}
              <div class="pc-theme-swatches">
                <span class="pc-theme-swatch" style="background:${c.background};" title="Canvas"></span>
                <span class="pc-theme-swatch" style="background:${c.primary};" title="Primary"></span>
                <span class="pc-theme-swatch" style="background:${c.secondary};" title="Secondary"></span>
              </div>
            </div>
            ${isSelected ? `<span class="pc-theme-active-pill">ACTIVE ✓</span>` : ''}
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

            <div class="pc-section-label" style="margin-top:12px;">Atmospheric Wallpaper & Glass</div>
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

    // ===== UI NOTIFICATIONS =====

    showToast(message) {
      const toast = document.getElementById('pc-toast');
      const msg = document.getElementById('pc-toast-msg');
      if (!toast || !msg) return;
      msg.textContent = message;
      toast.classList.add('pc-show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => toast.classList.remove('pc-show'), 2000);
    },

    // ===== SIDEBAR INITIALIZATION & MOUNTING =====

    mount(container = document.body, platformLabel = 'AI Chat') {
      const existingRoot = document.getElementById('promptcanvas-root');
      if (existingRoot) {
        this.elements.root = existingRoot;
        this.elements.toggleBtn = document.getElementById('pc-toggle-btn');
        this.bindEvents();
        this.renderCategories();
        this.renderPrompts();
        this.renderThemes();
        this.renderStudioMiniPreview();
        this.syncControls();
        return;
      }

      this.state.platformLabel = platformLabel;

      // 1. Create Floating Toggle Handle
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'pc-toggle-btn';
      toggleBtn.title = 'PromptCanvas (Alt+P)';
      toggleBtn.innerHTML = `
        ${root.PCIcons?.toggle || ''}
        <span class="pc-toggle-label">PROMPTS</span>
      `;
      toggleBtn.addEventListener('click', () => this.toggle());
      container.appendChild(toggleBtn);
      this.elements.toggleBtn = toggleBtn;

      // 2. Create Sidebar Root & Inject Skeleton
      const rootDiv = document.createElement('div');
      rootDiv.id = 'promptcanvas-root';
      rootDiv.innerHTML = this.buildSidebarSkeleton(platformLabel);
      container.appendChild(rootDiv);
      this.elements.root = rootDiv;

      // 3. Attach Events & Initial Render
      this.bindEvents();
      this.renderCategories();
      this.renderPrompts();
      this.renderThemes();
      this.renderStudioMiniPreview();
      this.syncControls();

      if (this.state.settings.sidebarOpen) {
        setTimeout(() => this.open(), 400);
      }
    },

    init(options = {}) {
      if (options.platformLabel) this.state.platformLabel = options.platformLabel;
      if (options.prompts) this.state.prompts = options.prompts;
      if (options.themes) this.state.themes = options.themes;
      if (options.settings) {
        this.state.settings = options.settings;
        if (options.settings.activeTheme) this.state.activeTheme = options.settings.activeTheme;
      }
      if (options.uiPalette) this.state.uiPalette = options.uiPalette;

      // Register callbacks
      Object.keys(this.callbacks).forEach(k => {
        if (typeof options[k] === 'function') this.callbacks[k] = options[k];
      });

      // Mount to container (default: document.body)
      this.mount(options.container || document.body, this.state.platformLabel);

      if (this.state.uiPalette) {
        this.applyUIPalette(this.state.uiPalette);
      }
    },

    // ===== OPEN / CLOSE / TOGGLE =====

    open() {
      const root = this.elements.root || document.getElementById('promptcanvas-root');
      const toggleBtn = this.elements.toggleBtn || document.getElementById('pc-toggle-btn');
      if (!root) return;
      root.classList.add('pc-open');
      if (toggleBtn) toggleBtn.classList.add('pc-hidden');
      this.state.open = true;
      this.callbacks.onSidebarToggle?.(true);
    },

    close() {
      const root = this.elements.root || document.getElementById('promptcanvas-root');
      const toggleBtn = this.elements.toggleBtn || document.getElementById('pc-toggle-btn');
      if (!root) return;
      root.classList.remove('pc-open');
      if (toggleBtn) toggleBtn.classList.remove('pc-hidden');
      this.state.open = false;
      this.callbacks.onSidebarToggle?.(false);
    },

    toggle() {
      this.state.open ? this.close() : this.open();
    },

    switchTab(tabName) {
      document.querySelectorAll('.pc-tab').forEach(t => t.classList.remove('pc-active'));
      document.querySelectorAll('.pc-content').forEach(c => c.classList.remove('pc-active'));
      const targetTab = document.querySelector(`.pc-tab[data-tab="${tabName}"]`);
      const targetContent = document.getElementById(`pc-tab-${tabName}`);
      if (targetTab && targetContent) {
        targetTab.classList.add('pc-active');
        targetContent.classList.add('pc-active');
        this.state.activeTab = tabName;
      }
    },

    // ===== RENDERERS & LIVE UPDATES =====

    updateState(updates = {}) {
      if (updates.prompts) {
        this.state.prompts = updates.prompts;
        this.renderCategories();
        this.renderPrompts();
      }
      if (updates.themes) {
        this.state.themes = updates.themes;
        this.renderThemes();
      }
      if (updates.settings) {
        this.state.settings = updates.settings;
        if (updates.settings.activeTheme && updates.settings.activeTheme !== this.state.activeTheme) {
          this.state.activeTheme = updates.settings.activeTheme;
          this.renderThemes();
        }
        this.syncControls();
      }
      if (updates.uiPalette) {
        this.state.uiPalette = updates.uiPalette;
        this.applyUIPalette(updates.uiPalette);
      }
    },

    applyUIPalette(p) {
      if (!p) return;
      const root = this.elements.root || document.getElementById('promptcanvas-root');
      const toggleBtn = this.elements.toggleBtn || document.getElementById('pc-toggle-btn');
      if (root) {
        if (p.canvas) {
          root.style.setProperty('--pc-ui-bg', p.canvas);
          root.style.setProperty('--pc-ui-card', '#FFFFFF');
        }
        if (p.controls) {
          root.style.setProperty('--pc-ui-primary', p.controls);
          const clean = (p.controls || '').replace('#', '');
          if (clean.length === 6) {
            const num = parseInt(clean, 16);
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            root.style.setProperty('--pc-ui-border', `rgba(${r}, ${g}, ${b}, 0.16)`);
            root.style.setProperty('--pc-ui-border-strong', `rgba(${r}, ${g}, ${b}, 0.32)`);
          }
        }
        // Always enforce crisp dark text and readable gray secondary text
        root.style.setProperty('--pc-ui-text', '#0F172A');
        root.style.setProperty('--pc-ui-muted', '#475569');
        if (p.accent) root.style.setProperty('--pc-ui-accent', p.accent);
      }
      if (toggleBtn) {
        if (p.controls) {
          toggleBtn.style.background = p.controls;
          toggleBtn.style.borderColor = p.controls;
        }
        if (p.canvas) toggleBtn.style.color = p.canvas;
      }
      this.renderStudioMiniPreview();
    },

    renderStudioMiniPreview() {
      const el = document.getElementById('pc-studio-mini-preview');
      if (!el) return;
      const p = this.state.uiPalette;
      const swatches = (p && p.swatches && p.swatches.length)
        ? p.swatches
        : ['#283845', '#151E25', '#FFA649', '#FFE8D1', '#FFFBF5'];
      el.innerHTML = swatches.map(c => `<span class="pc-mini-swatch" style="background:${c};" title="${c}"></span>`).join('');
    },

    renderCategories() {
      const bar = document.getElementById('pc-cat-bar');
      if (!bar) return;
      const cats = ['All'];
      const counts = { All: this.state.prompts.length };
      this.state.prompts.forEach(p => {
        const raw = p.category ? p.category.trim() : 'General';
        const c = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        if (!cats.includes(c)) cats.push(c);
        counts[c] = (counts[c] || 0) + 1;
      });

      if (!cats.includes(this.state.activeCategory)) this.state.activeCategory = 'All';

      bar.innerHTML = cats.map(cat => {
        return this.renderCategoryChip(cat, counts[cat] || 0, this.state.activeCategory === cat);
      }).join('');

      bar.querySelectorAll('.pc-cat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          this.state.activeCategory = chip.dataset.cat;
          this.renderCategories();
          this.renderPrompts();
        });
      });
    },

    renderPrompts() {
      const list = document.getElementById('pc-prompt-list');
      const badge = document.getElementById('pc-badge-prompts');
      if (badge) badge.textContent = this.state.prompts.length;
      if (!list) return;

      const query = this.state.searchQuery.toLowerCase().trim();
      const activeCat = this.state.activeCategory;

      const filtered = this.state.prompts.filter(p => {
        const matchesCat = (activeCat === 'All') || (p.category && p.category.toLowerCase() === activeCat.toLowerCase());
        if (!matchesCat) return false;
        if (!query) return true;
        return (
          p.title.toLowerCase().includes(query) ||
          p.text.toLowerCase().includes(query) ||
          (p.category || '').toLowerCase().includes(query) ||
          (p.tags || []).some(t => t.toLowerCase().includes(query))
        );
      });

      if (filtered.length === 0) {
        list.innerHTML = `
          <div class="pc-empty">
            ${root.PCIcons?.empty || ''}
            <div class="pc-empty-title">${query ? 'No matching prompts' : 'Prompt library empty'}</div>
            <div class="pc-empty-text">${query ? 'Try a different keyword or select another category.' : 'Click "New" above to add your first template.'}</div>
          </div>`;
        return;
      }

      list.innerHTML = filtered.map(p => this.renderPromptCard(p)).join('');

      list.querySelectorAll('.pc-prompt-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const actionBtn = e.target.closest('.pc-card-btn, .pc-card-insert-btn');
          const promptId = card.dataset.promptId;
          const prompt = this.state.prompts.find(p => p.id === promptId);
          if (!prompt) return;

          if (actionBtn) {
            e.stopPropagation();
            const action = actionBtn.dataset.action;
            if (action === 'insert') {
              actionBtn.classList.add('pc-inserted');
              setTimeout(() => actionBtn.classList.remove('pc-inserted'), 650);
              this.callbacks.onInsertPrompt?.(prompt, actionBtn);
            } else if (action === 'copy') {
              navigator.clipboard?.writeText(prompt.text).then(() => this.showToast('Copied to clipboard'));
            } else if (action === 'delete') {
              this.deletePrompt(promptId);
            }
          } else {
            const insertBtn = card.querySelector('.pc-card-insert-btn');
            if (insertBtn) {
              insertBtn.classList.add('pc-inserted');
              setTimeout(() => insertBtn.classList.remove('pc-inserted'), 650);
            }
            this.callbacks.onInsertPrompt?.(prompt, insertBtn);
          }
        });
      });
    },

    deletePrompt(promptId) {
      this.state.prompts = this.state.prompts.filter(p => p.id !== promptId);
      this.renderCategories();
      this.renderPrompts();
      this.callbacks.onDeletePrompt?.(promptId, this.state.prompts);
      this.showToast('Prompt deleted');
    },

    renderThemes() {
      const grid = document.getElementById('pc-theme-grid');
      if (!grid) return;
      grid.innerHTML = Object.values(this.state.themes).map(theme => {
        return this.renderThemeCard(theme, this.state.activeTheme === theme.id);
      }).join('');

      grid.querySelectorAll('.pc-theme-card').forEach(card => {
        card.addEventListener('click', () => {
          const themeId = card.dataset.themeId;
          this.state.activeTheme = themeId;
          this.renderThemes();
          this.syncControls();
          this.callbacks.onSelectTheme?.(themeId);
          this.showToast('Theme applied');
        });
      });
    },

    updateActiveThemeWallpaper(patch) {
      const activeThemeId = this.state.activeTheme;
      if (!this.state.themes[activeThemeId]) return;
      const theme = this.state.themes[activeThemeId];
      theme.wallpaper = Object.assign({}, theme.wallpaper || {
        enabled: true,
        type: 'preset',
        presetId: 'ferrari-racing',
        url: '',
        blur: 0,
        brightness: 85,
        overlayOpacity: 42,
        panelBlur: 14
      }, patch);

      this.callbacks.onUpdateWallpaper?.(theme, this.state.themes);
      this.syncControls();
      this.renderThemes();

      if (root.PCThemeEngine) {
        root.PCThemeEngine.applyWallpaper(theme, this.state.settings?.themeEnabled);
        root.PCThemeEngine.applyCSSVars(theme, this.state.settings?.themeEnabled);
        root.PCThemeEngine.applyPageTheme(theme, this.state.platformLabel?.toLowerCase() || 'chatgpt', this.state.settings?.themeEnabled);
      }
    },

    syncControls() {
      const s = this.state.settings || {};
      const themeToggle = document.getElementById('toggle-theme-enabled');
      if (themeToggle && typeof s.themeEnabled !== 'undefined') {
        themeToggle.checked = Boolean(s.themeEnabled);
      }
      const promptsToggle = document.getElementById('toggle-prompts-enabled');
      if (promptsToggle && typeof s.promptsEnabled !== 'undefined') {
        promptsToggle.checked = Boolean(s.promptsEnabled);
      }
      const fontSelect = document.getElementById('select-font');
      if (fontSelect && s.fontFamily) fontSelect.value = s.fontFamily;

      const fontSlider = document.getElementById('range-fontsize');
      const fontVal = document.getElementById('val-fontsize');
      if (fontSlider && s.fontSize) {
        fontSlider.value = parseInt(s.fontSize, 10);
        if (fontVal) fontVal.textContent = `${fontSlider.value}px`;
      }

      const radSlider = document.getElementById('range-radius');
      const radVal = document.getElementById('val-radius');
      if (radSlider && s.messageRadius) {
        radSlider.value = parseInt(s.messageRadius, 10);
        if (radVal) radVal.textContent = `${radSlider.value}px`;
      }

      // Wallpaper Controls Sync
      const activeTheme = this.state.themes[this.state.activeTheme];
      const wp = activeTheme?.wallpaper || {};
      const wpToggle = document.getElementById('toggle-wallpaper-enabled');
      const wpControls = document.getElementById('pc-wallpaper-controls');
      if (wpToggle) {
        wpToggle.checked = Boolean(wp.enabled);
      }
      if (wpControls) {
        wpControls.style.display = wp.enabled ? 'flex' : 'none';
      }

      const wpPresetSelect = document.getElementById('select-wallpaper-preset');
      const customUploadRow = document.getElementById('row-custom-upload');
      const customUrlInput = document.getElementById('input-wallpaper-url');
      if (wpPresetSelect) {
        wpPresetSelect.value = (wp.type === 'custom_upload' || wp.type === 'custom_url')
          ? 'custom'
          : (wp.presetId || 'ferrari-racing');
      }
      if (customUploadRow) {
        customUploadRow.style.display = (wp.type === 'custom_upload' || wp.type === 'custom_url' || wpPresetSelect?.value === 'custom')
          ? 'flex'
          : 'none';
      }
      if (customUrlInput && wp.type === 'custom_url') {
        customUrlInput.value = wp.url || '';
      }

      const blurSlider = document.getElementById('range-glass-blur');
      const blurVal = document.getElementById('val-glass-blur');
      if (blurSlider) {
        const val = typeof wp.panelBlur !== 'undefined' ? wp.panelBlur : 14;
        blurSlider.value = val;
        if (blurVal) blurVal.textContent = `${val}px`;
      }

      const tintSlider = document.getElementById('range-wallpaper-tint');
      const tintVal = document.getElementById('val-wallpaper-tint');
      if (tintSlider) {
        const val = typeof wp.overlayOpacity !== 'undefined' ? wp.overlayOpacity : 45;
        tintSlider.value = val;
        if (tintVal) tintVal.textContent = `${val}%`;
      }

      const brightSlider = document.getElementById('range-wallpaper-brightness');
      const brightVal = document.getElementById('val-wallpaper-brightness');
      if (brightSlider) {
        const val = typeof wp.brightness !== 'undefined' ? wp.brightness : 85;
        brightSlider.value = val;
        if (brightVal) brightVal.textContent = `${val}%`;
      }
    },

    // ===== MODAL LOGIC =====

    openModal() {
      document.getElementById('pc-modal-overlay')?.classList.add('pc-visible');
      document.getElementById('modal-title')?.focus();
    },

    closeModal() {
      document.getElementById('pc-modal-overlay')?.classList.remove('pc-visible');
      ['modal-title', 'modal-category', 'modal-text'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    },

    saveNewPrompt() {
      const title = document.getElementById('modal-title')?.value.trim();
      const category = document.getElementById('modal-category')?.value.trim();
      const text = document.getElementById('modal-text')?.value.trim();

      if (!title || !text) {
        this.showToast('Title and prompt content required');
        return;
      }

      const cat = category || 'General';
      const newPrompt = {
        id: `p_${Date.now()}`,
        title,
        category: cat,
        text,
        tags: [cat.toLowerCase()]
      };

      this.state.prompts.unshift(newPrompt);
      this.closeModal();
      this.renderCategories();
      this.renderPrompts();
      this.callbacks.onSavePrompt?.(newPrompt, this.state.prompts);
      this.showToast('Prompt saved');
    },

    // ===== EVENT BINDINGS =====

    bindEvents() {
      // Close button
      document.getElementById('pc-close-btn')?.addEventListener('click', () => this.close());

      // Tabs
      document.querySelectorAll('.pc-tab').forEach(tab => {
        tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
      });

      // Options & Studio buttons
      document.getElementById('pc-header-options-btn')?.addEventListener('click', () => this.callbacks.onOpenOptions?.());
      document.getElementById('btn-open-options-page')?.addEventListener('click', () => this.callbacks.onOpenOptions?.('palette'));
      document.getElementById('btn-open-studio-card')?.addEventListener('click', () => this.callbacks.onOpenOptions?.('palette'));
      document.getElementById('pc-btn-footer-options')?.addEventListener('click', () => this.callbacks.onOpenOptions?.());

      // Search
      const searchInput = document.getElementById('pc-search');
      const searchClear = document.getElementById('pc-search-clear');
      searchInput?.addEventListener('input', (e) => {
        this.state.searchQuery = e.target.value;
        if (searchClear) searchClear.style.display = this.state.searchQuery ? 'block' : 'none';
        this.renderPrompts();
      });
      searchClear?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        this.state.searchQuery = '';
        searchClear.style.display = 'none';
        this.renderPrompts();
        searchInput?.focus();
      });

      // Add Prompt Modal
      document.getElementById('pc-add-prompt-btn')?.addEventListener('click', () => this.openModal());
      document.getElementById('pc-modal-close')?.addEventListener('click', () => this.closeModal());
      document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal());
      document.getElementById('modal-save')?.addEventListener('click', () => this.saveNewPrompt());
      document.getElementById('pc-modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'pc-modal-overlay') this.closeModal();
      });

      // Modal Category Suggestion Chips
      document.querySelectorAll('.pc-chip-suggest').forEach(chip => {
        chip.addEventListener('click', () => {
          const catInput = document.getElementById('modal-category');
          if (catInput) catInput.value = chip.dataset.cat;
        });
      });

      // Modal Quick Variable Chips
      document.querySelectorAll('.pc-var-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const textarea = document.getElementById('modal-text');
          if (!textarea) return;
          const tag = chip.dataset.var;
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const val = textarea.value;
          textarea.value = val.substring(0, start) + tag + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + tag.length;
          textarea.focus();
        });
      });

      // Typography & Geometry Sliders
      document.getElementById('select-font')?.addEventListener('change', (e) => {
        this.callbacks.onFontChange?.(e.target.value);
        this.showToast(`Font set to ${e.target.value}`);
      });

      const fontSlider = document.getElementById('range-fontsize');
      const fontVal = document.getElementById('val-fontsize');
      fontSlider?.addEventListener('input', (e) => {
        const size = `${e.target.value}px`;
        if (fontVal) fontVal.textContent = size;
        this.callbacks.onFontSizeChange?.(size);
      });

      const radSlider = document.getElementById('range-radius');
      const radVal = document.getElementById('val-radius');
      radSlider?.addEventListener('input', (e) => {
        const rad = `${e.target.value}px`;
        if (radVal) radVal.textContent = rad;
        this.callbacks.onRadiusChange?.(rad);
      });

      // Wallpaper Controls Event Bindings
      document.getElementById('toggle-wallpaper-enabled')?.addEventListener('change', (e) => {
        this.updateActiveThemeWallpaper({ enabled: e.target.checked });
        this.showToast(e.target.checked ? 'Wallpaper enabled' : 'Wallpaper disabled');
      });

      document.getElementById('select-wallpaper-preset')?.addEventListener('change', (e) => {
        const val = e.target.value;
        const customUploadRow = document.getElementById('row-custom-upload');
        if (val === 'custom') {
          if (customUploadRow) customUploadRow.style.display = 'flex';
          this.updateActiveThemeWallpaper({ type: 'custom_url' });
        } else {
          if (customUploadRow) customUploadRow.style.display = 'none';
          this.updateActiveThemeWallpaper({
            type: 'preset',
            presetId: val,
            url: root.PCThemeEngine?.PRESET_WALLPAPERS?.[val]?.url || ''
          });
          this.showToast('Curated wallpaper set');
        }
      });

      const fileInput = document.getElementById('input-wallpaper-file');
      document.getElementById('btn-upload-wallpaper')?.addEventListener('click', () => {
        fileInput?.click();
      });

      fileInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const img = new Image();
          img.onload = () => {
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
            this.updateActiveThemeWallpaper({
              enabled: true,
              type: 'custom_upload',
              dataUrl: dataUrl
            });
            this.showToast('Custom wallpaper applied');
          };
          img.src = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      });

      const customUrlInput = document.getElementById('input-wallpaper-url');
      const applyCustomUrl = () => {
        const url = customUrlInput?.value.trim();
        if (url) {
          this.updateActiveThemeWallpaper({
            enabled: true,
            type: 'custom_url',
            url: url
          });
          this.showToast('Custom wallpaper URL applied');
        }
      };
      customUrlInput?.addEventListener('change', applyCustomUrl);
      customUrlInput?.addEventListener('blur', applyCustomUrl);

      const glassBlurSlider = document.getElementById('range-glass-blur');
      const glassBlurVal = document.getElementById('val-glass-blur');
      glassBlurSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (glassBlurVal) glassBlurVal.textContent = `${val}px`;
        this.updateActiveThemeWallpaper({ panelBlur: val });
      });

      const tintSlider = document.getElementById('range-wallpaper-tint');
      const tintVal = document.getElementById('val-wallpaper-tint');
      tintSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (tintVal) tintVal.textContent = `${val}%`;
        this.updateActiveThemeWallpaper({ overlayOpacity: val });
      });

      const brightSlider = document.getElementById('range-wallpaper-brightness');
      const brightVal = document.getElementById('val-wallpaper-brightness');
      brightSlider?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (brightVal) brightVal.textContent = `${val}%`;
        this.updateActiveThemeWallpaper({ brightness: val });
      });

      // Workspace Toggles
      document.getElementById('toggle-theme-enabled')?.addEventListener('change', (e) => {
        this.callbacks.onToggleTheme?.(e.target.checked);
        this.showToast(e.target.checked ? 'Theming enabled' : 'Theming disabled');
      });

      document.getElementById('toggle-prompts-enabled')?.addEventListener('change', (e) => {
        this.callbacks.onTogglePrompts?.(e.target.checked);
      });

      // Reset Defaults
      document.getElementById('btn-reset')?.addEventListener('click', () => {
        this.callbacks.onResetDefaults?.();
      });
    },

    // Standalone Harness Runner (for when sidebar.html is opened directly)
    initStandalone() {
      if (document.body.dataset.pcStandaloneInit) return;
      document.body.dataset.pcStandaloneInit = 'true';

      this.init({
        platformLabel: 'Standalone',
        onInsertPrompt: (prompt) => {
          navigator.clipboard?.writeText(prompt.text).then(() => this.showToast('Copied to clipboard'));
        },
        onSelectTheme: (themeId) => {
          this.state.activeTheme = themeId;
        },
        onOpenOptions: (panel) => {
          alert(`Opening Options panel: ${panel || 'dashboard'}`);
        },
        onResetDefaults: () => {
          if (confirm('Reset defaults?')) {
            location.reload();
          }
        }
      });
    }
  };

  root.PCSidebar = PCSidebar;
  root.PCComponents = PCSidebar; // Alias for backward compatibility

  // Auto-init if loaded inside sidebar.html directly
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body.classList.contains('pc-sidebar-page')) {
          PCSidebar.initStandalone();
        }
      });
    } else {
      if (document.body.classList.contains('pc-sidebar-page')) {
        PCSidebar.initStandalone();
      }
    }
  }

})(typeof window !== 'undefined' ? window : this);
