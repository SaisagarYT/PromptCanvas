// PromptCanvas Curated Typography Presets & Google Fonts Registry
// Premium, Stylish, Handwriting, Goofy, and Monospace font collections

(function (root) {
  'use strict';

  const FONT_CATEGORIES = ['All', 'Premium', 'Stylish', 'Handwriting', 'Goofy', 'Monospace'];

  const FONT_PRESETS = [
    // ===== 1. PREMIUM (Modern Geometric & Editorial Sans) =====
    {
      id: 'inter',
      name: 'Inter',
      category: 'Premium',
      description: 'Modern Minimalist · Silicon Valley tech standard',
      weights: 'wght@400;500;600;700',
      sampleText: 'Pristine, hyper-legible geometric interface design.',
      popular: true
    },
    {
      id: 'outfit',
      name: 'Outfit',
      category: 'Premium',
      description: 'Geometric Luxury · Circular modern precision',
      weights: 'wght@400;500;600;700',
      sampleText: 'Sleek contemporary elegance crafted for AI workflows.',
      popular: true
    },
    {
      id: 'plusJakartaSans',
      name: 'Plus Jakarta Sans',
      category: 'Premium',
      description: 'Editorial Sans · Contemporary Indonesian agency vibe',
      weights: 'wght@400;500;600;700',
      sampleText: 'Sharp architectural proportions with premium authority.',
      popular: true
    },
    {
      id: 'spaceGrotesk',
      name: 'Space Grotesk',
      category: 'Premium',
      description: 'Brutalist Tech · Cyberpunk futuristic proportions',
      weights: 'wght@400;500;600;700',
      sampleText: 'Deep-space engineering and raw technological clarity.',
      popular: false
    },
    {
      id: 'syne',
      name: 'Syne',
      category: 'Premium',
      description: 'Avant-Garde Display · High-concept art direction',
      weights: 'wght@400;600;700;800',
      sampleText: 'Bold, expressive European creative studio typography.',
      popular: false
    },
    {
      id: 'urbanist',
      name: 'Urbanist',
      category: 'Premium',
      description: 'Geometric Modernist · Balanced digital aesthetics',
      weights: 'wght@400;500;600;700',
      sampleText: 'Smooth geometric balance inspired by modernist architecture.',
      popular: false
    },

    // ===== 2. STYLISH & LUXURY (High-Fashion, Editorial & Regal Serifs) =====
    {
      id: 'playfairDisplay',
      name: 'Playfair Display',
      category: 'Stylish',
      description: 'Haute Couture · Classic Italian fashion editorial',
      weights: 'wght@400;600;700',
      sampleText: 'Exquisite European luxury and timeless editorial grace.',
      popular: true
    },
    {
      id: 'cinzel',
      name: 'Cinzel',
      category: 'Stylish',
      description: 'Imperial Classical · Royal Roman stone inscriptions',
      weights: 'wght@400;600;700',
      sampleText: 'MAJESTIC IMPERIAL AUTHORITY AND TIMELESS LEGACY.',
      popular: true
    },
    {
      id: 'cormorantGaramond',
      name: 'Cormorant Garamond',
      category: 'Stylish',
      description: 'Poetic Literary · Delicate high-contrast serif',
      weights: 'wght@400;600;700',
      sampleText: 'Whispered literary brilliance and renaissance romance.',
      popular: false
    },
    {
      id: 'dmSans',
      name: 'DM Sans',
      category: 'Stylish',
      description: 'Scandinavian Minimal · Refined Nordic simplicity',
      weights: 'wght@400;500;700',
      sampleText: 'Quiet Scandinavian perfection designed for pure focus.',
      popular: false
    },
    {
      id: 'montserrat',
      name: 'Montserrat',
      category: 'Stylish',
      description: 'Modernist Poster · Iconic Buenos Aires geometry',
      weights: 'wght@400;500;600;700',
      sampleText: 'Urban grandeur and vintage mid-century poster spirit.',
      popular: false
    },
    {
      id: 'lora',
      name: 'Lora',
      category: 'Stylish',
      description: 'Contemporary Serif · Calligraphic storytelling warmth',
      weights: 'wght@400;600;700',
      sampleText: 'A story richly told with memorable literary warmth.',
      popular: false
    },

    // ===== 3. HANDWRITING & CURSIVE (Organic, Fluid, Expressive) =====
    {
      id: 'caveat',
      name: 'Caveat',
      category: 'Handwriting',
      description: 'Natural Ballpoint · Energetic handwritten notes',
      weights: 'wght@400;600;700',
      sampleText: 'Quick personal thoughts and organic handwritten ideas.',
      popular: true
    },
    {
      id: 'kalam',
      name: 'Kalam',
      category: 'Handwriting',
      description: 'Felt-Tip Marker · Warm genuine handwritten charm',
      weights: 'wght@400;700',
      sampleText: 'Authentic pen-to-paper charm that feels alive.',
      popular: false
    },
    {
      id: 'dancingScript',
      name: 'Dancing Script',
      category: 'Handwriting',
      description: 'Bouncy Calligraphy · Festive spirited script',
      weights: 'wght@400;600;700',
      sampleText: 'Effortlessly dancing letters with a cheerful rhythm.',
      popular: true
    },
    {
      id: 'pacifico',
      name: 'Pacifico',
      category: 'Handwriting',
      description: 'Vintage Surf Brush · 1950s California retro vibes',
      weights: '', // Single weight
      sampleText: 'Catch the wave with delicious retro brush lettering!',
      popular: true
    },
    {
      id: 'sacramento',
      name: 'Sacramento',
      category: 'Handwriting',
      description: 'Delicate Monoline · Sophisticated signature cursive',
      weights: '', // Single weight
      sampleText: 'A delicate signature of refined poise and elegance.',
      popular: false
    },
    {
      id: 'satisfy',
      name: 'Satisfy',
      category: 'Handwriting',
      description: 'Classic Ribbon Brush · Smooth timeless flow',
      weights: '', // Single weight
      sampleText: 'Smooth ribbon lettering that flows like pure liquid silk.',
      popular: false
    },

    // ===== 4. GOOFY & PLAYFUL (Fun, Bouncy, Comic & Cute) =====
    {
      id: 'comicNeue',
      name: 'Comic Neue',
      category: 'Goofy',
      description: 'Upbeat Comic Classic · Casual, friendly & upbeat',
      weights: 'wght@400;700',
      sampleText: 'The fun comic classic we all secretly adore!',
      popular: true
    },
    {
      id: 'fredoka',
      name: 'Fredoka',
      category: 'Goofy',
      description: 'Ultra Bouncy · Deliciously plump bubble letters',
      weights: 'wght@400;500;600;700',
      sampleText: 'Super cute bouncy letters full of smiles and candy!',
      popular: true
    },
    {
      id: 'chewy',
      name: 'Chewy',
      category: 'Goofy',
      description: 'Bubble Gum Cartoon · Big, goofy, cheerful fun',
      weights: '', // Single weight
      sampleText: 'Big cheerful cartoon fun that pops off the screen!',
      popular: true
    },
    {
      id: 'patrickHand',
      name: 'Patrick Hand',
      category: 'Goofy',
      description: 'School Notebook · Whimsical comic-strip doodles',
      weights: '', // Single weight
      sampleText: 'Classroom margin doodles and friendly comic sketches.',
      popular: false
    },
    {
      id: 'gaegu',
      name: 'Gaegu',
      category: 'Goofy',
      description: 'Cute Korean Doodle · Whimsical quirky hand-drawn',
      weights: 'wght@400;700',
      sampleText: 'Adorably quirky hand-drawn letters with cute energy.',
      popular: false
    },
    {
      id: 'sniglet',
      name: 'Sniglet',
      category: 'Goofy',
      description: 'Puffy Marshmallow · Sweet rounded dough letters',
      weights: 'wght@400;800',
      sampleText: 'Sweet puffy marshmallow shapes that hug your words.',
      popular: false
    },

    // ===== 5. MONOSPACE & RETRO (Hacker, Code & Terminal) =====
    {
      id: 'jetbrainsMono',
      name: 'JetBrains Mono',
      category: 'Monospace',
      description: 'Developer Standard · Crisp coding ligatures',
      weights: 'wght@400;500;600;700',
      sampleText: 'fn calculate_aura() -> Result<Aesthetic, Perfection>',
      popular: true
    },
    {
      id: 'firaCode',
      name: 'Fira Code',
      category: 'Monospace',
      description: 'Hacker Terminal · Programmer ligatures & clarity',
      weights: 'wght@400;500;600;700',
      sampleText: 'const aiModel = "gpt-4o" !== undefined => true;',
      popular: false
    },
    {
      id: 'vt323',
      name: 'VT323',
      category: 'Monospace',
      description: '8-Bit CRT Arcade · 1980s retro green-screen phosphor',
      weights: '', // Single weight
      sampleText: 'PRESS START: 01000001 01010101 01010010 01000001',
      popular: true
    }
  ];

  function getFontGoogleUrl(fontName) {
    const f = FONT_PRESETS.find(item => item.name.toLowerCase() === (fontName || '').toLowerCase()) || { name: fontName || 'Inter' };
    const encoded = encodeURIComponent(f.name).replace(/%20/g, '+');
    return f.weights
      ? `https://fonts.googleapis.com/css2?family=${encoded}:${f.weights}&display=swap`
      : `https://fonts.googleapis.com/css2?family=${encoded}&display=swap`;
  }

  function getBatchedGoogleFontsUrl(presets = FONT_PRESETS) {
    const families = presets.map(f => {
      const encoded = encodeURIComponent(f.name).replace(/%20/g, '+');
      return f.weights ? `family=${encoded}:${f.weights}` : `family=${encoded}`;
    });
    return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
  }

  const PCFonts = {
    FONT_CATEGORIES,
    FONT_PRESETS,
    getFontGoogleUrl,
    getBatchedGoogleFontsUrl
  };

  root.PCFonts = PCFonts;
  root.FONT_CATEGORIES = FONT_CATEGORIES;
  root.FONT_PRESETS = FONT_PRESETS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PCFonts;
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
