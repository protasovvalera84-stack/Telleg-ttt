import type { AppearanceConfig } from '@/components/settings/AppearanceSettings';

/* ── Theme preset definition ── */

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  config: AppearanceConfig;
  /** CSS variable overrides applied on top of the config. */
  cssOverrides: Record<string, string>;
  /** Accent palette alternatives for seed-based variation. */
  accentHues: number[];
  /** Alternative icon style for variation. */
  altIconStyle?: 'outline' | 'filled';
}

/* ── Seed-based variation engine ── */

export type VariationModifier = 'paletteShift' | 'density' | 'cornerStyle' | 'shadowIntensity' | 'patternOverlay' | 'iconSwap';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface ThemeVariation {
  hueShift: number;
  density: 'compact' | 'normal' | 'spacious';
  cornerStyle: 'none' | 'small' | 'medium' | 'large' | 'full';
  shadowIntensity: 'none' | 'light' | 'heavy';
  patternOverlay: boolean;
  iconSwap: boolean;
}

export function generateVariation(preset: ThemePreset, seed?: number): ThemeVariation {
  const rng = seededRandom(seed ?? Date.now());

  const hueOptions = preset.accentHues.length > 0 ? preset.accentHues : [0];
  const hueShift = hueOptions[Math.floor(rng() * hueOptions.length)];

  const densities: ThemeVariation['density'][] = ['compact', 'normal', 'spacious'];
  const corners: ThemeVariation['cornerStyle'][] = ['none', 'small', 'medium', 'large', 'full'];
  const shadows: ThemeVariation['shadowIntensity'][] = ['none', 'light', 'heavy'];

  return {
    hueShift,
    density: densities[Math.floor(rng() * densities.length)],
    cornerStyle: corners[Math.floor(rng() * corners.length)],
    shadowIntensity: shadows[Math.floor(rng() * shadows.length)],
    patternOverlay: rng() > 0.5,
    iconSwap: rng() > 0.7,
  };
}

export function applyVariationToConfig(config: AppearanceConfig, variation: ThemeVariation): AppearanceConfig {
  return {
    ...config,
    uiScale: variation.density,
    borderRadius: variation.cornerStyle,
  };
}

export function getVariationCSSOverrides(variation: ThemeVariation, baseHue: string): Record<string, string> {
  const h = variation.hueShift !== 0 ? String(variation.hueShift) : baseHue;
  const vars: Record<string, string> = {
    '--primary': `${h} 100% 52%`,
    '--accent': `${h} 100% 52%`,
    '--ring': `${h} 100% 52%`,
    '--chat-active': `${h} 60% 25%`,
    '--chat-bubble-own': `${h} 100% 52%`,
    '--sidebar-primary': `${h} 100% 52%`,
    '--sidebar-ring': `${h} 100% 52%`,
    '--admin-accent': `${h} 83% 58%`,
  };
  return vars;
}

/* ── 20 Theme presets ── */

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'midnight-violet', name: 'Полночный фиолет', description: 'Глубокий тёмный с фиолетовыми акцентами', emoji: '🌌',
    config: { colorTheme: 'purple', fontSize: 'medium', bubbleStyle: 'rounded', chatBackground: 'default', fontFamily: 'space', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '250 25% 5%', '--card': '250 20% 8%' }, accentHues: [262, 280, 290],
  },
  {
    id: 'ocean-blue', name: 'Океан', description: 'Спокойный синий как глубокое море', emoji: '🌊',
    config: { colorTheme: 'blue', fontSize: 'medium', bubbleStyle: 'classic', chatBackground: 'gradient', fontFamily: 'inter', uiScale: 'normal', borderRadius: 'large', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '215 30% 6%', '--card': '215 25% 9%' }, accentHues: [210, 220, 200],
  },
  {
    id: 'emerald-forest', name: 'Изумрудный лес', description: 'Природные зелёные тона', emoji: '🌲',
    config: { colorTheme: 'green', fontSize: 'medium', bubbleStyle: 'rounded', chatBackground: 'aurora', fontFamily: 'roboto', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: false, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '160 20% 5%', '--card': '160 15% 8%' }, accentHues: [152, 140, 165],
  },
  {
    id: 'sakura-pink', name: 'Сакура', description: 'Нежный розовый японский стиль', emoji: '🌸',
    config: { colorTheme: 'pink', fontSize: 'medium', bubbleStyle: 'pill', chatBackground: 'dots', fontFamily: 'montserrat', uiScale: 'normal', borderRadius: 'full', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '330 15% 6%', '--card': '330 12% 9%' }, accentHues: [330, 340, 320],
  },
  {
    id: 'sunset-orange', name: 'Закат', description: 'Тёплые оранжевые тона заката', emoji: '🌅',
    config: { colorTheme: 'orange', fontSize: 'medium', bubbleStyle: 'classic', chatBackground: 'gradient', fontFamily: 'space', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '25 20% 5%', '--card': '25 15% 8%' }, accentHues: [25, 15, 35],
  },
  {
    id: 'arctic-teal', name: 'Арктика', description: 'Холодный бирюзовый лёд', emoji: '🧊',
    config: { colorTheme: 'teal', fontSize: 'small', bubbleStyle: 'rect', chatBackground: 'mesh', fontFamily: 'inter', uiScale: 'compact', borderRadius: 'small', sidebarWidth: 'narrow', animations: false, glassEffects: false, showTimestamps: true, compactMessages: true },
    cssOverrides: { '--background': '180 20% 5%', '--card': '180 15% 8%' }, accentHues: [180, 170, 190],
  },
  {
    id: 'crimson-fire', name: 'Пламя', description: 'Огненный красный стиль', emoji: '🔥',
    config: { colorTheme: 'red', fontSize: 'medium', bubbleStyle: 'sharp', chatBackground: 'dark', fontFamily: 'roboto', uiScale: 'normal', borderRadius: 'none', sidebarWidth: 'normal', animations: true, glassEffects: false, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '0 15% 5%', '--card': '0 12% 8%' }, accentHues: [0, 350, 10],
  },
  {
    id: 'royal-indigo', name: 'Королевский', description: 'Благородный индиго', emoji: '👑',
    config: { colorTheme: 'indigo', fontSize: 'large', bubbleStyle: 'rounded', chatBackground: 'aurora', fontFamily: 'montserrat', uiScale: 'spacious', borderRadius: 'large', sidebarWidth: 'wide', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '240 25% 5%', '--card': '240 20% 8%' }, accentHues: [240, 250, 230],
  },
  {
    id: 'cyber-cyan', name: 'Кибер', description: 'Неоновый киберпанк', emoji: '🤖',
    config: { colorTheme: 'cyan', fontSize: 'small', bubbleStyle: 'sharp', chatBackground: 'mesh', fontFamily: 'space', uiScale: 'compact', borderRadius: 'none', sidebarWidth: 'narrow', animations: true, glassEffects: true, showTimestamps: false, compactMessages: true },
    cssOverrides: { '--background': '190 25% 4%', '--card': '190 20% 7%' }, accentHues: [190, 180, 200],
  },
  {
    id: 'golden-amber', name: 'Золотой', description: 'Роскошный золотой стиль', emoji: '✨',
    config: { colorTheme: 'amber', fontSize: 'medium', bubbleStyle: 'classic', chatBackground: 'gradient', fontFamily: 'montserrat', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '38 20% 5%', '--card': '38 15% 8%' }, accentHues: [38, 45, 30],
  },
  {
    id: 'minimal-mono', name: 'Минимализм', description: 'Чистый монохромный дизайн', emoji: '⬜',
    config: { colorTheme: 'blue', fontSize: 'medium', bubbleStyle: 'rect', chatBackground: 'default', fontFamily: 'inter', uiScale: 'normal', borderRadius: 'small', sidebarWidth: 'normal', animations: false, glassEffects: false, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '0 0% 5%', '--card': '0 0% 8%', '--primary': '0 0% 70%' }, accentHues: [],
  },
  {
    id: 'neon-nights', name: 'Неон', description: 'Яркие неоновые огни ночного города', emoji: '🌃',
    config: { colorTheme: 'pink', fontSize: 'medium', bubbleStyle: 'pill', chatBackground: 'dark', fontFamily: 'space', uiScale: 'normal', borderRadius: 'full', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '280 20% 4%', '--card': '280 15% 7%' }, accentHues: [330, 280, 200],
  },
  {
    id: 'earth-tones', name: 'Земля', description: 'Тёплые природные тона', emoji: '🍂',
    config: { colorTheme: 'orange', fontSize: 'medium', bubbleStyle: 'classic', chatBackground: 'default', fontFamily: 'roboto', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: false, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '30 15% 6%', '--card': '30 12% 9%' }, accentHues: [25, 35, 15],
  },
  {
    id: 'lavender-dream', name: 'Лаванда', description: 'Мягкий лавандовый сон', emoji: '💜',
    config: { colorTheme: 'purple', fontSize: 'large', bubbleStyle: 'rounded', chatBackground: 'aurora', fontFamily: 'montserrat', uiScale: 'spacious', borderRadius: 'large', sidebarWidth: 'wide', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '270 20% 6%', '--card': '270 15% 9%' }, accentHues: [270, 260, 280],
  },
  {
    id: 'matrix-green', name: 'Матрица', description: 'Зелёный код в стиле Matrix', emoji: '💚',
    config: { colorTheme: 'green', fontSize: 'small', bubbleStyle: 'sharp', chatBackground: 'mesh', fontFamily: 'space', uiScale: 'compact', borderRadius: 'none', sidebarWidth: 'narrow', animations: true, glassEffects: false, showTimestamps: false, compactMessages: true },
    cssOverrides: { '--background': '120 20% 3%', '--card': '120 15% 6%' }, accentHues: [120, 130, 140],
  },
  {
    id: 'coral-reef', name: 'Коралл', description: 'Подводный мир кораллов', emoji: '🐠',
    config: { colorTheme: 'red', fontSize: 'medium', bubbleStyle: 'rounded', chatBackground: 'waves', fontFamily: 'inter', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '10 18% 5%', '--card': '10 14% 8%' }, accentHues: [10, 350, 20],
  },
  {
    id: 'space-dark', name: 'Космос', description: 'Глубокий космический мрак', emoji: '🚀',
    config: { colorTheme: 'indigo', fontSize: 'medium', bubbleStyle: 'classic', chatBackground: 'stars', fontFamily: 'space', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '240 30% 3%', '--card': '240 25% 6%' }, accentHues: [240, 260, 220],
  },
  {
    id: 'pastel-soft', name: 'Пастель', description: 'Мягкие пастельные тона', emoji: '🎨',
    config: { colorTheme: 'teal', fontSize: 'medium', bubbleStyle: 'pill', chatBackground: 'gradient', fontFamily: 'montserrat', uiScale: 'spacious', borderRadius: 'full', sidebarWidth: 'wide', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '180 15% 7%', '--card': '180 12% 10%' }, accentHues: [180, 200, 160],
  },
  {
    id: 'hacker-terminal', name: 'Терминал', description: 'Стиль хакерского терминала', emoji: '💻',
    config: { colorTheme: 'green', fontSize: 'tiny', bubbleStyle: 'sharp', chatBackground: 'dark', fontFamily: 'roboto', uiScale: 'compact', borderRadius: 'none', sidebarWidth: 'narrow', animations: false, glassEffects: false, showTimestamps: true, compactMessages: true },
    cssOverrides: { '--background': '0 0% 2%', '--card': '0 0% 5%' }, accentHues: [120, 130],
  },
  {
    id: 'aurora-borealis', name: 'Северное сияние', description: 'Переливы полярного сияния', emoji: '🌈',
    config: { colorTheme: 'cyan', fontSize: 'medium', bubbleStyle: 'rounded', chatBackground: 'aurora', fontFamily: 'space', uiScale: 'normal', borderRadius: 'large', sidebarWidth: 'normal', animations: true, glassEffects: true, showTimestamps: true, compactMessages: false },
    cssOverrides: { '--background': '200 25% 5%', '--card': '200 20% 8%' }, accentHues: [190, 160, 270, 300],
  },
];
