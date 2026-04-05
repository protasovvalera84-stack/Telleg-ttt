import { useState } from 'react';
import { ArrowLeft, Check, Shuffle, Sparkles, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  THEME_PRESETS,
  generateVariation,
  applyVariationToConfig,
  getVariationCSSOverrides,
  type ThemePreset,
  type LayoutVariant,
} from '@/data/themePresets';
import { type AppearanceConfig, getThemeCSSVars, applyAppearanceToDOM, getBubbleClasses, getFontSizeClass, getBackgroundClass } from '@/components/settings/AppearanceSettings';
import { motion } from 'framer-motion';

interface ThemeGalleryProps {
  currentConfig: AppearanceConfig;
  onBack: () => void;
  onApply: (config: AppearanceConfig, cssOverrides: Record<string, string>, layout?: LayoutVariant) => void;
}

function PreviewCard({ preset, isActive, onApply, onRandomize }: {
  preset: ThemePreset;
  isActive: boolean;
  onApply: () => void;
  onRandomize: () => void;
}) {
  const bubbleCls = getBubbleClasses(preset.config.bubbleStyle);
  const fontCls = getFontSizeClass(preset.config.fontSize);
  const bgCls = getBackgroundClass(preset.config.chatBackground);

  // Compute primary color for preview
  const hue = preset.accentHues[0] || 262;
  const primaryStyle = { backgroundColor: `hsl(${hue}, 80%, 55%)` };
  const otherStyle = { backgroundColor: 'hsl(250, 15%, 15%)' };

  return (
    <div className={cn(
      'glass-card rounded-2xl overflow-hidden transition-all',
      isActive ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-muted-foreground/20',
    )}>
      {/* Mini preview */}
      <div className={cn('p-3 space-y-1.5 h-28', bgCls)} style={{ background: bgCls ? undefined : `hsl(${preset.cssOverrides['--background'] || '250 25% 5%'})` }}>
        {/* Other bubble */}
        <div className="flex justify-start">
          <div className={cn('px-2.5 py-1 text-[9px] text-white/90 max-w-[70%]', bubbleCls.other, fontCls)} style={otherStyle}>
            Привет!
          </div>
        </div>
        {/* Own bubble */}
        <div className="flex justify-end">
          <div className={cn('px-2.5 py-1 text-[9px] text-white max-w-[70%]', bubbleCls.own, fontCls)} style={primaryStyle}>
            Отлично!
          </div>
        </div>
        {/* Another */}
        <div className="flex justify-start">
          <div className={cn('px-2.5 py-1 text-[9px] text-white/90 max-w-[70%]', bubbleCls.other, fontCls)} style={otherStyle}>
            Как дела?
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">{preset.emoji}</span>
          <h3 className="text-sm font-semibold text-foreground truncate flex-1">{preset.name}</h3>
          {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
        </div>
        <p className="text-[10px] text-muted-foreground mb-2.5 line-clamp-1">{preset.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2.5">
          <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{preset.config.fontFamily}</span>
          <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">{preset.config.bubbleStyle}</span>
          {preset.config.glassEffects && <span className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">glass</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button
            onClick={onApply}
            className={cn(
              'flex-1 py-2 rounded-lg text-[11px] font-medium transition-all',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'bg-primary text-white hover:bg-primary/90',
            )}
          >
            {isActive ? 'Активен' : 'Применить'}
          </button>
          <button
            onClick={onRandomize}
            className="px-2.5 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            title="Случайная вариация"
          >
            <Shuffle className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ThemeGallery({ currentConfig, onBack, onApply }: ThemeGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = THEME_PRESETS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleApply = (preset: ThemePreset) => {
    const cssVars = { ...getThemeCSSVars(preset.config), ...preset.cssOverrides };
    setActiveId(preset.id);
    const layout = preset.layoutVariants[0]; // Default: first layout variant
    onApply(preset.config, cssVars, layout);
  };

  const handleRandomize = (preset: ThemePreset) => {
    const seed = Date.now();
    const variation = generateVariation(preset, seed);
    const variedConfig = applyVariationToConfig(preset.config, variation);
    const baseHue = preset.accentHues[0]?.toString() || '262';
    const varCss = getVariationCSSOverrides(variation, baseHue);
    const cssVars = { ...getThemeCSSVars(variedConfig), ...preset.cssOverrides, ...varCss };
    setActiveId(preset.id);
    // Pick the layout variant from the variation
    const layout = preset.layoutVariants.find(lv => lv.id === variation.layoutVariantId) || preset.layoutVariants[0];
    onApply(variedConfig, cssVars, layout);
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
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gradient">Шаблоны дизайна</h2>
          <p className="text-[11px] text-muted-foreground">{THEME_PRESETS.length} шаблонов</p>
        </div>
        <Sparkles className="w-5 h-5 text-primary" />
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-border">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск шаблонов..."
          className="w-full bg-muted/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 border border-border/50"
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(preset => (
            <PreviewCard
              key={preset.id}
              preset={preset}
              isActive={activeId === preset.id}
              onApply={() => handleApply(preset)}
              onRandomize={() => handleRandomize(preset)}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Shield className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Шаблоны не найдены</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
