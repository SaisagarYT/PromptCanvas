// PromptCanvas ChatGPT Theme CSS - Composer Capsule, Action Buttons & Tool Pills

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.composer = function (ctx) {
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
           5. INPUT COMPOSER CAPSULE (Crisp, Single-Pill, Zero Halo Blur)
           ========================================================================== */

        /* All outer containers outside the composer pill MUST be transparent with NO blur and NO shadow */
        [data-pip-obstacle="thread-footer"],
        [data-pip-obstacle="thread-footer"] > div,
        form[data-chatgpt-composer],
        form:has(#prompt-textarea),
        form[data-chatgpt-composer] > div,
        form[data-chatgpt-composer] .min-w-0 {
          background: transparent !important;
          background-color: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border: none !important;
        }

        /* The single unified outer composer pill */
        [data-pc-composer="true"],
        form[data-chatgpt-composer] [class^="ComposerLayoutRoot-"],
        form[data-chatgpt-composer] [class^="ComposerLayoutBody-"],
        form:has(#prompt-textarea) > div {
          ${composerBgCss}
          border: ${ibBorderAccent ? `1px solid ${hexToRgba(primary, 0.45)}` : `1px solid rgba(255, 255, 255, 0.16)`} !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35) !important;
          border-radius: 26px !important;
          transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
        }

        /* Focus-within on the outer composer pill - Clean outline, Zero fuzzy halo */
        [data-pc-composer="true"]:focus-within,
        form[data-chatgpt-composer] [class^="ComposerLayoutRoot-"]:focus-within,
        form[data-chatgpt-composer] [class^="ComposerLayoutBody-"]:focus-within,
        form:has(#prompt-textarea) > div:focus-within {
          border-color: ${primary} !important;
          box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45) !important;
        }


        /* STRICTLY TRANSPARENT INSIDE: Remove inside black background and red border */
        #composer-background,
        div[id="composer-background"],
        #prompt-textarea,
        .ProseMirror,
        div:has(> #prompt-textarea),
        div:has(> .ProseMirror),
        div[class*="ProseMirror"],
        form div:has(#prompt-textarea):not([data-pc-composer="true"]) {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        #composer-background,
        div[id="composer-background"] {
          border-radius: 26px !important;
        }

        #composer-background:focus-within,
        div[id="composer-background"]:focus-within,
        #prompt-textarea:focus,
        #prompt-textarea:focus-within,
        .ProseMirror:focus,
        .ProseMirror:focus-within,
        div:has(> #prompt-textarea):focus-within {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
        }

        /* ==========================================================================
           COMPOSER TEXT & HINT / PLACEHOLDER (100% Crisp Visibility & High Contrast)
           ========================================================================== */
        /* Active Typed Text & Multiline Scroll Constraint */
        #prompt-textarea,
        .ProseMirror {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
          max-height: 240px !important;
          overflow-y: auto !important;
          scrollbar-width: thin !important;
        }

        #prompt-textarea p,
        .ProseMirror p {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }

        #prompt-textarea::-webkit-scrollbar,
        .ProseMirror::-webkit-scrollbar {
          width: 5px !important;
        }

        #prompt-textarea::-webkit-scrollbar-track,
        .ProseMirror::-webkit-scrollbar-track {
          background: transparent !important;
        }

        #prompt-textarea::-webkit-scrollbar-thumb,
        .ProseMirror::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25) !important;
          border-radius: 4px !important;
        }

        /* Native Textarea Placeholder */
        #prompt-textarea::placeholder,
        #prompt-textarea::-webkit-input-placeholder,
        textarea#prompt-textarea::placeholder,
        textarea#prompt-textarea::-webkit-input-placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* ProseMirror Placeholder Pseudo-elements */
        #prompt-textarea [data-placeholder]::before,
        #prompt-textarea p[data-placeholder]::before,
        #prompt-textarea p.placeholder::before,
        #prompt-textarea p.is-editor-empty::before,
        #prompt-textarea p.is-empty::before,
        .ProseMirror [data-placeholder]::before,
        .ProseMirror p[data-placeholder]::before,
        .ProseMirror p.placeholder::before,
        .ProseMirror p.is-editor-empty::before,
        .ProseMirror p.is-empty::before,
        [data-placeholder]::before {
          content: attr(data-placeholder) !important;
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          display: block !important;
          visibility: visible !important;
          pointer-events: none !important;
        }

        /* Fallback: If data-placeholder is missing on an empty initial paragraph */
        #prompt-textarea p:only-child:has(> br:only-child):not([data-placeholder])::before,
        .ProseMirror p:only-child:has(> br:only-child):not([data-placeholder])::before {
          content: "Ask anything" !important;
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          display: block !important;
          visibility: visible !important;
          pointer-events: none !important;
        }

        /* Overlay Placeholder DOM Elements (Tailwind / Modern ChatGPT) */
        #prompt-textarea .placeholder,
        #prompt-textarea [class*="placeholder" i],
        form:has(#prompt-textarea) [class*="placeholder" i],
        form:has(#prompt-textarea) [class*="text-token-text-placeholder"],
        form:has(#prompt-textarea) div.pointer-events-none:not(button):not(button *) {
          color: rgba(255, 255, 255, 0.65) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.65) !important;
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* ==========================================================================
           COMPOSER TOOL BUTTONS: Plus, Brain, Voice, Send (100% Transparent, No Glass)
           ========================================================================== */

        /* 1. Send Button: Transparent when empty/disabled, clean solid accent when ready */
        [data-pc-btn="send"],
        button[data-testid*="send" i],
        button[aria-label*="Send" i],
        #composer-background button[data-testid*="send" i] {
          background: transparent !important;
          background-color: transparent !important;
          color: #94A3B8 !important;
          border: none !important;
          border-radius: 50% !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 36px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        /* Active send button (when enabled/ready to submit) */
        button.bg-composer-primary,
        [data-pc-btn="send"]:not(:disabled):not([aria-disabled="true"]):not([disabled]),
        button[data-testid*="send" i]:not(:disabled):not([aria-disabled="true"]):not([disabled]):has(svg) {
          background: ${primary} !important;
          background-color: ${primary} !important;
          color: #FFFFFF !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        button.bg-composer-primary:hover,
        [data-pc-btn="send"]:not(:disabled):not([aria-disabled="true"]):hover,
        button[data-testid*="send" i]:not(:disabled):not([aria-disabled="true"]):hover {
          filter: brightness(1.15) !important;
          transform: scale(1.06) !important;
        }

        /* 2. Voice / Dictation / Audio button: 100% Transparent, No Glass Effect */
        [data-pc-btn="voice"],
        button[aria-label*="Voice" i],
        button[aria-label*="dictation" i],
        button[data-testid*="voice" i] {
          background: transparent !important;
          background-color: transparent !important;
          color: #CBD5E1 !important;
          border: none !important;
          border-radius: 50% !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: all 0.2s ease !important;
        }

        [data-pc-btn="voice"]:hover,
        button[aria-label*="Voice" i]:hover,
        button[aria-label*="dictation" i]:hover,
        button[data-testid*="voice" i]:hover {
          background: transparent !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
          transform: scale(1.08) !important;
        }

        /* 3. "+ Attach" Button: 100% Transparent, No Glass Effect */
        [data-pc-btn="attach"],
        button[aria-label*="Attach" i],
        button[aria-label*="Upload" i],
        button[data-testid*="attach" i] {
          background: transparent !important;
          background-color: transparent !important;
          color: #CBD5E1 !important;
          border: none !important;
          border-radius: 50% !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transition: all 0.2s ease !important;
        }

        [data-pc-btn="attach"]:hover,
        button[aria-label*="Attach" i]:hover,
        button[aria-label*="Upload" i]:hover,
        button[data-testid*="attach" i]:hover {
          background: transparent !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
          transform: scale(1.08) !important;
        }

        /* 4. Think / Brain / Reasoning Button: 100% Transparent, No Glass Effect */
        [data-pc-btn="think"],
        button[aria-label*="Think" i],
        button[aria-label*="reason" i],
        button[data-testid*="think" i] {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-radius: 9999px !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          color: #CBD5E1 !important;
          height: 36px !important;
          padding: 0 10px !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 6px !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        [data-pc-btn="think"]:hover,
        button[aria-label*="Think" i]:hover,
        button[aria-label*="reason" i]:hover,
        button[data-testid*="think" i]:hover {
          background: transparent !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
        }

        /* Ensure all SVG icons inside composer buttons inherit transparent & clean colors */
        [data-pc-btn="attach"] svg,
        [data-pc-btn="think"] svg,
        [data-pc-btn="voice"] svg,
        #composer-background button:not([data-pc-btn="send"]) svg {
          color: inherit !important;
          fill: currentColor !important;
          stroke: currentColor !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.composer;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
