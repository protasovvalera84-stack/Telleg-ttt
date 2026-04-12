import { useState } from 'react';
import {
  ArrowLeft,
  UsersRound,
  Zap,
  Shield,
  BarChart3,
  Palette,
  CircleDot,
  Trash2,
  Radio,
  Image,
  Film,
  Music,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { users, defaultChannels, type Chat, type Channel, type ChannelPost, type PostMedia } from '@/data/mockData';
import { motion } from 'framer-motion';

/* ── System settings types (kept for export) ── */

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
  root.style.fontFamily = FONT_MAP[s.fontFamily].css;
  root.style.setProperty('--radius', RADIUS_MAP[s.borderRadius].value);
  if (!s.animations) {
    root.style.setProperty('--animate-duration', '0s');
    root.classList.add('no-animations');
  } else {
    root.style.removeProperty('--animate-duration');
    root.classList.remove('no-animations');
  }
}

export function getWallpaperClass(w: WallpaperStyle): string { return WALLPAPER_MAP[w].preview; }
export function getIconSizeClass(s: IconSize): string { return ICON_SIZE_MAP[s].cls; }
export function getDensityClass(d: UIDensity): string { return DENSITY_MAP[d].py; }

/* ── Helper: get chat display name ── */
function getChatName(chat: Chat) {
  if (chat.name) return chat.name;
  const other = chat.participants.find(p => p !== 'me');
  return users.find(u => u.id === other)?.name ?? 'Unknown';
}

function mediaIcon(type: PostMedia['type']) {
  if (type === 'image') return Image;
  if (type === 'video') return Film;
  return Music;
}

/* ── Component ── */

interface AdminPanelProps {
  onBack: () => void;
  settings: SystemSettings;
  onSettingsChange: (s: SystemSettings) => void;
  /** All chats (default + created groups). */
  allChats: Chat[];
  /** All channels. */
  allChannels: Channel[];
  /** All channel posts keyed by channel ID. */
  allChannelPosts: Record<string, ChannelPost[]>;
  /** Delete a chat or group by ID. */
  onDeleteChat: (chatId: string) => void;
  /** Delete a channel by ID. */
  onDeleteChannel: (channelId: string) => void;
  /** Delete a specific post from a channel. */
  onDeletePost: (channelId: string, postId: string) => void;
  /** Delete a specific media item from a post. */
  onDeleteMedia: (channelId: string, postId: string, mediaIndex: number) => void;
}

type Tab = 'stats' | 'moderation' | 'customize';

export function AdminPanel({
  onBack, settings, onSettingsChange,
  allChats, allChannels, allChannelPosts,
  onDeleteChat, onDeleteChannel, onDeletePost, onDeleteMedia,
}: AdminPanelProps) {
  const [tab, setTab] = useState<Tab>('stats');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const update = (partial: Partial<SystemSettings>) => {
    const next = { ...settings, ...partial };
    onSettingsChange(next);
    applySystemSettings(next);
  };

  const onlineCount = users.filter(u => u.online).length;
  const groupCount = allChats.filter(c => c.type === 'group').length;
  const privateCount = allChats.filter(c => c.type === 'private').length;
  const totalPosts = Object.values(allChannelPosts).reduce((sum, posts) => sum + posts.length, 0);
  const totalMedia = Object.values(allChannelPosts).flat().reduce((sum, p) => sum + (p.media?.length || 0), 0);

  const handleDelete = (id: string, action: () => void) => {
    if (confirmId === id) {
      action();
      setConfirmId(null);
    } else {
      setConfirmId(id);
    }
  };

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
          { key: 'moderation' as Tab, label: 'Модерация', icon: Shield },
          { key: 'customize' as Tab, label: 'Настройки', icon: Palette },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-medium transition-colors relative',
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
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: UsersRound, label: 'Пользователи', value: users.length, color: 'from-violet-500/15 to-fuchsia-500/10' },
                { icon: Zap, label: 'Чаты', value: allChats.length, color: 'from-blue-500/15 to-cyan-500/10' },
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
            <div className="glass-card rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Детали</h3>
              {[
                { label: 'Личные чаты', value: privateCount },
                { label: 'Каналы', value: allChannels.length },
                { label: 'Публикации', value: totalPosts },
                { label: 'Медиафайлы', value: totalMedia },
                { label: 'Офлайн', value: users.length - onlineCount },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>
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

        {/* ── Moderation tab ── */}
        {tab === 'moderation' && (
          <div className="p-4 space-y-5">

            {/* Chats & Groups */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Чаты и группы ({allChats.length})
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                {allChats.map((chat, i) => (
                  <div key={chat.id} className={cn('flex items-center gap-3 px-4 py-3', i > 0 && 'border-t border-border/50')}>
                    {chat.type === 'group' ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <UsersRound className="w-4 h-4 text-primary" />
                      </div>
                    ) : (
                      <Avatar name={getChatName(chat)} size="sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{getChatName(chat)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {chat.type === 'group' ? `Группа · ${chat.participants.length} уч.` : 'Личный чат'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(`chat-${chat.id}`, () => onDeleteChat(chat.id))}
                      className={cn(
                        'px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex-shrink-0',
                        confirmId === `chat-${chat.id}`
                          ? 'bg-destructive text-white'
                          : 'bg-destructive/10 text-destructive hover:bg-destructive/20',
                      )}
                    >
                      {confirmId === `chat-${chat.id}` ? 'Точно?' : 'Удалить'}
                    </button>
                  </div>
                ))}
                {allChats.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">Нет чатов</p>
                )}
              </div>
            </div>

            {/* Channels */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-1 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" /> Каналы ({allChannels.length})
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                {allChannels.map((ch, i) => (
                  <div key={ch.id} className={cn('px-4 py-3', i > 0 && 'border-t border-border/50')}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Radio className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{ch.name}</p>
                        <p className="text-[11px] text-muted-foreground">{ch.subscriberCount} подп.</p>
                      </div>
                      <button
                        onClick={() => handleDelete(`ch-${ch.id}`, () => onDeleteChannel(ch.id))}
                        className={cn(
                          'px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex-shrink-0',
                          confirmId === `ch-${ch.id}`
                            ? 'bg-destructive text-white'
                            : 'bg-destructive/10 text-destructive hover:bg-destructive/20',
                        )}
                      >
                        {confirmId === `ch-${ch.id}` ? 'Точно?' : 'Удалить'}
                      </button>
                    </div>

                    {/* Posts in this channel */}
                    {(allChannelPosts[ch.id] || []).length > 0 && (
                      <div className="mt-2 ml-11 space-y-1.5">
                        {(allChannelPosts[ch.id] || []).map(post => (
                          <div key={post.id} className="bg-muted/30 rounded-lg p-2.5">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                {post.text && <p className="text-xs text-foreground truncate">{post.text}</p>}
                                {/* Media items */}
                                {post.media && post.media.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {post.media.map((m, mi) => {
                                      const MIcon = mediaIcon(m.type);
                                      return (
                                        <span key={mi} className="inline-flex items-center gap-1 bg-muted rounded px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                          <MIcon className="w-3 h-3" />
                                          {m.name || m.type}
                                          <button
                                            onClick={() => handleDelete(`media-${post.id}-${mi}`, () => onDeleteMedia(ch.id, post.id, mi))}
                                            className={cn(
                                              'ml-0.5 rounded transition-colors',
                                              confirmId === `media-${post.id}-${mi}` ? 'text-destructive' : 'text-muted-foreground hover:text-destructive',
                                            )}
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-1">{post.timestamp}</p>
                              </div>
                              <button
                                onClick={() => handleDelete(`post-${post.id}`, () => onDeletePost(ch.id, post.id))}
                                className={cn(
                                  'p-1 rounded transition-colors flex-shrink-0',
                                  confirmId === `post-${post.id}` ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-destructive',
                                )}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {allChannels.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">Нет каналов</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Customize tab ── */}
        {tab === 'customize' && (
          <div className="p-4 space-y-5">
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

function Section({ icon: Icon, title, children }: { icon: typeof CircleDot; title: string; children: React.ReactNode }) {
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
