import { useState } from 'react';
import {
  ArrowLeft,
  Globe,
  Lock,
  MessageSquare,
  UserPlus,
  UsersRound,
  Link,
  Copy,
  Check,
  ChevronRight,
  X,
  Shield,
  Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type GroupPrivacy,
  type GroupVisibility,
  type GroupPermission,
} from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupPrivacyPageProps {
  groupName: string;
  privacy: GroupPrivacy;
  onBack: () => void;
  onChange: (privacy: GroupPrivacy) => void;
}

const VISIBILITY_LABELS: Record<GroupVisibility, { label: string; desc: string; icon: typeof Globe }> = {
  public: { label: 'Публичная', desc: 'Любой может найти и вступить', icon: Globe },
  private: { label: 'Приватная', desc: 'Только по ссылке-приглашению', icon: Lock },
};

const PERMISSION_LABELS: Record<GroupPermission, string> = {
  everyone: 'Все',
  admins: 'Только админы',
  nobody: 'Никто',
};

const MEMBERS_LABELS: Record<string, string> = {
  everyone: 'Все',
  members: 'Участники',
  admins: 'Только админы',
};

const SLOWMODE_OPTIONS = [
  { value: 0, label: 'Выкл' },
  { value: 10, label: '10 сек' },
  { value: 30, label: '30 сек' },
  { value: 60, label: '1 мин' },
  { value: 300, label: '5 мин' },
  { value: 900, label: '15 мин' },
  { value: 3600, label: '1 час' },
];

type EditingField = 'visibility' | 'sendMessages' | 'addMembers' | 'showMembers' | 'slowMode' | null;

const PERMISSION_SETTINGS: { key: 'sendMessages' | 'addMembers'; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: 'sendMessages', label: 'Отправка сообщений', desc: 'Кто может писать в группу', icon: <MessageSquare className="w-5 h-5" /> },
  { key: 'addMembers', label: 'Добавление участников', desc: 'Кто может приглашать новых людей', icon: <UserPlus className="w-5 h-5" /> },
];

export function GroupPrivacyPage({ groupName, privacy, onBack, onChange }: GroupPrivacyPageProps) {
  const [editing, setEditing] = useState<EditingField>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const inviteLink = privacy.inviteLink || `https://telleg.app/join/${Date.now().toString(36)}`;

  const handleVisibilityChange = (v: GroupVisibility) => {
    const updated = { ...privacy, visibility: v };
    if (v === 'private' && !updated.inviteLink) {
      updated.inviteLink = inviteLink;
    }
    onChange(updated);
    setEditing(null);
  };

  const handlePermissionChange = (key: 'sendMessages' | 'addMembers', value: GroupPermission) => {
    onChange({ ...privacy, [key]: value });
    setEditing(null);
  };

  const handleShowMembersChange = (value: 'everyone' | 'members' | 'admins') => {
    onChange({ ...privacy, showMembers: value });
    setEditing(null);
  };

  const handleSlowModeChange = (value: number) => {
    onChange({ ...privacy, slowMode: value });
    setEditing(null);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
    } catch {
      // fallback
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const VisIcon = VISIBILITY_LABELS[privacy.visibility].icon;
  const slowLabel = SLOWMODE_OPTIONS.find(o => o.value === privacy.slowMode)?.label || 'Выкл';

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
          <h2 className="text-lg font-semibold text-foreground">Приватность группы</h2>
          <p className="text-xs text-muted-foreground truncate">{groupName}</p>
        </div>
        <Shield className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Visibility */}
        <div className="py-2">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Тип группы
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
                >
                  {linkCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground">
                  Поделитесь ссылкой, чтобы пригласить людей в группу
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Permissions */}
        <div className="py-2">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Разрешения
          </p>
          <div className="mx-3 bg-muted/30 rounded-xl overflow-hidden">
            {PERMISSION_SETTINGS.map((setting, i) => (
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

            {/* Show members */}
            <div className="mx-4 border-t border-border/50" />
            <button
              onClick={() => setEditing('showMembers')}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
            >
              <UsersRound className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Список участников</p>
                <p className="text-xs text-muted-foreground">{MEMBERS_LABELS[privacy.showMembers]}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Slow mode */}
            <div className="mx-4 border-t border-border/50" />
            <button
              onClick={() => setEditing('slowMode')}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
            >
              <Timer className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Медленный режим</p>
                <p className="text-xs text-muted-foreground">{slowLabel}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Настройки приватности определяют, кто может взаимодействовать с группой.
              Приватные группы доступны только по ссылке-приглашению.
              Медленный режим ограничивает частоту сообщений от участников.
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
              {/* Close header */}
              <div className="px-4 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    {editing === 'visibility' && 'Тип группы'}
                    {editing === 'sendMessages' && 'Отправка сообщений'}
                    {editing === 'addMembers' && 'Добавление участников'}
                    {editing === 'showMembers' && 'Список участников'}
                    {editing === 'slowMode' && 'Медленный режим'}
                  </h3>
                  <button onClick={() => setEditing(null)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="py-2 max-h-80 overflow-y-auto">
                {/* Visibility picker */}
                {editing === 'visibility' && (['public', 'private'] as GroupVisibility[]).map(v => {
                  const cfg = VISIBILITY_LABELS[v];
                  const Icon = cfg.icon;
                  const isSelected = privacy.visibility === v;
                  return (
                    <button
                      key={v}
                      onClick={() => handleVisibilityChange(v)}
                      className={cn('w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left', isSelected ? 'bg-primary/5' : 'hover:bg-muted/50')}
                    >
                      <Icon className={cn('w-5 h-5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                      <div className="flex-1">
                        <p className={cn('text-sm', isSelected ? 'text-primary font-medium' : 'text-foreground')}>{cfg.label}</p>
                        <p className="text-xs text-muted-foreground">{cfg.desc}</p>
                      </div>
                      {isSelected && <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-primary-foreground" /></div>}
                    </button>
                  );
                })}

                {/* Permission picker (sendMessages, addMembers) */}
                {(editing === 'sendMessages' || editing === 'addMembers') && (['everyone', 'admins', 'nobody'] as GroupPermission[]).map(level => {
                  const isSelected = privacy[editing] === level;
                  return (
                    <button
                      key={level}
                      onClick={() => handlePermissionChange(editing, level)}
                      className={cn('w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left', isSelected ? 'bg-primary/5' : 'hover:bg-muted/50')}
                    >
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30')}>
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className={cn('text-sm', isSelected ? 'text-primary font-medium' : 'text-foreground')}>{PERMISSION_LABELS[level]}</span>
                    </button>
                  );
                })}

                {/* Show members picker */}
                {editing === 'showMembers' && (['everyone', 'members', 'admins'] as const).map(level => {
                  const isSelected = privacy.showMembers === level;
                  return (
                    <button
                      key={level}
                      onClick={() => handleShowMembersChange(level)}
                      className={cn('w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left', isSelected ? 'bg-primary/5' : 'hover:bg-muted/50')}
                    >
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30')}>
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className={cn('text-sm', isSelected ? 'text-primary font-medium' : 'text-foreground')}>{MEMBERS_LABELS[level]}</span>
                    </button>
                  );
                })}

                {/* Slow mode picker */}
                {editing === 'slowMode' && SLOWMODE_OPTIONS.map(opt => {
                  const isSelected = privacy.slowMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSlowModeChange(opt.value)}
                      className={cn('w-full flex items-center gap-3 px-4 py-3.5 transition-colors text-left', isSelected ? 'bg-primary/5' : 'hover:bg-muted/50')}
                    >
                      <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors', isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30')}>
                        {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className={cn('text-sm', isSelected ? 'text-primary font-medium' : 'text-foreground')}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
