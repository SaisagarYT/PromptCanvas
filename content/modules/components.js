// PromptCanvas UI Component Bridge
// Proxies to the modular sidebar/sidebar.js component library

(function (root) {
  'use strict';

  if (root.PCSidebar) {
    root.PCComponents = root.PCSidebar;
  }
})(typeof window !== 'undefined' ? window : this);
