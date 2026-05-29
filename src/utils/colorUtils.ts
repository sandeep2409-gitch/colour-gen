export interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  isLocked: boolean;
  id: string;
}

// ----------------------------------------------------
// Color Space Conversions
// ----------------------------------------------------

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace(/^#/, '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// Create a full Color object from a Hex string
export function createColorObject(hex: string, isLocked = false, id = Math.random().toString(36).substr(2, 9)): Color {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return { hex: hex.toUpperCase(), rgb, hsl, isLocked, id };
}

// Create a full Color object from HSL components
export function createColorFromHsl(h: number, s: number, l: number, isLocked = false, id = Math.random().toString(36).substr(2, 9)): Color {
  const hex = hslToHex(h, s, l);
  const rgb = hexToRgb(hex);
  return { hex: hex.toUpperCase(), rgb, hsl: { h, s, l }, isLocked, id };
}

// ----------------------------------------------------
// WCAG 2.1 Contrast Calculations
// ----------------------------------------------------

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.0717 + a[2] * 0.0722;
}

export function getContrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastResult {
  ratio: number;
  scoreAA: boolean;
  scoreAALarge: boolean;
  scoreAAA: boolean;
  scoreAAALarge: boolean;
}

export function evaluateContrast(colorRgb: { r: number; g: number; b: number }, textRgb: { r: number; g: number; b: number }): ContrastResult {
  const ratio = getContrastRatio(colorRgb, textRgb);
  return {
    ratio,
    scoreAA: ratio >= 4.5,
    scoreAALarge: ratio >= 3.0,
    scoreAAA: ratio >= 7.0,
    scoreAAALarge: ratio >= 4.5
  };
}

// ----------------------------------------------------
// Harmonious Palette Generators
// ----------------------------------------------------

export const HARMONY_TYPES = {
  RANDOM: 'random',
  MONOCHROMATIC: 'monochromatic',
  ANALOGOUS: 'analogous',
  COMPLEMENTARY: 'complementary',
  SPLIT_COMPLEMENTARY: 'split-complementary',
  TRIADIC: 'triadic',
  TETRADIC: 'tetradic',
};

export const TONE_PRESETS = {
  NONE: 'none',
  PASTEL: 'pastel',
  NEON: 'neon',
  DARK: 'dark',
  MUTED: 'muted',
};

// Generates S and L ranges based on the selected tone constraints
function getToneConstraints(preset: string): { sMin: number; sMax: number; lMin: number; lMax: number } {
  switch (preset) {
    case TONE_PRESETS.PASTEL:
      return { sMin: 35, sMax: 55, lMin: 75, lMax: 88 };
    case TONE_PRESETS.NEON:
      return { sMin: 85, sMax: 100, lMin: 50, lMax: 62 };
    case TONE_PRESETS.DARK:
      return { sMin: 40, sMax: 65, lMin: 12, lMax: 26 };
    case TONE_PRESETS.MUTED:
      return { sMin: 15, sMax: 35, lMin: 35, lMax: 58 };
    case TONE_PRESETS.NONE:
    default:
      return { sMin: 30, sMax: 90, lMin: 30, lMax: 80 };
  }
}

// Helper to generate a random number within a range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePalette(
  count: number,
  currentColors: Color[],
  harmony: string = HARMONY_TYPES.RANDOM,
  tonePreset: string = TONE_PRESETS.NONE
): Color[] {
  const tone = getToneConstraints(tonePreset);

  // Find a base reference color from the first locked color in the current list
  const baseColor = currentColors.find(c => c.isLocked);
  let baseHue = baseColor ? baseColor.hsl.h : randomInRange(0, 359);
  let baseSat = baseColor ? baseColor.hsl.s : randomInRange(tone.sMin, tone.sMax);

  // If we had no locked color and harmony isn't random, we lock in our newly generated base point
  const result: Color[] = new Array(count);

  // Fill in already locked colors first to keep their exact indices and IDs
  for (let i = 0; i < count; i++) {
    if (currentColors[i] && currentColors[i].isLocked) {
      result[i] = { ...currentColors[i] };
    }
  }

  // Generate for the remaining index points
  for (let i = 0; i < count; i++) {
    if (result[i]) continue; // Skip already locked colors

    let h = baseHue;
    let s = randomInRange(tone.sMin, tone.sMax);
    let l = randomInRange(tone.lMin, tone.lMax);

    switch (harmony) {
      case HARMONY_TYPES.ANALOGOUS: {
        // Spaced out by +/- 30 degrees for each index relative to the middle
        const step = 30;
        const offset = (i - Math.floor(count / 2)) * step;
        h = (baseHue + offset + 360) % 360;
        break;
      }
      case HARMONY_TYPES.MONOCHROMATIC: {
        // Same Hue, but progressive lightness and saturation
        h = baseHue;
        // Distribute lightness smoothly across the slots
        const step = (tone.lMax - tone.lMin) / (count + 1);
        l = Math.round(tone.lMin + (i + 1) * step);
        // Vary saturation slightly to avoid complete flat steps
        s = Math.round(baseSat - 10 + (i * (20 / count)));
        s = Math.max(tone.sMin, Math.min(tone.sMax, s));
        break;
      }
      case HARMONY_TYPES.COMPLEMENTARY: {
        // Alternate between base hue and opposing hue
        h = i % 2 === 0 ? baseHue : (baseHue + 180) % 360;
        break;
      }
      case HARMONY_TYPES.SPLIT_COMPLEMENTARY: {
        if (i === 0) {
          h = baseHue;
        } else if (i % 2 === 1) {
          h = (baseHue + 150) % 360;
        } else {
          h = (baseHue + 210) % 360;
        }
        break;
      }
      case HARMONY_TYPES.TRIADIC: {
        // 0, 120, 240 degrees on the wheel
        const step = 120;
        h = (baseHue + (i % 3) * step) % 360;
        break;
      }
      case HARMONY_TYPES.TETRADIC: {
        // 0, 60, 180, 240 degrees on the wheel
        const angles = [0, 60, 180, 240];
        h = (baseHue + angles[i % 4]) % 360;
        break;
      }
      case HARMONY_TYPES.RANDOM:
      default: {
        h = randomInRange(0, 359);
        break;
      }
    }

    // Keep HSL values clamped within sensible limits
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));

    // Preserve existing color object IDs if they existed in the slot (but were unlocked)
    const existingId = currentColors[i] ? currentColors[i].id : undefined;
    result[i] = createColorFromHsl(h, s, l, false, existingId);
  }

  return result;
}
