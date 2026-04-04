import { ArrowLeft, Camera, User, LogOut, Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileSettingsProps {
  onBack: () => void;
  onOpenPrivacy: () => void;
}

export function ProfileSettings({ onBack, onOpenPrivacy }: ProfileSettingsProps) {
  const { user, logout, privacy } = useAuth();

  const displayName = user?.name || 'Пользователь';
  const displayPhone = user?.phone || 'Не указан';

  // Count how many settings are restricted (not "everyone").
  const restrictedCount = ([
    privacy.phoneNumber,
    privacy.profilePhoto,
    privacy.onlineStatus,
    privacy.lastSeen,
    privacy.groups,
    privacy.forwards,
    privacy.calls,
  ] as string[]).filter(v => v !== 'everyone').length;

  const privacySummary = restrictedCount > 0
    ? `${restrictedCount} ограничение(й)`
    : 'Стандартные';

  return (
    <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-card flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Настройки</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
              <User className="w-10 h-10" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{displayPhone}</p>
        </div>
        <div className="px-4 space-y-4">
          {/* Profile info */}
          <div className="bg-muted rounded-xl p-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Имя</label>
              <p className="text-sm text-foreground">{displayName}</p>
            </div>
            <div className="border-t border-border" />
            <div>
              <label className="text-xs text-muted-foreground">Телефон</label>
              <p className="text-sm text-foreground">{displayPhone}</p>
            </div>
            <div className="border-t border-border" />
            <div>
              <label className="text-xs text-muted-foreground">О себе</label>
              <p className="text-sm text-muted-foreground">Не указано</p>
            </div>
          </div>

          {/* Privacy settings button */}
          <button
            onClick={onOpenPrivacy}
            className="w-full flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Конфиденциальность</p>
              <p className="text-xs text-muted-foreground">{privacySummary}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Blocked users count */}
          {privacy.blockedUsers.length > 0 && (
            <div className="bg-destructive/5 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-xs text-destructive">
                Заблокировано: {privacy.blockedUsers.length} пользователь(ей)
              </span>
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl py-3 text-sm font-medium transition-colors hover:bg-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </motion.div>
  );
}
