import type { AppearanceConfig } from '@/components/settings/AppearanceSettings';

/* ── Layout variants ── */

export type SidebarPosition = 'left' | 'right' | 'none';
export type HeaderStyle = 'inline' | 'floating' | 'minimal';

export interface LayoutVariant {
  id: string;
  name: string;
  sidebarPosition: SidebarPosition;
  sidebarWidth: string;
  headerStyle: HeaderStyle;
  /** Extra CSS classes applied to the root container. */
  rootClass: string;
  /** Extra CSS classes applied to the sidebar. */
  sidebarClass: string;
  /** Extra CSS classes applied to the content area. */
  contentClass: string;
}

/* ── Theme preset definition ── */

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  emoji: string;
  config: AppearanceConfig;
  cssOverrides: Record<string, string>;
  accentHues: number[];
  layoutVariants: LayoutVariant[];
}

/* ── Seed-based variation engine ── */

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
  layoutVariantId: string;
}

export function generateVariation(preset: ThemePreset, seed?: number): ThemeVariation {
  const rng = seededRandom(seed ?? Date.now());
  const hueOptions = preset.accentHues.length > 0 ? preset.accentHues : [0];
  const densities: ThemeVariation['density'][] = ['compact', 'normal', 'spacious'];
  const corners: ThemeVariation['cornerStyle'][] = ['none', 'small', 'medium', 'large', 'full'];
  const shadows: ThemeVariation['shadowIntensity'][] = ['none', 'light', 'heavy'];
  const lvIdx = Math.floor(rng() * preset.layoutVariants.length);

  return {
    hueShift: hueOptions[Math.floor(rng() * hueOptions.length)],
    density: densities[Math.floor(rng() * densities.length)],
    cornerStyle: corners[Math.floor(rng() * corners.length)],
    shadowIntensity: shadows[Math.floor(rng() * shadows.length)],
    patternOverlay: rng() > 0.5,
    layoutVariantId: preset.layoutVariants[lvIdx]?.id || 'default',
  };
}

export function applyVariationToConfig(config: AppearanceConfig, variation: ThemeVariation): AppearanceConfig {
  return { ...config, uiScale: variation.density, borderRadius: variation.cornerStyle };
}

export function getVariationCSSOverrides(variation: ThemeVariation, baseHue: string): Record<string, string> {
  const h = variation.hueShift !== 0 ? String(variation.hueShift) : baseHue;
  return {
    '--primary': `${h} 100% 52%`, '--accent': `${h} 100% 52%`, '--ring': `${h} 100% 52%`,
    '--chat-active': `${h} 60% 25%`, '--chat-bubble-own': `${h} 100% 52%`,
    '--sidebar-primary': `${h} 100% 52%`, '--sidebar-ring': `${h} 100% 52%`,
    '--admin-accent': `${h} 83% 58%`,
  };
}

/* ── Shared layout variant sets ── */

const LV_CLASSIC_LEFT: LayoutVariant = { id: 'classic-left', name: 'Классика (лево)', sidebarPosition: 'left', sidebarWidth: 'w-80 xl:w-96', headerStyle: 'inline', rootClass: 'flex-row', sidebarClass: '', contentClass: '' };
const LV_CLASSIC_RIGHT: LayoutVariant = { id: 'classic-right', name: 'Классика (право)', sidebarPosition: 'right', sidebarWidth: 'w-80 xl:w-96', headerStyle: 'inline', rootClass: 'flex-row-reverse', sidebarClass: '', contentClass: '' };
const LV_NARROW_LEFT: LayoutVariant = { id: 'narrow-left', name: 'Узкая панель', sidebarPosition: 'left', sidebarWidth: 'w-64', headerStyle: 'minimal', rootClass: 'flex-row', sidebarClass: '', contentClass: '' };
const LV_WIDE_LEFT: LayoutVariant = { id: 'wide-left', name: 'Широкая панель', sidebarPosition: 'left', sidebarWidth: 'w-96 xl:w-[28rem]', headerStyle: 'inline', rootClass: 'flex-row', sidebarClass: '', contentClass: '' };
const LV_NARROW_RIGHT: LayoutVariant = { id: 'narrow-right', name: 'Узкая (право)', sidebarPosition: 'right', sidebarWidth: 'w-64', headerStyle: 'minimal', rootClass: 'flex-row-reverse', sidebarClass: '', contentClass: '' };
const LV_FLOATING: LayoutVariant = { id: 'floating', name: 'Плавающая панель', sidebarPosition: 'left', sidebarWidth: 'w-80', headerStyle: 'floating', rootClass: 'flex-row p-2 gap-2', sidebarClass: 'rounded-2xl overflow-hidden', contentClass: 'rounded-2xl overflow-hidden' };
const LV_FLOATING_RIGHT: LayoutVariant = { id: 'floating-right', name: 'Плавающая (право)', sidebarPosition: 'right', sidebarWidth: 'w-80', headerStyle: 'floating', rootClass: 'flex-row-reverse p-2 gap-2', sidebarClass: 'rounded-2xl overflow-hidden', contentClass: 'rounded-2xl overflow-hidden' };
const LV_COMPACT: LayoutVariant = { id: 'compact', name: 'Компактный', sidebarPosition: 'left', sidebarWidth: 'w-72', headerStyle: 'minimal', rootClass: 'flex-row', sidebarClass: '', contentClass: '' };

/* ── Helper to build a preset ── */

function p(
  id: string, name: string, desc: string, emoji: string,
  config: AppearanceConfig, css: Record<string, string>,
  hues: number[], layouts: LayoutVariant[],
): ThemePreset {
  return { id, name, description: desc, emoji, config, cssOverrides: css, accentHues: hues, layoutVariants: layouts };
}

const C = (overrides: Partial<AppearanceConfig>): AppearanceConfig => ({
  colorTheme: 'purple', fontSize: 'medium', bubbleStyle: 'rounded', chatBackground: 'default',
  fontFamily: 'space', uiScale: 'normal', borderRadius: 'medium', sidebarWidth: 'normal',
  animations: true, glassEffects: true, showTimestamps: true, compactMessages: false,
  ...overrides,
});

/* ── 20 Theme presets ── */

export const THEME_PRESETS: ThemePreset[] = [
  p('midnight-violet', 'Полночный фиолет', 'Глубокий тёмный с фиолетовыми акцентами', '🌌',
    C({}), { '--background': '250 25% 5%', '--card': '250 20% 8%' }, [262, 280, 290],
    [LV_CLASSIC_LEFT, LV_FLOATING, LV_WIDE_LEFT, LV_CLASSIC_RIGHT]),

  p('ocean-blue', 'Океан', 'Спокойный синий как глубокое море', '🌊',
    C({ colorTheme: 'blue', bubbleStyle: 'classic', chatBackground: 'gradient', fontFamily: 'inter', borderRadius: 'large' }),
    { '--background': '215 30% 6%', '--card': '215 25% 9%' }, [210, 220, 200],
    [LV_CLASSIC_LEFT, LV_CLASSIC_RIGHT, LV_FLOATING, LV_NARROW_LEFT]),

  p('emerald-forest', 'Изумрудный лес', 'Природные зелёные тона', '🌲',
    C({ colorTheme: 'green', chatBackground: 'aurora', fontFamily: 'roboto', glassEffects: false }),
    { '--background': '160 20% 5%', '--card': '160 15% 8%' }, [152, 140, 165],
    [LV_CLASSIC_LEFT, LV_WIDE_LEFT, LV_NARROW_RIGHT, LV_COMPACT]),

  p('sakura-pink', 'Сакура', 'Нежный розовый японский стиль', '🌸',
    C({ colorTheme: 'pink', bubbleStyle: 'pill', chatBackground: 'dots', fontFamily: 'montserrat', borderRadius: 'full' }),
    { '--background': '330 15% 6%', '--card': '330 12% 9%' }, [330, 340, 320],
    [LV_FLOATING, LV_FLOATING_RIGHT, LV_CLASSIC_LEFT, LV_WIDE_LEFT]),

  p('sunset-orange', 'Закат', 'Тёплые оранжевые тона заката', '🌅',
    C({ colorTheme: 'orange', bubbleStyle: 'classic', chatBackground: 'gradient' }),
    { '--background': '25 20% 5%', '--card': '25 15% 8%' }, [25, 15, 35],
    [LV_CLASSIC_LEFT, LV_CLASSIC_RIGHT, LV_FLOATING, LV_NARROW_LEFT]),

  p('arctic-teal', 'Арктика', 'Холодный бирюзовый лёд', '🧊',
    C({ colorTheme: 'teal', fontSize: 'small', bubbleStyle: 'rect', chatBackground: 'mesh', fontFamily: 'inter', uiScale: 'compact', borderRadius: 'small', sidebarWidth: 'narrow', animations: false, glassEffects: false, compactMessages: true }),
    { '--background': '180 20% 5%', '--card': '180 15% 8%' }, [180, 170, 190],
    [LV_COMPACT, LV_NARROW_LEFT, LV_NARROW_RIGHT, LV_CLASSIC_LEFT]),

  p('crimson-fire', 'Пламя', 'Огненный красный стиль', '🔥',
    C({ colorTheme: 'red', bubbleStyle: 'sharp', chatBackground: 'dark', fontFamily: 'roboto', borderRadius: 'none', glassEffects: false }),
    { '--background': '0 15% 5%', '--card': '0 12% 8%' }, [0, 350, 10],
    [LV_CLASSIC_LEFT, LV_CLASSIC_RIGHT, LV_NARROW_LEFT, LV_COMPACT]),

  p('royal-indigo', 'Королевский', 'Благородный индиго', '👑',
    C({ colorTheme: 'indigo', fontSize: 'large', chatBackground: 'aurora', fontFamily: 'montserrat', uiScale: 'spacious', borderRadius: 'large', sidebarWidth: 'wide' }),
    { '--background': '240 25% 5%', '--card': '240 20% 8%' }, [240, 250, 230],
    [LV_WIDE_LEFT, LV_FLOATING, LV_CLASSIC_LEFT, LV_FLOATING_RIGHT]),

  p('cyber-cyan', 'Кибер', 'Неоновый киберпанк', '🤖',
    C({ colorTheme: 'cyan', fontSize: 'small', bubbleStyle: 'sharp', chatBackground: 'mesh', uiScale: 'compact', borderRadius: 'none', sidebarWidth: 'narrow', showTimestamps: false, compactMessages: true }),
    { '--background': '190 25% 4%', '--card': '190 20% 7%' }, [190, 180, 200],
    [LV_COMPACT, LV_NARROW_LEFT, LV_CLASSIC_LEFT, LV_NARROW_RIGHT]),

  p('golden-amber', 'Золотой', 'Роскошный золотой стиль', '✨',
    C({ colorTheme: 'amber', bubbleStyle: 'classic', chatBackground: 'gradient', fontFamily: 'montserrat' }),
    { '--background': '38 20% 5%', '--card': '38 15% 8%' }, [38, 45, 30],
    [LV_CLASSIC_LEFT, LV_FLOATING, LV_WIDE_LEFT, LV_CLASSIC_RIGHT]),

  p('minimal-mono', 'Минимализм', 'Чистый монохромный дизайн', '⬜',
    C({ colorTheme: 'blue', bubbleStyle: 'rect', fontFamily: 'inter', borderRadius: 'small', animations: false, glassEffects: false }),
    { '--background': '0 0% 5%', '--card': '0 0% 8%', '--primary': '0 0% 70%' }, [],
    [LV_CLASSIC_LEFT, LV_NARROW_LEFT, LV_COMPACT, LV_CLASSIC_RIGHT]),

  p('neon-nights', 'Неон', 'Яркие неоновые огни ночного города', '🌃',
    C({ colorTheme: 'pink', bubbleStyle: 'pill', chatBackground: 'dark', borderRadius: 'full' }),
    { '--background': '280 20% 4%', '--card': '280 15% 7%' }, [330, 280, 200],
    [LV_FLOATING, LV_FLOATING_RIGHT, LV_CLASSIC_LEFT, LV_WIDE_LEFT]),

  p('earth-tones', 'Земля', 'Тёплые природные тона', '🍂',
    C({ colorTheme: 'orange', bubbleStyle: 'classic', fontFamily: 'roboto', glassEffects: false }),
    { '--background': '30 15% 6%', '--card': '30 12% 9%' }, [25, 35, 15],
    [LV_CLASSIC_LEFT, LV_WIDE_LEFT, LV_CLASSIC_RIGHT, LV_NARROW_LEFT]),

  p('lavender-dream', 'Лаванда', 'Мягкий лавандовый сон', '💜',
    C({ colorTheme: 'purple', fontSize: 'large', chatBackground: 'aurora', fontFamily: 'montserrat', uiScale: 'spacious', borderRadius: 'large', sidebarWidth: 'wide' }),
    { '--background': '270 20% 6%', '--card': '270 15% 9%' }, [270, 260, 280],
    [LV_WIDE_LEFT, LV_FLOATING, LV_FLOATING_RIGHT, LV_CLASSIC_LEFT]),

  p('matrix-green', 'Матрица', 'Зелёный код в стиле Matrix', '💚',
    C({ colorTheme: 'green', fontSize: 'small', bubbleStyle: 'sharp', chatBackground: 'mesh', uiScale: 'compact', borderRadius: 'none', sidebarWidth: 'narrow', showTimestamps: false, compactMessages: true, glassEffects: false }),
    { '--background': '120 20% 3%', '--card': '120 15% 6%' }, [120, 130, 140],
    [LV_COMPACT, LV_NARROW_LEFT, LV_NARROW_RIGHT, LV_CLASSIC_LEFT]),

  p('coral-reef', 'Коралл', 'Подводный мир кораллов', '🐠',
    C({ colorTheme: 'red', chatBackground: 'waves', fontFamily: 'inter' }),
    { '--background': '10 18% 5%', '--card': '10 14% 8%' }, [10, 350, 20],
    [LV_CLASSIC_LEFT, LV_FLOATING, LV_CLASSIC_RIGHT, LV_WIDE_LEFT]),

  p('space-dark', 'Космос', 'Глубокий космический мрак', '🚀',
    C({ colorTheme: 'indigo', bubbleStyle: 'classic', chatBackground: 'stars' }),
    { '--background': '240 30% 3%', '--card': '240 25% 6%' }, [240, 260, 220],
    [LV_CLASSIC_LEFT, LV_FLOATING, LV_FLOATING_RIGHT, LV_NARROW_LEFT]),

  p('pastel-soft', 'Пастель', 'Мягкие пастельные тона', '🎨',
    C({ colorTheme: 'teal', bubbleStyle: 'pill', chatBackground: 'gradient', fontFamily: 'montserrat', uiScale: 'spacious', borderRadius: 'full', sidebarWidth: 'wide' }),
    { '--background': '180 15% 7%', '--card': '180 12% 10%' }, [180, 200, 160],
    [LV_WIDE_LEFT, LV_FLOATING, LV_CLASSIC_LEFT, LV_FLOATING_RIGHT]),

  p('hacker-terminal', 'Терминал', 'Стиль хакерского терминала', '💻',
    C({ colorTheme: 'green', fontSize: 'tiny', bubbleStyle: 'sharp', chatBackground: 'dark', fontFamily: 'roboto', uiScale: 'compact', borderRadius: 'none', sidebarWidth: 'narrow', animations: false, glassEffects: false, compactMessages: true }),
    { '--background': '0 0% 2%', '--card': '0 0% 5%' }, [120, 130],
    [LV_COMPACT, LV_NARROW_LEFT, LV_NARROW_RIGHT, LV_CLASSIC_LEFT]),

  p('aurora-borealis', 'Северное сияние', 'Переливы полярного сияния', '🌈',
    C({ colorTheme: 'cyan', chatBackground: 'aurora', borderRadius: 'large' }),
    { '--background': '200 25% 5%', '--card': '200 20% 8%' }, [190, 160, 270, 300],
    [LV_CLASSIC_LEFT, LV_FLOATING, LV_CLASSIC_RIGHT, LV_WIDE_LEFT]),
];
