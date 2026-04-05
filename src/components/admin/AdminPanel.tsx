import { useState } from 'react';
import {
  ArrowLeft,
  UsersRound,
  Zap,
  Shield,
  BarChart3,
  Palette,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { users, chats, defaultChannels } from '@/data/mockData';
import { motion } from 'framer-motion';

/* ── System settings types ── */

export type IconSize = 'small' | 'medium' | 'large';
export type IconStyle = 'outline' | 'filled';
export type WallpaperStyle = 'none' | 'dots' | 'grid' | 'gradient' | 'aurora' | 'mesh';
export type FontFamily = 'space' | 'inter' | 'roboto' | 'montserrat';
export type UIDensity = 'compact' | 'normal' | 'spacious';
export type BorderRadius = 'sharp' | 'rounded' | 'pill';

export interface SystemSettings {
  iconSize: IconSize;
  iconStyle: IconStyle;
  wallpaper: WallpaperStyle;
  fontFamily: FontFamily;
  uiDensity: UIDensity;
  borderRadius: BorderRadius;
  animations: boolean;
}

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  iconSize: 'medium',
  iconStyle: 'outline',
  wallpaper: 'none',
  fontFamily: 'space',
  uiDensity: 'normal',
  borderRadius: 'rounded',
  animations: true,
};

/* ── CSS generators ── */

const FONT_MAP: Record<FontFamily, { label: string; css: string }> = {
  space: { label: 'Space Grotesk', css: "'Space Grotesk', system-ui, sans-serif" },
  inter: { label: 'Inter', css: "'Inter', system-ui, sans-serif" },
  roboto: { label: 'Roboto', css: "'Roboto', system-ui, sans-serif" },
  montserrat: { label: 'Montserrat', css: "'Montserrat', system-ui, sans-serif" },
};

const WALLPAPER_MAP: Record<WallpaperStyle, { label: string; preview: string }> = {
  none: { label: 'Без фона', preview: '' },
  dots: { label: 'Точки', preview: 'bg-[radial-gradient(circle,hsl(var(--muted))_1px,transparent_1px)] bg-[length:20px_20px]' },
  grid: { label: 'Сетка', preview: 'bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[length:32px_32px]' },
  gradient: { label: 'Градиент', preview: 'bg-gradient-to-br from-violet-950/30 to-indigo-950/20' },
  aurora: { label: 'Аврора', preview: 'bg-gradient-to-br from-violet-900/20 via-fuchsia-900/10 to-cyan-900/15' },
  mesh: { label: 'Меш', preview: 'bg-gradient-to-tr from-purple-950/25 via-background to-blue-950/20' },
};

const RADIUS_MAP: Record<BorderRadius, { label: string; value: string }> = {
  sharp: { label: 'Острые', value: '0.375rem' },
  rounded: { label: 'Скруглённые', value: '1rem' },
  pill: { label: 'Капсулы', value: '1.5rem' },
};

const DENSITY_MAP: Record<UIDensity, { label: string; py: string }> = {
  compact: { label: 'Компактный', py: 'py-1.5' },
  normal: { label: 'Стандартный', py: 'py-3' },
  spacious: { label: 'Просторный', py: 'py-4' },
};

const ICON_SIZE_MAP: Record<IconSize, { label: string; cls: string }> = {
  small: { label: 'Маленькие', cls: 'w-4 h-4' },
  medium: { label: 'Средние', cls: 'w-5 h-5' },
  large: { label: 'Большие', cls: 'w-6 h-6' },
};

export function applySystemSettings(s: SystemSettings) {
  const root = document.documentElement;
  // Font
  root.style.fontFamily = FONT_MAP[s.fontFamily].css;
  // Border radius
  root.style.setProperty('--radius', RADIUS_MAP[s.borderRadius].value);
  // Animations
  if (!s.animations) {
    root.style.setProperty('--animate-duration', '0s');
    root.classList.add('no-animations');
  } else {
    root.style.removeProperty('--animate-duration');
    root.classList.remove('no-animations');
  }
}

export function getWallpaperClass(w: WallpaperStyle): string {
  return WALLPAPER_MAP[w].preview;
}

export function getIconSizeClass(s: IconSize): string {
  return ICON_SIZE_MAP[s].cls;
}

export function getDensityClass(d: UIDensity): string {
  return DENSITY_MAP[d].py;
}

/* ── Component ── */

interface AdminPanelProps {
  onBack: () => void;
  settings: SystemSettings;
  onSettingsChange: (s: SystemSettings) => void;
}

type Tab = 'stats' | 'customize';

export function AdminPanel({ onBack, settings, onSettingsChange }: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('stats');

  const update = (partial: Partial<SystemSettings>) => {
    const next = { ...settings, ...partial };
    onSettingsChange(next);
    applySystemSettings(next);
  };

  const onlineCount = users.filter(u => u.online).length;
  const groupCount = chats.filter(c => c.type === 'group').length;
  const privateCount = chats.filter(c => c.type === 'private').length;

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-bold text-gradient flex-1">Админ-панель</h2>
        <Shield className="w-5 h-5 text-violet-400" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {([
          { key: 'stats' as Tab, label: 'Статистика', icon: BarChart3 },
          { key: 'customize' as Tab, label: 'Настройки системы', icon: Palette },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-colors relative',
              tab === t.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            {tab === t.key && (
              <motion.div layoutId="admin-tab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Stats tab ── */}
        {tab === 'stats' && (
          <div className="p-4 space-y-4">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: UsersRound, label: 'Пользователи', value: users.length, color: 'from-violet-500/15 to-fuchsia-500/10' },
                { icon: Zap, label: 'Чаты', value: chats.length, color: 'from-blue-500/15 to-cyan-500/10' },
                { icon: Shield, label: 'Онлайн', value: onlineCount, color: 'from-emerald-500/15 to-teal-500/10' },
                { icon: BarChart3, label: 'Группы', value: groupCount, color: 'from-amber-500/15 to-orange-500/10' },
              ].map(stat => (
                <div key={stat.label} className={cn('glass-card rounded-2xl p-4 bg-gradient-to-br', stat.color)}>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className="w-4 h-4 text-violet-400" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Extra stats */}
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Детали</h3>
              {[
                { label: 'Личные чаты', value: privateCount },
                { label: 'Каналы', value: defaultChannels.length },
                { label: 'Офлайн', value: users.length - onlineCount },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            {/* User list */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1">Пользователи</h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                {users.filter(u => u.id !== 'me').map((user, i) => (
                  <div key={user.id} className={cn('flex items-center gap-3 px-4 py-3', i > 0 && 'border-t border-border/50')}>
                    <Avatar name={user.name} size="sm" online={user.online} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.online ? 'в сети' : `был(а) ${user.lastSeen || 'давно'}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Customize tab ── */}
        {tab === 'customize' && (
          <div className="p-4 space-y-5">

            {/* Icon style */}
            <Section icon={CircleDot} title="Стиль иконок">
              <div className="flex gap-2">
                {([
                  { key: 'outline' as IconStyle, label: 'Контур', icon: '○' },
                  { key: 'filled' as IconStyle, label: 'Заливка', icon: '●' },
                ]).map(opt => (
                  <OptionButton key={opt.key} selected={settings.iconStyle === opt.key} onClick={() => update({ iconStyle: opt.key })} className="flex-1">
                    <span className="text-lg mb-1">{opt.icon}</span>
                    <span className="text-[10px]">{opt.label}</span>
                  </OptionButton>
                ))}
              </div>
            </Section>

            {/* Reset */}
            <button
              onClick={() => { onSettingsChange(DEFAULT_SYSTEM_SETTINGS); applySystemSettings(DEFAULT_SYSTEM_SETTINGS); }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-3 transition-colors"
            >
              Сбросить настройки
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Helper components ── */

function Section({ icon: Icon, title, children }: { icon: typeof Type; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className="w-4 h-4 text-violet-400" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  );
}

function OptionButton({ selected, onClick, children, className }: { selected: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center py-3 px-2 rounded-xl border transition-all text-center',
        selected ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-muted/50 text-muted-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}
