// PromptCanvas ChatGPT Theme CSS - Sidebar Host Styling & Chat History

(function (root) {
  'use strict';

  root.PCThemeCSS = root.PCThemeCSS || {};

  root.PCThemeCSS.sidebar = function (ctx) {
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
           3. SIDEBAR (Solid vs Frosted Glass + 100% Readable Text)
           ========================================================================== */

        /* Open sidebar shell gets the selected style ONLY when genuinely open */
        html:not([data-pc-sidebar="closed"]) #app-shell-sidebar:has(ol),
        html:not([data-pc-sidebar="closed"]) #app-shell-sidebar:has(a[href*="/c/"]),
        html:not([data-pc-sidebar="closed"]) #browser-sidebar-popover:has(ol) {
          ${sidebarBgCss}
          ${sidebarBorderCss}
          box-shadow: none !important;
        }

        /* When sidebar is collapsed/closed/mini-rail: strictly 100% transparent, ZERO ghost borders, blur, or background */
        html[data-pc-sidebar="closed"] #app-shell-sidebar,
        html[data-pc-sidebar="closed"] aside,
        html[data-pc-sidebar="closed"] #browser-sidebar-popover,
        html[data-pc-sidebar="closed"] nav,
        html[data-pc-sidebar="closed"] div.flex-shrink-0,
        #app-shell-sidebar:not(:has(ol)):not(:has(a[href*="/c/"])),
        #app-shell-sidebar:empty,
        #app-shell-sidebar[data-state="closed"],
        #app-shell-sidebar[aria-hidden="true"],
        #app-shell-sidebar[class*="w-0"],
        #app-shell-sidebar[class*="w-[0"],
        #app-shell-sidebar[style*="width: 0"],
        #app-shell-sidebar[style*="width:0"],
        div.flex-shrink-0:not(:has(ol)) {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          border-right: none !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }

        /* All aside containers and inner wrappers are ALWAYS 100% transparent (prevents phantom width and double opacity) */
        aside,
        aside *,
        #app-shell-sidebar aside,
        #app-shell-sidebar nav,
        #browser-sidebar-popover aside,
        #browser-sidebar-popover nav,
        nav[aria-label="Chat history"],
        nav:not(#promptcanvas-root *) > div,
        aside:not(#promptcanvas-root *) > div,
        nav:not(#promptcanvas-root *) div[class*="overflow-y-auto"],
        nav:not(#promptcanvas-root *) div[class*="overflow-x-hidden"],
        nav:not(#promptcanvas-root *) div[class*="flex-1"],
        nav:not(#promptcanvas-root *) div[class*="h-full"],
        nav:not(#promptcanvas-root *) ol,
        nav:not(#promptcanvas-root *) ul,
        nav:not(#promptcanvas-root *) div[class*="sticky"] {
          background: transparent !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-right: none !important;
          box-shadow: none !important;
        }

        /* Prevent double opacity inside sidebar: ALL inner children are strictly transparent */
        #app-shell-sidebar aside,
        #app-shell-sidebar nav,
        #browser-sidebar-popover aside,
        #browser-sidebar-popover nav,
        aside:has(nav) nav,
        nav[aria-label="Chat history"],
        nav:not(#promptcanvas-root *) > div,
        aside:not(#promptcanvas-root *) > div,
        nav:not(#promptcanvas-root *) div[class*="overflow-y-auto"],
        nav:not(#promptcanvas-root *) div[class*="overflow-x-hidden"],
        nav:not(#promptcanvas-root *) div[class*="flex-1"],
        nav:not(#promptcanvas-root *) div[class*="h-full"],
        nav:not(#promptcanvas-root *) ol,
        nav:not(#promptcanvas-root *) ul,
        nav:not(#promptcanvas-root *) div[class*="sticky"] {
          background: transparent !important;
          background-color: transparent !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          border-right: none !important;
          box-shadow: none !important;
        }

        /* Sidebar Section Headings (Pinned, Projects, Recents) */
        button[data-app-action-sidebar-section-toggle],
        nav button[data-app-action-sidebar-section-toggle],
        nav button[data-app-action-sidebar-section-toggle].group\/section-toggle {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: ${primary} !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        nav button[data-app-action-sidebar-section-toggle] span.min-w-0 {
          padding: 0.2rem 0.55rem !important;
          background: ${hexToRgba(primary, isLight ? 0.12 : 0.16)} !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 50vw !important;
          color: ${primary} !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
        }

        /* Sidebar All Links & Buttons: Crystal Clear High-Contrast Visibility */
        #app-shell-sidebar nav a,
        #app-shell-sidebar nav button,
        #browser-sidebar-popover nav a,
        #browser-sidebar-popover nav button,
        aside nav a,
        aside nav button,
        nav[aria-label="Chat history"] a,
        nav ol li a,
        nav ul li a,
        nav a[href*="/c/"] {
          color: ${sidebarItemColor} !important;
          transition: all 0.15s ease !important;
          border-radius: 8px !important;
        }

        #app-shell-sidebar nav a:not([href*="/c/"]):hover,
        #app-shell-sidebar nav button:hover,
        #browser-sidebar-popover nav a:not([href*="/c/"]):hover,
        #browser-sidebar-popover nav button:hover,
        aside nav a:not([href*="/c/"]):hover,
        aside nav button:hover {
          background: ${hexToRgba(primary, isLight ? 0.08 : 0.12)} !important;
          color: ${sidebarItemActiveColor} !important;
        }

        /* ==========================================================================
           Sidebar Chat History Items: Soft Seamless Pill (Reference Match)
           ========================================================================== */

        /* All parent li elements and wrappers are strictly transparent (NO giant blocks) */
        #app-shell-sidebar nav ol li,
        #app-shell-sidebar nav ul li,
        nav[aria-label="Chat history"] ol li,
        nav[aria-label="Chat history"] ul li,
        nav ol li,
        nav ul li {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          list-style: none !important;
        }

        /* Inactive chat row wrappers default to transparent */
        #app-shell-sidebar nav ol li > div,
        #app-shell-sidebar nav ul li > div,
        nav[aria-label="Chat history"] li > div,
        nav ol li > div,
        nav ul li > div {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 8px !important;
          transition: background 0.15s ease !important;
        }

        /* Hover on inactive chat rows: soft subtle wash, NO border, NO shadow */
        #app-shell-sidebar nav ol li:not(:has(a[aria-current="page"])):not(:has(a[class*="active"])):not(:has([class*="sidebar-surface-secondary"])) > div:hover,
        #app-shell-sidebar nav ul li:not(:has(a[aria-current="page"])):not(:has(a[class*="active"])):not(:has([class*="sidebar-surface-secondary"])) > div:hover,
        nav[aria-label="Chat history"] li:not(:has(a[aria-current="page"])):not(:has(a[class*="active"])):not(:has([class*="sidebar-surface-secondary"])) > div:hover,
        nav ol li:not(:has(a[aria-current="page"])):not(:has(a[class*="active"])):not(:has([class*="sidebar-surface-secondary"])) > div:hover,
        nav ul li:not(:has(a[aria-current="page"])):not(:has(a[class*="active"])):not(:has([class*="sidebar-surface-secondary"])) > div:hover,
        nav ol li:not(:has(div)):hover,
        nav ul li:not(:has(div)):hover {
          background: ${hexToRgba(primary, isLight ? 0.07 : 0.09)} !important;
          background-color: ${hexToRgba(primary, isLight ? 0.07 : 0.09)} !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 8px !important;
        }

        /* ACTIVE CHAT ITEM: Soft translucent pastel pill (Pure Flat Wash, NO border, NO shadow) */
        #app-shell-sidebar nav ol li:has(a[aria-current="page"]) > div,
        #app-shell-sidebar nav ol li:has(a[class*="active"]) > div,
        #app-shell-sidebar nav ol li:has([class*="sidebar-surface-secondary"]) > div,
        #app-shell-sidebar nav ul li:has(a[aria-current="page"]) > div,
        #app-shell-sidebar nav ul li:has(a[class*="active"]) > div,
        nav[aria-label="Chat history"] li:has(a[aria-current="page"]) > div,
        nav[aria-label="Chat history"] li:has(a[class*="active"]) > div,
        nav ol li:has(a[href*="/c/"][aria-current="page"]) > div,
        nav ol li:has(a[href*="/c/"][class*="active"]) > div,
        nav ul li:has(a[href*="/c/"][aria-current="page"]) > div,
        nav ul li:has(a[href*="/c/"][class*="active"]) > div,
        nav ol li:has([class*="sidebar-surface-secondary"]) > div,
        nav ul li:has([class*="sidebar-surface-secondary"]) > div,
        /* Fallback if a is a direct child of li (no intermediate div) */
        nav ol li:not(:has(div)):has(a[aria-current="page"]),
        nav ol li:not(:has(div)):has(a[class*="active"]),
        nav ul li:not(:has(div)):has(a[aria-current="page"]),
        nav ul li:not(:has(div)):has(a[class*="active"]) {
          background: ${hexToRgba(primary, isLight ? 0.15 : 0.20)} !important;
          background-color: ${hexToRgba(primary, isLight ? 0.15 : 0.20)} !important;
          border: none !important;
          box-shadow: none !important;
          border-radius: 8px !important;
        }

        /* Hover on active chat item */
        #app-shell-sidebar nav ol li:has(a[aria-current="page"]) > div:hover,
        #app-shell-sidebar nav ul li:has(a[aria-current="page"]) > div:hover,
        nav[aria-label="Chat history"] li:has(a[aria-current="page"]) > div:hover,
        nav ol li:not(:has(div)):has(a[aria-current="page"]):hover {
          background: ${hexToRgba(primary, isLight ? 0.22 : 0.27)} !important;
          background-color: ${hexToRgba(primary, isLight ? 0.22 : 0.27)} !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* ALL inner anchor tags and child elements are strictly transparent (NO double borders, NO inner boxes) */
        #app-shell-sidebar nav ol li a,
        #app-shell-sidebar nav ul li a,
        nav[aria-label="Chat history"] li a,
        nav ol li a,
        nav ul li a,
        nav a[href*="/c/"],
        nav ol li > div a,
        nav ul li > div a,
        nav ol li > div a *,
        nav ul li > div a *,
        nav ol li a *,
        nav ul li a * {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Explicitly guarantee chat links and inner contents NEVER get a hover background */
        #app-shell-sidebar nav a[href*="/c/"]:hover,
        #browser-sidebar-popover nav a[href*="/c/"]:hover,
        aside nav a[href*="/c/"]:hover,
        nav a[href*="/c/"]:hover,
        nav ol li a:hover,
        nav ul li a:hover,
        nav[aria-label="Chat history"] li a:hover,
        nav ol li > div a:hover,
        nav ul li > div a:hover,
        nav ol li > div a:hover * {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Active chat text: crisp and clear */
        #app-shell-sidebar nav ol li:has(a[aria-current="page"]) a,
        #app-shell-sidebar nav ol li:has(a[class*="active"]) a,
        nav[aria-label="Chat history"] li:has(a[aria-current="page"]) a,
        nav[aria-label="Chat history"] li:has(a[class*="active"]) a,
        nav ol li:has(a[aria-current="page"]) a,
        nav ul li:has(a[aria-current="page"]) a,
        nav a[href*="/c/"][aria-current="page"],
        nav a[href*="/c/"][class*="active"] {
          color: ${sidebarItemActiveColor} !important;
          font-weight: 500 !important;
        }

        /* Wipe ALL child spans, texts, and icons inside chat links to transparent (NO inner boxes) */
        #app-shell-sidebar nav ol li a *,
        #app-shell-sidebar nav ul li a *,
        nav[aria-label="Chat history"] li a *,
        nav ol li a *,
        nav ul li a *,
        nav a[href*="/c/"] * {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Three-dots options button on chat items: sleek ghost design */
        nav ol li button,
        nav ul li button,
        nav[aria-label="Chat history"] li button,
        nav div:has(> a[href*="/c/"]) button {
          background: transparent !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: ${sidebarBtnColor} !important;
        }

        nav ol li button:hover,
        nav ul li button:hover,
        nav[aria-label="Chat history"] li button:hover,
        nav div:has(> a[href*="/c/"]) button:hover {
          background: ${isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.15)'} !important;
          border-radius: 6px !important;
          color: ${sidebarItemActiveColor} !important;
        }

        /* "New chat" Quick Action Pill */
        nav a[href="/"],
        nav button[data-testid*="new-chat"],
        nav a:first-of-type:not([href*="/c/"]) {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid ${secondaryBorder} !important;
          border-radius: 9px !important;
          color: #F8FAFC !important;
          font-weight: 600 !important;
          font-size: 13.5px !important;
          padding: 8px 12px !important;
          margin: 6px 2px 10px 2px !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }

        nav a[href="/"]:hover,
        nav button[data-testid*="new-chat"]:hover,
        nav a:first-of-type:not([href*="/c/"]):hover {
          background: ${sidebarHover} !important;
          border-color: ${primary} !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 16px ${sidebarHover} !important;
          transform: translateY(-1px) !important;
        }

`;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root.PCThemeCSS.sidebar;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
