// PromptCanvas Active Color Studio Designer Presets

(function (root) {
  'use strict';

  const DESIGNER_PRESETS = [
    {
      id: 'tokyoDuo',
      num: '00',
      name: 'Tokyo Duo',
      desc: 'Flagship · Warm & Architectural',
      canvas: '#FFFBF5',
      controls: '#283845',
      text: '#151E25',
      accent: '#FFA649',
      swatches: ['#283845', '#151E25', '#FFA649', '#FFE8D1', '#FFFBF5'],
    },
    {
      id: 'sunsetVibes',
      num: '04',
      name: 'Sunset Vibes',
      desc: 'Warm · Energetic · Friendly',
      canvas: '#FFF7ED',
      controls: '#F97316',
      text: '#7C2D12',
      accent: '#FB923C',
      swatches: ['#F97316', '#FB923C', '#FDBA74', '#FFF7ED', '#7C2D12'],
    },
    {
      id: 'oceanBreeze',
      num: '02',
      name: 'Ocean Breeze',
      desc: 'Calm · Fresh · Trustworthy',
      canvas: '#E0F2FE',
      controls: '#0EA5E9',
      text: '#0F172A',
      accent: '#38BDF8',
      swatches: ['#0EA5E9', '#38BDF8', '#BAE6FD', '#E0F2FE', '#0F172A'],
    },
    {
      id: 'natureGreen',
      num: '03',
      name: 'Nature Green',
      desc: 'Natural · Balanced · Calm',
      canvas: '#F0FDF4',
      controls: '#16A34A',
      text: '#14532D',
      accent: '#4ADE80',
      swatches: ['#16A34A', '#4ADE80', '#BBF7D0', '#F0FDF4', '#14532D'],
    },
    {
      id: 'modernPurple',
      num: '01',
      name: 'Modern Purple',
      desc: 'Creative · Modern · Premium',
      canvas: '#F5F3FF',
      controls: '#6D28D9',
      text: '#1F2937',
      accent: '#8B5CF6',
      swatches: ['#6D28D9', '#8B5CF6', '#C4B5FD', '#F5F3FF', '#1F2937'],
    },
    {
      id: 'deepBlue',
      num: '06',
      name: 'Deep Blue',
      desc: 'Professional · Strong · Reliable',
      canvas: '#EFF6FF',
      controls: '#1E3A8A',
      text: '#0B1220',
      accent: '#2563EB',
      swatches: ['#1E3A8A', '#2563EB', '#93C5FD', '#EFF6FF', '#0B1220'],
    },
    {
      id: 'tealHarmony',
      num: '08',
      name: 'Teal Harmony',
      desc: 'Modern · Clean · Balanced',
      canvas: '#ECFEFF',
      controls: '#14B8A6',
      text: '#134E4A',
      accent: '#2DD4BF',
      swatches: ['#14B8A6', '#2DD4BF', '#99F6E4', '#ECFEFF', '#134E4A'],
    },
    {
      id: 'blushPink',
      num: '05',
      name: 'Blush Pink',
      desc: 'Soft · Feminine · Elegant',
      canvas: '#FDF2F8',
      controls: '#EC4899',
      text: '#831843',
      accent: '#F472B6',
      swatches: ['#EC4899', '#F472B6', '#FBCFE8', '#FDF2F8', '#831843'],
    },
    {
      id: 'brightYellow',
      num: '07',
      name: 'Bright Yellow',
      desc: 'Cheerful · Optimistic · Bold',
      canvas: '#FFFBEB',
      controls: '#EAB308',
      text: '#713F12',
      accent: '#FACC15',
      swatches: ['#EAB308', '#FACC15', '#FDE68A', '#FFFBEB', '#713F12'],
    },
    {
      id: 'royalDark',
      num: '09',
      name: 'Royal Dark',
      desc: 'Luxury · Elegant · Sophisticated',
      canvas: '#EDE9FE',
      controls: '#4C1D95',
      text: '#111827',
      accent: '#6D28D9',
      swatches: ['#4C1D95', '#6D28D9', '#A78BFA', '#EDE9FE', '#111827'],
    },
    {
      id: 'minimalNeutral',
      num: '10',
      name: 'Minimal Neutral',
      desc: 'Clean · Simple · Timeless',
      canvas: '#F3F4F6',
      controls: '#374151',
      text: '#111827',
      accent: '#6B7280',
      swatches: ['#374151', '#6B7280', '#D1D5DB', '#F3F4F6', '#111827'],
    },
  ];

  const PCDesignerPresets = {
    DESIGNER_PRESETS
  };

  root.PCDesignerPresets = PCDesignerPresets;
  root.DESIGNER_PRESETS = DESIGNER_PRESETS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCDesignerPresets;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
