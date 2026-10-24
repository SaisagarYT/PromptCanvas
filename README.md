# PromptCanvas — Tokyo Duo AI Theme & Prompt Engine

> **Minimalist, high-contrast theme engine for ChatGPT, Claude, DeepSeek, and Gemini.**  
> Built around the **Tokyo Duo** colorway: Ultra-Light Linen (`#FFFBF5`) / Golden Amber (`#FFA649`) and Slate Navy (`#283845`) with Deep Slate (`#151E25`) typography.  
> **Zero gradients · Zero glow effects · Crisp, minimal shadows.**

---

## 🎨 The Tokyo Duo Design System

| Color | Hex | Role |
|:---|:---|:---|
| **Ultra-Light Linen** | `#FFFBF5` | Clean, luminous canvas backgrounds, high-contrast surfaces |
| **Golden Amber** | `#FFA649` | Warm identity accents, highlights, and secondary tags |
| **Slate Navy** | `#283845` | Structural buttons, badges, active chips, and icon frames |
| **Deep Slate** | `#151E25` | High-contrast typography and razor-sharp text elements |

---

## ✨ Features

- 📐 **Curated Minimalist Palettes**:
  - **Tokyo Light / Amber**: Ultra-light `#FFFBF5` canvas with Slate Navy `#283845` controls.
  - **Tokyo Slate**: Deep `#283845` canvas with light accents.
  - **High-Contrast Dual**: Maximum contrast split with deep typography.
- 🚫 **Zero Gradients & Zero Glow**:
  - Pure flat design with hairline borders and subtle card elevations.
  - Clean, distraction-free reading experience for intensive AI workflows.
- ⚡ **Prompt Library & Auto-Injection**:
  - 1-click **Insert** into the active composer (ChatGPT, Claude, DeepSeek, Gemini).
  - 1-click **Copy to Clipboard**.
  - Built-in prompt management and categorization.
- 🎛️ **Quick Popup Switcher**:
  - Minimal toolbar popup with custom vector Lucide/Iconify SVGs.
  - Live AI platform detection and standby mode for non-AI tabs.
- ⚙️ **Options Dashboard**:
  - Full-page palette preview and settings manager.
  - JSON Export & Import for prompt backups.
- 🚀 **Zero External Dependencies**:
  - Pure Vanilla JavaScript, CSS, and HTML (MV3 compliant).

---

## 🌐 Supported AI Platforms

| Platform | URL Pattern | Status |
|:---|:---|:---:|
| **ChatGPT** | `https://chatgpt.com/*`, `https://chat.openai.com/*` | ✅ Supported |
| **Claude** | `https://claude.ai/*` | ✅ Supported |
| **DeepSeek** | `https://chat.deepseek.com/*` | ✅ Supported |
| **Google Gemini** | `https://gemini.google.com/*` | ✅ Supported |

---

## 📁 Project Structure

```
PromptCanvas/
├── manifest.json              # Extension Manifest V3 configuration
├── README.md                  # Documentation and setup instructions
├── .gitignore                 # Standard git ignores
├── background/
│   └── background.js          # Service worker for theme defaults & storage
├── content/
│   ├── modules/               # Theme engine, icons & composer modules
│   └── content.js             # Platform detection, theme injection & prompt insertion
├── sidebar/
│   ├── sidebar.html           # Reusable sidebar HTML markup & template
│   ├── sidebar.css            # SaaS-grade drawer, cards, and modal styles
│   └── sidebar.js             # Sidebar controller & component renderer
├── popup/
│   ├── popup.html             # Toolbar popup markup with vector SVGs
│   ├── popup.css              # Tokyo Duo popup styling
│   └── popup.js               # Popup quick switcher logic
├── options/
│   ├── options.html           # Full settings & palette options page
│   └── options.js             # Options management & JSON backup handling
├── icons/
│   ├── icon16.png             # 16x16 icon
│   ├── icon32.png             # 32x32 icon
│   ├── icon48.png             # 48x48 icon
│   └── icon128.png            # 128x128 icon
└── tools/
    └── generate-icons-py.py   # Pure Python icon generator
```

---

## 🚀 Installation Guide

1. In Chrome, Edge, or Brave, navigate to:
   ```
   chrome://extensions
   ```
2. Enable **Developer mode** (toggle in top right).
3. Click **"Load unpacked"** and select this directory.
4. If already loaded, click the **Reload (↻)** icon on the extension card.
5. Open ChatGPT, Claude, DeepSeek, or Gemini!
