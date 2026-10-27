// PromptCanvas Default Settings & Starter Prompts

(function (root) {
  'use strict';

  const DEFAULT_PROMPTS = [
    {
      id: 'p1',
      title: 'Expert Mode',
      category: 'Productivity',
      text: 'You are an expert in [FIELD]. Respond with deep technical precision, be concise, and use clear concrete examples. Avoid filler phrases.',
      tags: ['expert', 'productivity'],
    },
    {
      id: 'p2',
      title: 'Socratic Teacher',
      category: 'Learning',
      text: 'Guide me through [TOPIC] using the Socratic method. Ask questions that prompt critical thinking. Do not provide direct answers immediately.',
      tags: ['learning', 'teaching'],
    },
    {
      id: 'p3',
      title: 'Executive Summary',
      category: 'Writing',
      text: 'Summarize the following text into 5-7 key bullet points. Be concise, preserve essential insights, and eliminate jargon:\n\n[PASTE TEXT HERE]',
      tags: ['summary', 'writing'],
    },
    {
      id: 'p4',
      title: 'Debug Code',
      category: 'Coding',
      text: 'I have a bug in my [LANGUAGE] code. Expected behavior: [EXPECTED]. Actual behavior: [ACTUAL]. Code:\n\n```\n[CODE]\n```\n\nIdentify the root cause and provide the minimal fix.',
      tags: ['coding', 'debug'],
    },
    {
      id: 'p5',
      title: 'Editorial Polish',
      category: 'Writing',
      text: 'Rewrite the following text in an authoritative, clear, and elegant editorial tone. Enhance precision and rhythm:\n\n[PASTE TEXT]',
      tags: ['writing', 'tone'],
    },
    {
      id: 'p6',
      title: 'Idea Critic',
      category: 'Strategy',
      text: 'Analyze this concept: [IDEA]. Evaluate target audience, market dynamics, distribution risks, and defensibility. Be objective and direct.',
      tags: ['strategy', 'business'],
    },
  ];

  const DEFAULT_SETTINGS = {
    activeTheme: 'orchidNoir',
    sidebarOpen: false,
    sidebarPosition: 'right',
    promptsEnabled: true,
    themeEnabled: true,
    wallpaper: {
      enabled: true,
      type: 'preset',
      presetId: 'abstract-purple',
      url: '',
      blur: 0,
      brightness: 85,
      overlayOpacity: 35,
      panelBlur: 14
    },
    sidebarStyle: {
      backgroundMode: 'transparent', // 'transparent' | 'solid'
      glassBlur: 24,                  // 0 to 40px
      borderEnabled: true,            // show subtle theme border
      accentHeaders: true,            // highlight Recents / Projects in c3
      textColorMode: 'theme_harmony', // 'theme_harmony' (c4) | 'crisp_white'
    },
    inputBarStyle: {
      backgroundMode: 'transparent', // 'transparent' | 'solid'
      borderAccent: true,             // glowing accent border in c2
      actionButtonsMode: 'accent',    // Send/voice in c2
      toolPillsMode: 'accent',        // "+", "Think" in c3
      glassBlur: 16,                  // 0 to 30px
    },
    customTheme: null,
  };

  const PCDefaults = {
    DEFAULT_PROMPTS,
    DEFAULT_SETTINGS
  };

  root.PCDefaults = PCDefaults;
  root.DEFAULT_PROMPTS = DEFAULT_PROMPTS;
  root.DEFAULT_SETTINGS = DEFAULT_SETTINGS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCDefaults;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
