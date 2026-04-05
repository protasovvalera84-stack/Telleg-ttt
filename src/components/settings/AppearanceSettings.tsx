import { ArrowLeft, Palette, Type, MessageSquare, Wallpaper, Check, Monitor, Square, Sparkles, SunMoon, Maximize2, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/* ── Types ── */

export type ColorTheme = 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'teal' | 'red' | 'indigo' | 'cyan' | 'amber';
export type FontSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';
export type BubbleStyle = 'rounded' | 'rect' | 'classic' | 'sharp' | 'pill';
export type ChatBackground = 'default' | 'dots' | 'gradient' | 'mesh' | 'aurora' | 'stars' | 'waves' | 'dark';
export type FontFamily = 'space' | 'inter' | 'roboto' | 'montserrat';
export type UIScale = 'compact' | 'normal' | 'spacious';
export type BorderRadius = 'none' | 'small' | 'medium' | 'large' | 'full';
export type SidebarWidth = 'narrow' | 'normal' | 'wide';

export interface AppearanceConfig {
  colorTheme: ColorTheme;
  fontSize: FontSize;
  bubbleStyle: BubbleStyle;
  chatBackground: ChatBackground;
  fontFamily: FontFamily;
  uiScale: UIScale;
  borderRadius: BorderRadius;
  sidebarWidth: SidebarWidth;
  animations: boolean;
  glassEffects: boolean;
  showTimestamps: boolean;
  compactMessages: boolean;
}

export const DEFAULT_APPEARANCE: AppearanceConfig = {
  colorTheme: 'purple',
  fontSize: 'medium',
  bubbleStyle: 'rounded',
  chatBackground: 'default',
  fontFamily: 'space',
  uiScale: 'normal',
  borderRadius: 'medium',
  sidebarWidth: 'normal',
  animations: true,
  glassEffects: true,
  showTimestamps: true,
  compactMessages: false,
};

/* ── Theme definitions ── */

const COLOR_THEMES: Record<ColorTheme, { label: string; hue: string; color: string }> = {
  purple: { label: 'Фиолетовая', hue: '262', color: 'bg-purple-500' },
  blue:   { label: 'Синяя',      hue: '210', color: 'bg-blue-500' },
  green:  { label: 'Зелёная',    hue: '152', color: 'bg-emerald-500' },
  pink:   { label: 'Розовая',    hue: '330', color: 'bg-pink-500' },
  orange: { label: 'Оранжевая',  hue: '25',  color: 'bg-orange-500' },
  teal:   { label: 'Бирюзовая',  hue: '180', color: 'bg-teal-500' },
  red:    { label: 'Красная',    hue: '0',   color: 'bg-red-500' },
  indigo: { label: 'Индиго',     hue: '240', color: 'bg-indigo-500' },
  cyan:   { label: 'Голубая',    hue: '190', color: 'bg-cyan-500' },
  amber:  { label: 'Янтарная',   hue: '38',  color: 'bg-amber-500' },
};

const FONT_SIZES: Record<FontSize, { label: string; cls: string }> = {
  tiny:   { label: 'Крошечный', cls: 'text-[11px]' },
  small:  { label: 'Маленький', cls: 'text-xs' },
  medium: { label: 'Средний',   cls: 'text-sm' },
  large:  { label: 'Большой',   cls: 'text-base' },
  xlarge: { label: 'Огромный',  cls: 'text-lg' },
};

const BUBBLE_STYLES: Record<BubbleStyle, { label: string; own: string; other: string }> = {
  rounded: { label: 'Скруглённые', own: 'rounded-[18px] rounded-br-[4px]', other: 'rounded-[18px] rounded-bl-[4px]' },
  rect:    { label: 'Прямоугольные', own: 'rounded-lg', other: 'rounded-lg' },
  classic: { label: 'Классические', own: 'rounded-2xl rounded-br-sm', other: 'rounded-2xl rounded-bl-sm' },
  sharp:   { label: 'Острые', own: 'rounded-none', other: 'rounded-none' },
  pill:    { label: 'Капсулы', own: 'rounded-full', other: 'rounded-full' },
};

const BACKGROUNDS: Record<ChatBackground, { label: string; style: string }> = {
  default: { label: 'Стандартный', style: '' },
  dots:    { label: 'Точки', style: 'bg-[radial-gradient(circle,hsl(var(--muted))_1px,transparent_1px)] bg-[length:20px_20px]' },
  gradient:{ label: 'Градиент', style: 'bg-gradient-to-b from-background to-muted/30' },
  mesh:    { label: 'Сетка', style: 'bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[length:32px_32px]' },
  aurora:  { label: 'Аврора', style: 'bg-gradient-to-br from-violet-950/20 via-fuchsia-950/10 to-cyan-950/15' },
  stars:   { label: 'Звёзды', style: 'bg-[radial-gradient(2px_2px_at_20px_30px,hsl(var(--muted-foreground)/0.3),transparent),radial-gradient(2px_2px_at_40px_70px,hsl(var(--muted-foreground)/0.2),transparent),radial-gradient(1px_1px_at_90px_40px,hsl(var(--muted-foreground)/0.3),transparent)] bg-[length:100px_100px]' },
  waves:   { label: 'Волны', style: 'bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,hsl(var(--border)/0.15)_35px,hsl(var(--border)/0.15)_36px)]' },
  dark:    { label: 'Тёмный', style: 'bg-black/20' },
};

const FONT_FAMILIES: Record<FontFamily, { label: string; css: string }> = {
  space:      { label: 'Space Grotesk', css: "'Space Grotesk', system-ui, sans-serif" },
  inter:      { label: 'Inter', css: "'Inter', system-ui, sans-serif" },
  roboto:     { label: 'Roboto', css: "'Roboto', system-ui, sans-serif" },
  montserrat: { label: 'Montserrat', css: "'Montserrat', system-ui, sans-serif" },
};

const UI_SCALES: Record<UIScale, { label: string }> = {
  compact:  { label: 'Компактный' },
  normal:   { label: 'Стандартный' },
  spacious: { label: 'Просторный' },
};

const BORDER_RADII: Record<BorderRadius, { label: string; value: string; preview: string }> = {
  none:   { label: 'Нет', value: '0', preview: 'rounded-none' },
  small:  { label: 'Малое', value: '0.375rem', preview: 'rounded-sm' },
  medium: { label: 'Среднее', value: '0.75rem', preview: 'rounded-lg' },
  large:  { label: 'Большое', value: '1rem', preview: 'rounded-xl' },
  full:   { label: 'Макс', value: '1.5rem', preview: 'rounded-2xl' },
};

const SIDEBAR_WIDTHS: Record<SidebarWidth, { label: string }> = {
  narrow: { label: 'Узкая' },
  normal: { label: 'Стандартная' },
  wide:   { label: 'Широкая' },
};

/* ── CSS variable generator ── */

export function getThemeCSSVars(config: AppearanceConfig): Record<string, string> {
  const h = COLOR_THEMES[config.colorTheme]?.hue || '262';
  const vars: Record<string, string> = {
    '--primary': `${h} 100% 52%`,
    '--primary-foreground': '0 0% 100%',
    '--accent': `${h} 100% 52%`,
    '--accent-foreground': '0 0% 100%',
    '--ring': `${h} 100% 52%`,
    '--chat-active': `${h} 60% 25%`,
    '--chat-active-foreground': '240 10% 95%',
    '--chat-bubble-own': `${h} 100% 52%`,
    '--chat-bubble-own-foreground': '0 0% 100%',
    '--sidebar-primary': `${h} 100% 52%`,
    '--sidebar-primary-foreground': '0 0% 100%',
    '--sidebar-ring': `${h} 100% 52%`,
    '--admin-accent': `${h} 83% 58%`,
  };
  if (config.borderRadius) {
    vars['--radius'] = BORDER_RADII[config.borderRadius]?.value || '0.75rem';
  }
  return vars;
}

export function applyAppearanceToDOM(config: AppearanceConfig) {
  const root = document.documentElement;
  // Font family
  if (config.fontFamily) {
    root.style.fontFamily = FONT_FAMILIES[config.fontFamily]?.css || FONT_FAMILIES.space.css;
  }
  // Animations
  if (config.animations === false) {
    root.classList.add('no-animations');
  } else {
    root.classList.remove('no-animations');
  }
}

export function getFontSizeClass(size: FontSize): string {
  return FONT_SIZES[size]?.cls || 'text-sm';
}

export function getBubbleClasses(style: BubbleStyle): { own: string; other: string } {
  return BUBBLE_STYLES[style] || BUBBLE_STYLES.rounded;
}

export function getBackgroundClass(bg: ChatBackground): string {
  return BACKGROUNDS[bg]?.style || '';
}

export function getSidebarWidthClass(w: SidebarWidth): string {
  if (w === 'narrow') return 'w-64';
  if (w === 'wide') return 'w-96 xl:w-[28rem]';
  return 'w-80 xl:w-96';
}

export function getUIScaleClass(s: UIScale): string {
  if (s === 'compact') return 'py-2';
  if (s === 'spacious') return 'py-4';
  return 'py-3';
}

/* ── Component ── */

interface AppearanceSettingsProps {
  config: AppearanceConfig;
  onBack: () => void;
  onChange: (config: AppearanceConfig) => void;
}

export function AppearanceSettings({ config, onBack, onChange }: AppearanceSettingsProps) {
  const update = (partial: Partial<AppearanceConfig>) => {
    const next = { ...config, ...partial };
    onChange(next);
    applyAppearanceToDOM(next);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-bold text-gradient flex-1">Оформление</h2>
        <Palette className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Preview ── */}
        <div className="px-4 pt-4 pb-2">
          <SectionLabel icon={Monitor} title="Предпросмотр" />
          <div className={cn('rounded-xl border border-border p-4 space-y-2', getBackgroundClass(config.chatBackground))}>
            <div className="flex justify-start">
              <div className={cn(
                'px-3.5 py-2 bg-[hsl(var(--chat-bubble-other))] text-[hsl(var(--chat-bubble-other-foreground))]',
                getBubbleClasses(config.bubbleStyle).other,
                getFontSizeClass(config.fontSize),
              )}>
                Привет! Как дела?
                {config.showTimestamps && <p className="text-[10px] mt-1 opacity-60">14:30</p>}
              </div>
            </div>
            <div className="flex justify-end">
              <div className={cn(
                'px-3.5 py-2 bg-primary text-primary-foreground',
                getBubbleClasses(config.bubbleStyle).own,
                getFontSizeClass(config.fontSize),
              )}>
                Отлично! Работаю над проектом
                {config.showTimestamps && <p className="text-[10px] mt-1 opacity-60 text-right">14:31 ✓✓</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Color theme ── */}
        <Section>
          <SectionLabel icon={Palette} title="Цветовая тема" />
          <div className="px-4 grid grid-cols-5 gap-2">
            {(Object.entries(COLOR_THEMES) as [ColorTheme, typeof COLOR_THEMES[ColorTheme]][]).map(([key, theme]) => {
              const sel = config.colorTheme === key;
              return (
                <button key={key} onClick={() => update({ colorTheme: key })}
                  className={cn('flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <div className={cn('w-6 h-6 rounded-full', theme.color)}>
                    {sel && <div className="w-full h-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                  </div>
                  <span className={cn('text-[9px]', sel ? 'text-primary font-medium' : 'text-muted-foreground')}>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Font family ── */}
        <Section>
          <SectionLabel icon={Type} title="Шрифт" />
          <div className="px-4 grid grid-cols-2 gap-2">
            {(Object.entries(FONT_FAMILIES) as [FontFamily, typeof FONT_FAMILIES[FontFamily]][]).map(([key, f]) => {
              const sel = config.fontFamily === key;
              return (
                <button key={key} onClick={() => update({ fontFamily: key })}
                  className={cn('py-3 rounded-xl border text-center transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <span style={{ fontFamily: f.css }} className={cn('text-sm', sel ? 'text-primary font-medium' : 'text-foreground')}>{f.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Font size ── */}
        <Section>
          <SectionLabel icon={Type} title="Размер текста" />
          <div className="px-4 flex gap-1.5">
            {(Object.entries(FONT_SIZES) as [FontSize, typeof FONT_SIZES[FontSize]][]).map(([key, fs]) => {
              const sel = config.fontSize === key;
              return (
                <button key={key} onClick={() => update({ fontSize: key })}
                  className={cn('flex-1 py-2.5 rounded-xl border text-center transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <p className={cn('font-medium', sel ? 'text-primary' : 'text-foreground', fs.cls)}>Аа</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{fs.label}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Bubble style ── */}
        <Section>
          <SectionLabel icon={MessageSquare} title="Форма пузырей" />
          <div className="px-4 flex gap-1.5">
            {(Object.entries(BUBBLE_STYLES) as [BubbleStyle, typeof BUBBLE_STYLES[BubbleStyle]][]).map(([key, bs]) => {
              const sel = config.bubbleStyle === key;
              return (
                <button key={key} onClick={() => update({ bubbleStyle: key })}
                  className={cn('flex-1 py-2.5 rounded-xl border text-center transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <div className="flex justify-center mb-1"><div className={cn('w-10 h-3 bg-primary', bs.own)} /></div>
                  <p className={cn('text-[9px]', sel ? 'text-primary font-medium' : 'text-muted-foreground')}>{bs.label}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Chat background ── */}
        <Section>
          <SectionLabel icon={Wallpaper} title="Фон чата" />
          <div className="px-4 grid grid-cols-4 gap-2">
            {(Object.entries(BACKGROUNDS) as [ChatBackground, typeof BACKGROUNDS[ChatBackground]][]).map(([key, bg]) => {
              const sel = config.chatBackground === key;
              return (
                <button key={key} onClick={() => update({ chatBackground: key })}
                  className={cn('rounded-xl border overflow-hidden transition-all', sel ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-muted-foreground/30')}>
                  <div className={cn('h-10 bg-background', bg.style)} />
                  <p className={cn('text-[9px] py-1 text-center', sel ? 'text-primary font-medium' : 'text-muted-foreground')}>{bg.label}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Border radius ── */}
        <Section>
          <SectionLabel icon={Square} title="Скругление углов" />
          <div className="px-4 flex gap-1.5">
            {(Object.entries(BORDER_RADII) as [BorderRadius, typeof BORDER_RADII[BorderRadius]][]).map(([key, r]) => {
              const sel = config.borderRadius === key;
              return (
                <button key={key} onClick={() => update({ borderRadius: key })}
                  className={cn('flex-1 py-2.5 rounded-xl border text-center transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <div className={cn('w-7 h-5 border-2 border-current mx-auto mb-1', r.preview)} />
                  <p className={cn('text-[9px]', sel ? 'text-primary font-medium' : 'text-muted-foreground')}>{r.label}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── UI Scale ── */}
        <Section>
          <SectionLabel icon={Maximize2} title="Плотность интерфейса" />
          <div className="px-4 flex gap-2">
            {(Object.entries(UI_SCALES) as [UIScale, typeof UI_SCALES[UIScale]][]).map(([key, s]) => {
              const sel = config.uiScale === key;
              return (
                <button key={key} onClick={() => update({ uiScale: key })}
                  className={cn('flex-1 py-3 rounded-xl border text-center transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <span className={cn('text-xs', sel ? 'text-primary font-medium' : 'text-foreground')}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Sidebar width ── */}
        <Section>
          <SectionLabel icon={LayoutGrid} title="Ширина боковой панели" />
          <div className="px-4 flex gap-2">
            {(Object.entries(SIDEBAR_WIDTHS) as [SidebarWidth, typeof SIDEBAR_WIDTHS[SidebarWidth]][]).map(([key, s]) => {
              const sel = config.sidebarWidth === key;
              return (
                <button key={key} onClick={() => update({ sidebarWidth: key })}
                  className={cn('flex-1 py-3 rounded-xl border text-center transition-all', sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
                  <span className={cn('text-xs', sel ? 'text-primary font-medium' : 'text-foreground')}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Toggles ── */}
        <Section>
          <SectionLabel icon={Sparkles} title="Дополнительно" />
          <div className="px-4 space-y-2">
            <Toggle label="Анимации" value={config.animations} onChange={v => update({ animations: v })} />
            <Toggle label="Glass-эффекты" value={config.glassEffects} onChange={v => update({ glassEffects: v })} />
            <Toggle label="Время сообщений" value={config.showTimestamps} onChange={v => update({ showTimestamps: v })} />
            <Toggle label="Компактные сообщения" value={config.compactMessages} onChange={v => update({ compactMessages: v })} />
          </div>
        </Section>

        {/* ── Reset ── */}
        <div className="px-4 py-4">
          <button
            onClick={() => { onChange(DEFAULT_APPEARANCE); applyAppearanceToDOM(DEFAULT_APPEARANCE); }}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-3 glass-card rounded-xl transition-colors"
          >
            Сбросить все настройки
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Helper components ── */

function Section({ children }: { children: React.ReactNode }) {
  return <div className="py-3">{children}</div>;
}

function SectionLabel({ icon: Icon, title }: { icon: typeof Palette; title: string }) {
  return (
    <div className="flex items-center gap-2 px-4 mb-3">
      <Icon className="w-4 h-4 text-violet-400" />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center justify-between px-4 py-3 glass-card rounded-xl">
      <span className="text-sm text-foreground">{label}</span>
      <div className={cn('w-11 h-6 rounded-full transition-colors relative', value ? 'bg-primary' : 'bg-muted-foreground/30')}>
        <div className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', value ? 'translate-x-5' : 'translate-x-0.5')} />
      </div>
    </button>
  );
}
