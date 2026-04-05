import { useState } from 'react';
import {
  ArrowLeft,
  Globe,
  Lock,
  MessageSquare,
  UsersRound,
  Forward,
  Link,
  Copy,
  Check,
  ChevronRight,
  X,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type ChannelPrivacy,
  type ChannelVisibility,
  type ChannelPermission,
} from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface ChannelPrivacyPageProps {
  channelName: string;
  privacy: ChannelPrivacy;
  onBack: () => void;
  onChange: (privacy: ChannelPrivacy) => void;
}

const VISIBILITY_LABELS: Record<ChannelVisibility, { label: string; desc: string; icon: typeof Globe }> = {
  public: { label: 'Публичный', desc: 'Любой может найти и подписаться', icon: Globe },
  private: { label: 'Приватный', desc: 'Только по ссылке-приглашению', icon: Lock },
};

const PERMISSION_LABELS: Record<ChannelPermission, string> = {
  everyone: 'Все',
  subscribers: 'Подписчики',
  nobody: 'Никто',
};

type EditingField = 'visibility' | 'comments' | 'showSubscribers' | null;

const SETTINGS_CONFIG: { key: 'comments' | 'showSubscribers'; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'comments', label: 'Комментарии', desc: 'Кто может комментировать посты', icon: <MessageSquare className="w-5 h-5" /> },
  { key: 'showSubscribers', label: 'Список подписчиков', desc: 'Кто видит подписчиков канала', icon: <UsersRound className="w-5 h-5" /> },
];

export function ChannelPrivacyPage({ channelName, privacy, onBack, onChange }: ChannelPrivacyPageProps) {
  const [editing, setEditing] = useState<EditingField>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const inviteLink = privacy.inviteLink || `https://telleg.app/invite/${Date.now().toString(36)}`;

  const handleVisibilityChange = (v: ChannelVisibility) => {
    const updated = { ...privacy, visibility: v };
    // Generate invite link when switching to private.
    if (v === 'private' && !updated.inviteLink) {
      updated.inviteLink = inviteLink;
    }
    onChange(updated);
    setEditing(null);
  };

  const handlePermissionChange = (key: 'comments' | 'showSubscribers', value: ChannelPermission) => {
    onChange({ ...privacy, [key]: value });
    setEditing(null);
  };

  const handleToggleForwarding = () => {
    onChange({ ...privacy, allowForwarding: !privacy.allowForwarding });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      // Fallback: select text (won't work in all environments).
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const VisIcon = VISIBILITY_LABELS[privacy.visibility].icon;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-card flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground">Приватность канала</h2>
          <p className="text-xs text-muted-foreground truncate">{channelName}</p>
        </div>
        <Shield className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Visibility */}
        <div className="py-2">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Тип канала
          </p>
          <div className="mx-3 bg-muted/30 rounded-xl overflow-hidden">
            <button
              onClick={() => setEditing('visibility')}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
            >
              <VisIcon className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-foreground">{VISIBILITY_LABELS[privacy.visibility].label}</p>
                <p className="text-xs text-muted-foreground">{VISIBILITY_LABELS[privacy.visibility].desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Invite link (private only) */}
        {privacy.visibility === 'private' && (
          <div className="py-2">
            <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ссылка-приглашение
            </p>
            <div className="mx-3 bg-muted/30 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Link className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground truncate flex-1 font-mono">{inviteLink}</p>
                <button
                  onClick={handleCopyLink}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
                  title="Копировать ссылку"
                >
                  {linkCopied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground">
                  Поделитесь этой ссылкой, чтобы пригласить людей в канал
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Permission settings */}
        <div className="py-2">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Разрешения
          </p>
          <div className="mx-3 bg-muted/30 rounded-xl overflow-hidden">
            {SETTINGS_CONFIG.map((setting, i) => (
              <div key={setting.key}>
                {i > 0 && <div className="mx-4 border-t border-border/50" />}
                <button
                  onClick={() => setEditing(setting.key)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-muted-foreground">{setting.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{setting.label}</p>
                    <p className="text-xs text-muted-foreground">{PERMISSION_LABELS[privacy[setting.key]]}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            ))}

            {/* Forwarding toggle */}
            <div className="mx-4 border-t border-border/50" />
            <button
              onClick={handleToggleForwarding}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
            >
              <Forward className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Пересылка постов</p>
                <p className="text-xs text-muted-foreground">
                  {privacy.allowForwarding ? 'Разрешена' : 'Запрещена'}
                </p>
              </div>
              <div
                className={cn(
                  'w-11 h-6 rounded-full transition-colors relative',
                  privacy.allowForwarding ? 'bg-primary' : 'bg-muted-foreground/30',
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                    privacy.allowForwarding ? 'translate-x-5' : 'translate-x-0.5',
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Настройки приватности определяют, кто может взаимодействовать с вашим каналом.
              Приватные каналы доступны только по ссылке-приглашению.
            </p>
          </div>
        </div>
      </div>

      {/* ── Picker overlay ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-60 bg-black/50 flex items-end sm:items-center justify-center"
            onClick={() => setEditing(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="w-full sm:max-w-sm bg-card rounded-t-2xl sm:rounded-2xl border border-border overflow-hidden"
            >
              {editing === 'visibility' ? (
                <>
                  <div className="px-4 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-foreground">Тип канала</h3>
                      <button onClick={() => setEditing(null)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <div className="py-2">
                    {(['public', 'private'] as ChannelVisibility[]).map(v => {
                      const cfg = VISIBILITY_LABELS[v];
                      const Icon = cfg.icon;
                      const isSelected = privacy.visibility === v;
                      return (
                        <button
                          key={v}
                          onClick={() => handleVisibilityChange(v)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left',
                            isSelected ? 'bg-primary/5' : 'hover:bg-muted/50',
                          )}
                        >
                          <Icon className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                          <div className="flex-1">
                            <p className={cn('text-sm', isSelected ? 'text-primary font-medium' : 'text-foreground')}>{cfg.label}</p>
                            <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-foreground">
                        {SETTINGS_CONFIG.find(s => s.key === editing)?.label}
                      </h3>
                      <button onClick={() => setEditing(null)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {SETTINGS_CONFIG.find(s => s.key === editing)?.desc}
                    </p>
                  </div>
                  <div className="py-2">
                    {(['everyone', 'subscribers', 'nobody'] as ChannelPermission[]).map(level => {
                      const isSelected = privacy[editing] === level;
                      return (
                        <button
                          key={level}
                          onClick={() => handlePermissionChange(editing, level)}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left',
                            isSelected ? 'bg-primary/5' : 'hover:bg-muted/50',
                          )}
                        >
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                              isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30',
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>
                          <span className={cn('text-sm', isSelected ? 'text-primary font-medium' : 'text-foreground')}>
                            {PERMISSION_LABELS[level]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
