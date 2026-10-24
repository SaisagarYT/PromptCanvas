// PromptCanvas Theme Engine
// Handles dynamic CSS generation & stylesheet injection for ChatGPT, Claude, Gemini, DeepSeek

(function (root) {
  'use strict';

  let themeStyleEl = null;

  const PCThemeEngine = {
    applyCSSVars(theme, themeEnabled) {
      if (!themeEnabled || !theme) return;
      const docRoot = document.documentElement;
      const c = theme.colors;

      docRoot.style.setProperty('--pc-primary', c.primary);
      docRoot.style.setProperty('--pc-secondary', c.secondary);
      docRoot.style.setProperty('--pc-accent', c.accent);
      docRoot.style.setProperty('--pc-bg', c.background);
      docRoot.style.setProperty('--pc-surface', c.surface);
      docRoot.style.setProperty('--pc-surface-glass', c.surfaceGlass);
      docRoot.style.setProperty('--pc-text', c.text);
      docRoot.style.setProperty('--pc-text-muted', c.textMuted);
      docRoot.style.setProperty('--pc-border', c.border);
      docRoot.style.setProperty('--pc-input-bg', c.inputBg);
      docRoot.style.setProperty('--pc-sidebar', c.sidebar);
      docRoot.style.setProperty('--pc-sidebar-hover', c.sidebarHover);
      docRoot.style.setProperty('--pc-font', theme.font || 'Inter');
      docRoot.style.setProperty('--pc-font-size', theme.fontSize || '15px');
      docRoot.style.setProperty('--pc-radius', theme.borderRadius || '4px');
      docRoot.style.setProperty('--pc-msg-radius', theme.messageBorderRadius || '4px');
      docRoot.style.setProperty('--pc-blur', '0px');
    },

    applyPageTheme(theme, platform, themeEnabled) {
      if (!themeEnabled) {
        if (themeStyleEl) themeStyleEl.textContent = '';
        return;
      }
      if (!theme) return;

      if (!themeStyleEl) {
        themeStyleEl = document.createElement('style');
        themeStyleEl.id = 'pc-page-theme';
        document.head.appendChild(themeStyleEl);
      }

      const c = theme.colors;
      let css = '';
      if (platform === 'chatgpt') css = this.buildChatGPTTheme(c, theme);
      else if (platform === 'gemini') css = this.buildGeminiTheme(c, theme);
      else if (platform === 'claude') css = this.buildClaudeTheme(c, theme);
      else if (platform === 'deepseek') css = this.buildDeepSeekTheme(c, theme);
      else css = this.buildGenericTheme(c, theme);

      themeStyleEl.textContent = css;
    },

    buildChatGPTTheme(c, theme) {
      const userText = c.userBubbleText || '#3C0016';
      return `
        html, body { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
        main, [class*="react-scroll-to-bottom"], [class*="overflow-y-auto"] { background-color: ${c.background} !important; }
        nav, [class*="bg-token-sidebar"], .sticky.top-0 { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
        #prompt-textarea, textarea, .ProseMirror, [class*="composer"] {
          background-color: ${c.inputBg} !important; color: ${c.text} !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: ${theme.borderRadius || '4px'} !important;
          border: 1px solid ${c.border} !important;
        }
        [class*="composer-parent"], [class*="stretch"] form { background: ${c.surface} !important; border-top: 1px solid ${c.border} !important; }
        [data-message-author-role="user"] [class*="rounded"] {
          background: ${c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '4px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
        }
        [data-message-author-role="user"] [class*="rounded"] p,
        [data-message-author-role="user"] [class*="rounded"] span {
          color: ${userText} !important;
        }
        [data-message-author-role="assistant"] { background-color: transparent !important; color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        p, span, h1, h2, h3, h4, li { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        pre, code { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
        a { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildClaudeTheme(c, theme) {
      const userText = c.userBubbleText || '#3C0016';
      return `
        html, body, main, [class*="bg-bg-"] { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
        nav, aside, [data-testid="sidebar"], [class*="bg-bg-000"], [class*="bg-bg-200"] { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
        div[contenteditable="true"], .ProseMirror, textarea {
          background-color: ${c.inputBg} !important; color: ${c.text} !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: ${theme.borderRadius || '4px'} !important;
          border: 1px solid ${c.border} !important;
        }
        fieldset, [class*="bg-bg-100"] { background-color: ${c.surface} !important; border-color: ${c.border} !important; }
        [data-testid="user-message"], [class*="font-user-message"] {
          background: ${c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '4px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
          padding: 10px 14px !important;
        }
        [data-testid="user-message"] p, [class*="font-user-message"] p {
          color: ${userText} !important;
        }
        [class*="font-claude-message"] { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        p, span, h1, h2, h3, h4, li { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        pre, code, [class*="code-block"] { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
        a { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildDeepSeekTheme(c, theme) {
      const userText = c.userBubbleText || '#3C0016';
      return `
        html, body, #root, [class*="chat-page"], [class*="chat-scroll"] { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
        [class*="sidebar"], [class*="side-bar"], [class*="ds-sidebar"] { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
        #chat-input, textarea, [class*="input-box"], [class*="ds-input"] {
          background-color: ${c.inputBg} !important; color: ${c.text} !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: ${theme.borderRadius || '4px'} !important;
          border: 1px solid ${c.border} !important;
        }
        [class*="user-message"], [class*="bubble-user"], [class*="_user_"] {
          background: ${c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '4px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
        }
        [class*="user-message"] p, [class*="bubble-user"] p { color: ${userText} !important; }
        [class*="assistant-message"], [class*="_assistant_"] {
          background: transparent !important;
          color: ${c.text} !important;
          font-family: '${theme.font || 'Inter'}', sans-serif !important;
        }
        p, span, h1, h2, h3, h4, li, div[class*="ds-markdown"] { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        pre, code, [class*="code-block"] { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
        a { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildGeminiTheme(c, theme) {
      const userText = c.userBubbleText || '#3C0016';
      return `
        html, body { background-color: ${c.background} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; color: ${c.text} !important; }
        .conversation-container, .chat-history, main { background-color: ${c.background} !important; }
        .input-area, rich-textarea, .ql-editor, [jsname="tKMEOc"], footer {
          background-color: ${c.inputBg} !important; border: 1px solid ${c.border} !important;
          color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important;
          font-size: ${theme.fontSize || '15px'} !important;
          border-radius: ${theme.borderRadius || '4px'} !important;
        }
        .user-query-bubble-with-background, .user-query-bubble {
          background: ${c.userBubble} !important;
          border-radius: ${theme.messageBorderRadius || '4px'} !important;
          color: ${userText} !important;
          border: 1px solid ${c.border} !important;
        }
        .user-query-bubble-with-background p, .user-query-bubble p { color: ${userText} !important; }
        model-response, .model-response-text { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        side-nav, nav, mat-sidenav { background-color: ${c.sidebar} !important; border-right: 1px solid ${c.border} !important; }
        p, span, h1, h2, h3, h4, li { color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        pre, code, .code-block { background-color: ${c.background} !important; border: 1px solid ${c.border} !important; border-radius: 4px !important; font-family: 'JetBrains Mono', monospace !important; color: ${c.secondary} !important; }
        a { color: ${c.primary} !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: ${c.background}; } ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 2px; } ::-webkit-scrollbar-thumb:hover { background: ${c.primary}; }
      `;
    },

    buildGenericTheme(c, theme) {
      return `
        html, body { background-color: ${c.background} !important; color: ${c.text} !important; font-family: '${theme.font || 'Inter'}', sans-serif !important; }
        textarea, input[type="text"] { background-color: ${c.inputBg} !important; color: ${c.text} !important; border: 1px solid ${c.border} !important; }
        pre, code { background-color: ${c.background} !important; color: ${c.secondary} !important; border: 1px solid ${c.border} !important; }
        a { color: ${c.primary} !important; }
      `;
    }
  };

  root.PCThemeEngine = PCThemeEngine;
})(typeof window !== 'undefined' ? window : this);
