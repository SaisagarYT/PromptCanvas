// PromptCanvas Reusable SaaS UI Components System
// Modular, tokenized Vanilla JS/CSS component library

(function (root) {
  'use strict';

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  const PCComponents = {
    escapeHtml,

    // Renders a single SaaS-grade prompt card
    renderPromptCard(p) {
      const bracketMatches = p.text.match(/\[([^\]]+)\]/g) || [];
      const varCount = bracketMatches.length;
      const highlightedPreview = escapeHtml(p.text).replace(
        /\[([^\]]+)\]/g,
        '<span class="pc-prompt-var-pill">[$1]</span>'
      );
      const cat = p.category ? escapeHtml(p.category.trim()) : 'General';
      const catKey = cat.toLowerCase();

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
                  ${root.PCIcons.variable}
                  <span>${varCount} ${varCount === 1 ? 'var' : 'vars'}</span>
                </span>` : ''}
            </div>

            <div class="pc-card-actions">
              <button class="pc-card-btn pc-card-btn-copy" data-action="copy" data-prompt-id="${p.id}" title="Copy prompt text">
                ${root.PCIcons.copy}
              </button>
              <button class="pc-card-btn pc-card-btn-del" data-action="delete" data-prompt-id="${p.id}" title="Delete template">
                ${root.PCIcons.trash}
              </button>
            </div>
          </div>

          <div class="pc-card-body">
            <div class="pc-card-title">${escapeHtml(p.title)}</div>
            <div class="pc-card-preview">${highlightedPreview}</div>
          </div>

          <div class="pc-card-footer">
            <span class="pc-card-hint">
              ${root.PCIcons.enterHint}
              <span>Click card to insert</span>
            </span>
            <button class="pc-card-insert-btn" data-action="insert" data-prompt-id="${p.id}" title="Insert into chat">
              <span>Insert</span>
              <kbd class="pc-insert-kbd">↵</kbd>
            </button>
          </div>
        </div>`;
    },

    // Renders a category filter chip
    renderCategoryChip(cat, count, isActive) {
      return `
        <button class="pc-cat-chip ${isActive ? 'pc-active' : ''}" data-cat="${escapeHtml(cat)}">
          <span>${escapeHtml(cat)}</span>
          <span class="pc-cat-count">${count || 0}</span>
        </button>`;
    },

    // Renders a theme card with simulated mini chat bubble preview
    renderThemeCard(theme, isSelected) {
      const c = theme.colors;
      return `
        <div class="pc-theme-card ${isSelected ? 'pc-selected' : ''}" data-theme-id="${theme.id}">
          <div class="pc-theme-check">ACTIVE</div>
          <div class="pc-theme-mini-chat" style="background:${c.background}; border-color:${c.border};">
            <div class="pc-mini-bubble-user" style="background:${c.userBubble}; color:${c.userBubbleText || '#FFF'};">
              User Prompt
            </div>
            <div class="pc-mini-bubble-ai" style="color:${c.text};">
              AI Response Preview
            </div>
          </div>
          <div class="pc-theme-swatches">
            <div class="pc-theme-swatch" style="background:${c.background};" title="Background"></div>
            <div class="pc-theme-swatch" style="background:${c.primary};" title="Primary"></div>
            <div class="pc-theme-swatch" style="background:${c.secondary};" title="Secondary"></div>
          </div>
          <div class="pc-theme-name">${theme.name}</div>
          <div class="pc-theme-desc">${theme.description}</div>
        </div>`;
    },

    // Renders the complete, responsive sidebar DOM layout
    buildSidebarSkeleton(platformLabel) {
      const icons = root.PCIcons;
      return `
        <div id="pc-sidebar">
          <!-- Header -->
          <div id="pc-header">
            <div class="pc-header-top">
              <div class="pc-brand-group">
                <div class="pc-logo-icon">
                  ${icons.brand}
                </div>
                <span class="pc-logo-text">PromptCanvas</span>
                <span class="pc-logo-badge">PRO</span>
              </div>

              <div class="pc-header-actions">
                <div class="pc-platform-pill" title="Active on ${platformLabel}">
                  <span class="pc-platform-dot"></span>
                  <span>${platformLabel}</span>
                </div>
                <button class="pc-header-icon-btn" id="pc-header-options-btn" title="Open Active Color Studio & Options">
                  ${icons.gear}
                </button>
                <button class="pc-close-btn" id="pc-close-btn" title="Close (Esc)">
                  ${icons.close}
                </button>
              </div>
            </div>

            <!-- Segmented Tabs Navigation -->
            <div class="pc-tabs">
              <button class="pc-tab pc-active" data-tab="prompts">
                ${icons.tabPrompts}
                <span>Prompts</span>
                <span class="pc-tab-badge" id="pc-badge-prompts">0</span>
              </button>
              <button class="pc-tab" data-tab="themes">
                ${icons.tabThemes}
                <span>Themes</span>
              </button>
              <button class="pc-tab" data-tab="settings">
                ${icons.tabSettings}
                <span>Settings</span>
              </button>
            </div>
          </div>

          <!-- Prompts Tab (Default SaaS Productivity Hub) -->
          <div class="pc-content pc-active" id="pc-tab-prompts">
            <div class="pc-prompts-toolbar">
              <div class="pc-search-box">
                <span class="pc-search-icon">
                  ${icons.search}
                </span>
                <input type="text" class="pc-search-input" id="pc-search" placeholder="Search prompts, categories, [variables]...">
                <kbd class="pc-search-kbd" title="Press / to search">/</kbd>
                <button class="pc-search-clear" id="pc-search-clear" style="display:none;" title="Clear search">✕</button>
              </div>
              <button class="pc-add-btn" id="pc-add-prompt-btn" title="Create reusable template">
                ${icons.plus}
                <span>New</span>
              </button>
            </div>

            <div class="pc-cat-bar" id="pc-cat-bar"></div>

            <div class="pc-prompt-list" id="pc-prompt-list"></div>
          </div>

          <!-- Themes Tab (AI Chatspace Styling) -->
          <div class="pc-content" id="pc-tab-themes">
            <div class="pc-callout">
              ${icons.info}
              <div class="pc-callout-text">
                These presets style the AI conversation workspace. To customize the sidebar and popup colors, use the <strong>Active Color Studio</strong> in Options.
              </div>
            </div>

            <div class="pc-section-label">AI Chat Presets</div>
            <div class="pc-theme-grid" id="pc-theme-grid"></div>

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
            <div class="pc-shortcuts-card">
              <div class="pc-shortcut-row"><span class="pc-shortcut-label">Toggle Sidebar</span><kbd class="pc-kbd">Alt + P</kbd></div>
              <div class="pc-shortcut-row"><span class="pc-shortcut-label">Close Sidebar / Modal</span><kbd class="pc-kbd">Esc</kbd></div>
              <div class="pc-shortcut-row"><span class="pc-shortcut-label">Focus Prompt Search</span><kbd class="pc-kbd">/</kbd></div>
            </div>

            <div class="pc-section-label" style="margin-top:10px;">System & Storage</div>
            <div class="pc-settings-section">
              <div class="pc-settings-item">
                <div class="pc-settings-info">
                  <div class="pc-settings-title">Reset Defaults</div>
                  <div class="pc-settings-desc">Restore original Tokyo Duo settings & prompts</div>
                </div>
                <button class="pc-btn pc-btn-ghost pc-btn-xs" id="btn-reset" style="color:#C92A2A;">RESET</button>
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
              ${icons.arrowRight}
            </button>
          </div>
        </div>

        <!-- Add Prompt Modal -->
        <div class="pc-modal-overlay" id="pc-modal-overlay">
          <div class="pc-modal">
            <div class="pc-modal-header">
              <div class="pc-modal-header-title">
                ${icons.brand}
                <span>New Prompt Template</span>
              </div>
              <button class="pc-close-btn" id="pc-modal-close" title="Close (Esc)">
                ${icons.close}
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
          ${icons.check}
          <span id="pc-toast-msg">Saved</span>
        </div>
      `;
    },

    // Global Toast Manager
    showToast(message) {
      const toast = document.getElementById('pc-toast');
      const msg = document.getElementById('pc-toast-msg');
      if (!toast || !msg) return;
      msg.textContent = message;
      toast.classList.add('pc-show');
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => toast.classList.remove('pc-show'), 2000);
    }
  };

  root.PCComponents = PCComponents;
})(typeof window !== 'undefined' ? window : this);
