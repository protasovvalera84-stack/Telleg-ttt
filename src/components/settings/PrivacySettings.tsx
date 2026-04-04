import { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  Phone,
  Image,
  Clock,
  Users,
  Forward,
  MessageCircle,
  Shield,
  ChevronRight,
  Ban,
  X,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { users } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export type PrivacyLevel = 'everyone' | 'contacts' | 'nobody';

export interface PrivacySettings {
  phoneNumber: PrivacyLevel;
  profilePhoto: PrivacyLevel;
  onlineStatus: PrivacyLevel;
  lastSeen: PrivacyLevel;
  groups: PrivacyLevel;
  forwards: PrivacyLevel;
  calls: PrivacyLevel;
  blockedUsers: string[];
}

export const DEFAULT_PRIVACY: PrivacySettings = {
  phoneNumber: 'contacts',
  profilePhoto: 'everyone',
  onlineStatus: 'everyone',
  lastSeen: 'everyone',
  groups: 'everyone',
  forwards: 'everyone',
  calls: 'everyone',
  blockedUsers: [],
};

interface PrivacySettingsPageProps {
  privacy: PrivacySettings;
  onBack: () => void;
  onChange: (privacy: PrivacySettings) => void;
}

const PRIVACY_LABELS: Record<PrivacyLevel, string> = {
  everyone: 'Все',
  contacts: 'Мои контакты',
  nobody: 'Никто',
};

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  value: PrivacyLevel;
  onPress: () => void;
}

function SettingRow({ icon, label, value, onPress }: SettingRowProps) {
  return (
    <button
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
    >
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{PRIVACY_LABELS[value]}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

type SettingKey = keyof Omit<PrivacySettings, 'blockedUsers'>;

const SETTING_CONFIG: { key: SettingKey; label: string; icon: React.ReactNode; description: string }[] = [
  { key: 'phoneNumber', label: 'Номер телефона', icon: <Phone className="w-5 h-5" />, description: 'Кто может видеть ваш номер телефона' },
  { key: 'profilePhoto', label: 'Фото профиля', icon: <Image className="w-5 h-5" />, description: 'Кто может видеть ваше фото профиля' },
  { key: 'onlineStatus', label: 'Статус онлайн', icon: <Eye className="w-5 h-5" />, description: 'Кто может видеть, что вы в сети' },
  { key: 'lastSeen', label: 'Время последнего визита', icon: <Clock className="w-5 h-5" />, description: 'Кто может видеть, когда вы были в сети' },
  { key: 'groups', label: 'Группы', icon: <Users className="w-5 h-5" />, description: 'Кто может добавлять вас в группы' },
  { key: 'forwards', label: 'Пересылка сообщений', icon: <Forward className="w-5 h-5" />, description: 'Кто может пересылать ваши сообщения со ссылкой на вас' },
  { key: 'calls', label: 'Звонки', icon: <MessageCircle className="w-5 h-5" />, description: 'Кто может вам звонить' },
];

export function PrivacySettingsPage({ privacy, onBack, onChange }: PrivacySettingsPageProps) {
  const [editingSetting, setEditingSetting] = useState<SettingKey | null>(null);
  const [showBlockedList, setShowBlockedList] = useState(false);

  const editingConfig = editingSetting ? SETTING_CONFIG.find(s => s.key === editingSetting) : null;

  const handleLevelChange = (key: SettingKey, level: PrivacyLevel) => {
    onChange({ ...privacy, [key]: level });
    setEditingSetting(null);
  };

  const handleUnblock = (userId: string) => {
    onChange({
      ...privacy,
      blockedUsers: privacy.blockedUsers.filter(id => id !== userId),
    });
  };

  const handleBlock = (userId: string) => {
    if (privacy.blockedUsers.includes(userId)) return;
    onChange({
      ...privacy,
      blockedUsers: [...privacy.blockedUsers, userId],
    });
  };

  const availableToBlock = users.filter(
    u => u.id !== 'me' && !privacy.blockedUsers.includes(u.id),
  );

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
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Конфиденциальность</h2>
        </div>
        <Shield className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Privacy settings list */}
        <div className="py-2">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Кто может видеть
          </p>
          <div className="bg-muted/30 rounded-xl mx-3 overflow-hidden">
            {SETTING_CONFIG.map((setting, i) => (
              <div key={setting.key}>
                {i > 0 && <div className="mx-4 border-t border-border/50" />}
                <SettingRow
                  icon={setting.icon}
                  label={setting.label}
                  value={privacy[setting.key]}
                  onPress={() => setEditingSetting(setting.key)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Blocked users */}
        <div className="py-2">
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Заблокированные
          </p>
          <div className="mx-3">
            <button
              onClick={() => setShowBlockedList(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors text-left"
            >
              <Ban className="w-5 h-5 text-destructive" />
              <div className="flex-1">
                <p className="text-sm text-foreground">Заблокированные пользователи</p>
                <p className="text-xs text-muted-foreground">
                  {privacy.blockedUsers.length > 0
                    ? `${privacy.blockedUsers.length} пользователь(ей)`
                    : 'Нет заблокированных'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Настройки конфиденциальности определяют, кто может видеть вашу личную информацию
              и взаимодействовать с вами. Изменения применяются мгновенно.
            </p>
          </div>
        </div>
      </div>

      {/* ── Level picker overlay ── */}
      <AnimatePresence>
        {editingSetting && editingConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-60 bg-black/50 flex items-end sm:items-center justify-center"
            onClick={() => setEditingSetting(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={e => e.stopPropagation()}
              className="w-full sm:max-w-sm bg-card rounded-t-2xl sm:rounded-2xl border border-border overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">{editingConfig.label}</h3>
                  <button
                    onClick={() => setEditingSetting(null)}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{editingConfig.description}</p>
              </div>
              <div className="py-2">
                {(['everyone', 'contacts', 'nobody'] as PrivacyLevel[]).map(level => {
                  const isSelected = privacy[editingSetting] === level;
                  return (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(editingSetting, level)}
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
                        {PRIVACY_LABELS[level]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Blocked users overlay ── */}
      <AnimatePresence>
        {showBlockedList && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="absolute inset-0 z-60 bg-card flex flex-col"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <button
                onClick={() => setShowBlockedList(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-lg font-semibold text-foreground">Заблокированные</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Blocked list */}
              {privacy.blockedUsers.length > 0 && (
                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Заблокированы ({privacy.blockedUsers.length})
                  </p>
                  {privacy.blockedUsers.map(userId => {
                    const user = users.find(u => u.id === userId);
                    if (!user) return null;
                    return (
                      <div key={userId} className="flex items-center gap-3 px-4 py-3">
                        <Avatar name={user.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-destructive">Заблокирован</p>
                        </div>
                        <button
                          onClick={() => handleUnblock(userId)}
                          className="px-3 py-1.5 text-xs font-medium bg-muted rounded-lg text-foreground hover:bg-muted/80 transition-colors"
                        >
                          Разблокировать
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add to blocked */}
              {availableToBlock.length > 0 && (
                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Заблокировать пользователя
                  </p>
                  {availableToBlock.map(user => (
                    <div key={user.id} className="flex items-center gap-3 px-4 py-3">
                      <Avatar name={user.name} size="md" online={user.online} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.online ? 'в сети' : `был(а) ${user.lastSeen || 'давно'}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBlock(user.id)}
                        className="px-3 py-1.5 text-xs font-medium bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                      >
                        Заблокировать
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {privacy.blockedUsers.length === 0 && availableToBlock.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Ban className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Нет пользователей</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
