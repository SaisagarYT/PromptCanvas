// PromptCanvas ChatGPT Theme CSS - Chat Bubbles, Turn Layout & Markdown

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.messages = function (ctx) {
    const {
      c, theme, isWp, glassBlur, sidebarStyle, inputBarStyle,
      swatches, c1, c2, c3, c4, baseColor, primary, secondary, tertiary,
      userText, rootBg, border, secondaryBorder, sidebarHover, secondaryHover,
      isLight, sidebarItemColor, sidebarItemActiveColor, sidebarBtnColor,
      sbMode, sbBlur, sbBorderEnabled, sidebarBgCss, sidebarBorderCss,
      ibMode, ibBlur, ibBorderAccent, ibActionAccent, ibToolAccent, composerBgCss,
      hexToRgba
    } = ctx;

    return `
        /* ==========================================================================
           4. CHAT BUBBLES (Single Sleek Pill - Zero Double Boxes)
           ========================================================================== */
        /* Neutralize all user turn containers, rows, alignment wrappers, and test-ids */
        [data-message-author-role="user"],
        [data-turn="user"],
        article:has([data-message-author-role="user"]),
        div[class*="user-turn"],
        [data-message-author-role="user"] > div,
        [data-message-author-role="user"] [class*="items-end"],
        [data-message-author-role="user"] div.items-end {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* The Single User Message Bubble Capsule ONLY */
        [data-user-message-bubble],
        [data-message-author-role="user"] [class*="bg-token-main-surface"],
        [data-message-author-role="user"] div[class*="rounded-3xl"],
        [data-message-author-role="user"] div.items-end > div:first-child,
        [data-turn="user"] div[class*="rounded-3xl"],
        .user-message-bubble-color {
          background: ${isWp ? hexToRgba(baseColor, 0.85) : hexToRgba(baseColor, 0.92)} !important;
          background-color: ${isWp ? hexToRgba(baseColor, 0.85) : hexToRgba(baseColor, 0.92)} !important;
          border-radius: 20px !important;
          color: #FFFFFF !important;
          border: 1px solid ${hexToRgba(primary, 0.35)} !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          padding: 6px 14px !important;
          margin: 2px 0 !important;
          min-width: 0 !important;
          width: fit-content !important;
          max-width: 75% !important;
          display: inline-block !important;
          line-height: 1.5 !important;
        }

        /* Absolutely Eradicate ANY inner double box, background, border, shadow, or padding on children */
        [data-user-message-bubble] *:not(button):not(svg):not(path):not(textarea):not(input),
        [data-message-author-role="user"] [class*="bg-token-main-surface"] *:not(button):not(svg):not(path):not(textarea):not(input),
        [data-message-author-role="user"] div[class*="rounded-3xl"] *:not(button):not(svg):not(path):not(textarea):not(input),
        [data-message-author-role="user"] div.items-end > div:first-child *:not(button):not(svg):not(path):not(textarea):not(input),
        [data-turn="user"] div[class*="rounded-3xl"] *:not(button):not(svg):not(path):not(textarea):not(input),
        .user-message-bubble-color *:not(button):not(svg):not(path):not(textarea):not(input),
        [data-message-author-role="user"] .whitespace-pre-wrap,
        [data-message-author-role="user"] .font-user-message,
        [data-message-author-role="user"] div[class*="whitespace-pre-wrap"],
        [data-message-author-role="user"] div[class*="text-message"],
        [data-message-author-role="user"] div[class*="break-words"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-top: none !important;
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
          box-shadow: none !important;
          outline: none !important;
          padding: 0 !important;
          margin: 0 !important;
          color: #FFFFFF !important;
          border-radius: 0 !important;
          display: inline !important;
        }

        /* Edit mode textarea within user bubble */
        [data-message-author-role="user"] textarea {
          display: block !important;
          background: rgba(0, 0, 0, 0.4) !important;
          color: #FFFFFF !important;
          border: 1px solid ${hexToRgba(primary, 0.5)} !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
        }

        /* User Action Buttons Container - Strictly Horizontal Row */
        [data-message-author-role="user"] div.items-end > div:last-child,
        [data-message-author-role="user"] div:has(> button),
        [data-turn="user"] div:has(> button),
        div.items-end div:has(> button) {
          display: flex !important;
          flex-direction: row !important;
          align-items: center !important;
          justify-content: flex-end !important;
          gap: 2px !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          margin-top: 4px !important;
        }

        /* User Action Buttons (Edit, Copy, Share below bubble) */
        [data-message-author-role="user"] button,
        [data-message-author-role="user"] ~ div button,
        [data-turn="user"] button {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #94A3B8 !important;
          border-radius: 6px !important;
          padding: 4px 6px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.15s ease !important;
          cursor: pointer !important;
        }

        [data-message-author-role="user"] button:hover,
        [data-message-author-role="user"] ~ div button:hover,
        [data-turn="user"] button:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          color: #FFFFFF !important;
        }

        [data-message-author-role="user"] button svg,
        [data-message-author-role="user"] ~ div button svg,
        [data-turn="user"] button svg {
          color: inherit !important;
          width: 16px !important;
          height: 16px !important;
        }

        /* Assistant message turn - Clean, compact, native alignment */
        [data-markdown-text-style="assistant-message"],
        [data-markdown-text-style="assistant-message"][class^="MarkdownRoot-"],
        [data-message-author-role="assistant"] {
          background: ${isWp ? hexToRgba(baseColor, 0.78) : 'transparent'} !important;
          background-color: ${isWp ? hexToRgba(baseColor, 0.78) : 'transparent'} !important;
          border-radius: ${theme.messageBorderRadius || '16px'} !important;
          border: ${isWp ? '1px solid rgba(255, 255, 255, 0.10)' : 'none'} !important;
          ${isWp ? `backdrop-filter: blur(${glassBlur}px) saturate(140%) !important; -webkit-backdrop-filter: blur(${glassBlur}px) saturate(140%) !important;` : ''}
          padding: 12px 18px !important;
          margin: 6px 0 !important;
          color: #F8FAFC !important;
          box-shadow: ${isWp ? '0 4px 16px rgba(0, 0, 0, 0.3)' : 'none'} !important;
        }

        [data-message-author-role="assistant"] div.markdown,
        [data-markdown-text-style="assistant-message"] > div {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
        }

        /* Standalone Code Blocks outside contain-inline-size */
        pre:not(.contain-inline-size pre):not([class*="contain-inline-size"] pre):not(#promptcanvas-root *) {
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 12px !important;
          background-color: ${isWp ? hexToRgba(baseColor, 0.88) : c.background} !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35) !important;
          padding: 14px 16px !important;
        }

        blockquote {
          border-left: 3px solid ${secondary} !important;
          color: #CBD5E1 !important;
        }

        /* Action buttons below assistant turn - Clean Minimalist Ghost Buttons Matching Human Side */
        article:has([data-message-author-role="assistant"]) button,
        article[data-testid^="conversation-turn-"]:not(:has([data-message-author-role="user"])) button,
        div[class*="agent-turn"] button,
        [data-message-author-role="assistant"] button,
        [data-message-author-role="assistant"] ~ div button,
        [data-message-author-role="assistant"] ~ div div button,
        div[class*="group/turn-messages"] button,
        [class*="touch:-me-2"] button,
        div:has(> button[aria-label*="Copy"]) button,
        button[aria-label*="Copy" i],
        button[aria-label*="Read aloud" i],
        button[aria-label*="Listen" i],
        button[aria-label*="Good response" i],
        button[aria-label*="Bad response" i],
        button[aria-label*="Thumbs" i],
        button[aria-label*="Like" i],
        button[aria-label*="Dislike" i],
        button[aria-label*="Retry" i],
        button[aria-label*="Try again" i],
        button[aria-label*="Regenerate" i],
        button[aria-label*="Share" i],
        button[aria-label*="More" i],
        button[aria-label*="actions" i],
        button[aria-label*="options" i] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
          color: #94A3B8 !important;
          border-radius: 6px !important;
          padding: 4px 6px !important;
          margin: 0 2px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.15s ease !important;
          cursor: pointer !important;
        }

        article:has([data-message-author-role="assistant"]) button:hover,
        article[data-testid^="conversation-turn-"]:not(:has([data-message-author-role="user"])) button:hover,
        div[class*="agent-turn"] button:hover,
        [data-message-author-role="assistant"] button:hover,
        [data-message-author-role="assistant"] ~ div button:hover,
        [data-message-author-role="assistant"] ~ div div button:hover,
        div[class*="group/turn-messages"] button:hover,
        [class*="touch:-me-2"] button:hover,
        div:has(> button[aria-label*="Copy"]) button:hover,
        button[aria-label*="Copy" i]:hover,
        button[aria-label*="Read aloud" i]:hover,
        button[aria-label*="Listen" i]:hover,
        button[aria-label*="Good response" i]:hover,
        button[aria-label*="Bad response" i]:hover,
        button[aria-label*="Thumbs" i]:hover,
        button[aria-label*="Like" i]:hover,
        button[aria-label*="Dislike" i]:hover,
        button[aria-label*="Retry" i]:hover,
        button[aria-label*="Try again" i]:hover,
        button[aria-label*="Regenerate" i]:hover,
        button[aria-label*="Share" i]:hover,
        button[aria-label*="More" i]:hover,
        button[aria-label*="actions" i]:hover,
        button[aria-label*="options" i]:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          background-color: rgba(255, 255, 255, 0.12) !important;
          color: #FFFFFF !important;
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* SVG Icons inside assistant action buttons - Exactly matching Human Side */
        article:has([data-message-author-role="assistant"]) button svg,
        article[data-testid^="conversation-turn-"]:not(:has([data-message-author-role="user"])) button svg,
        div[class*="agent-turn"] button svg,
        [data-message-author-role="assistant"] button svg,
        [data-message-author-role="assistant"] ~ div button svg,
        [data-message-author-role="assistant"] ~ div div button svg,
        div[class*="group/turn-messages"] button svg,
        [class*="touch:-me-2"] button svg,
        button[aria-label*="Copy" i] svg,
        button[aria-label*="Read aloud" i] svg,
        button[aria-label*="Listen" i] svg,
        button[aria-label*="Good response" i] svg,
        button[aria-label*="Bad response" i] svg,
        button[aria-label*="Thumbs" i] svg,
        button[aria-label*="Like" i] svg,
        button[aria-label*="Dislike" i] svg,
        button[aria-label*="Retry" i] svg,
        button[aria-label*="Try again" i] svg,
        button[aria-label*="Regenerate" i] svg,
        button[aria-label*="Share" i] svg,
        button[aria-label*="More" i] svg,
        button[aria-label*="actions" i] svg,
        button[aria-label*="options" i] svg {
          color: inherit !important;
          width: 16px !important;
          height: 16px !important;
          filter: none !important;
          border: none !important;
          background: transparent !important;
        }

        /* Outer wrappers around assistant action buttons - Transparent & Borderless */
        [data-message-author-role="assistant"] ~ div,
        article:has([data-message-author-role="assistant"]) div:has(> button),
        article[data-testid^="conversation-turn-"]:not(:has([data-message-author-role="user"])) div:has(> button),
        div[class*="agent-turn"] div:has(> button),
        [class*="touch:-me-2"] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.messages;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
