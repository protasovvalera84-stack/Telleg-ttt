import { ArrowLeft, Megaphone, Calendar, UserPlus, LogOut, Bell, BellOff } from 'lucide-react';
import { type Channel } from '@/data/mockData';
import { motion } from 'framer-motion';

interface ChannelInfoProps {
  channel: Channel;
  onBack: () => void;
  onToggleSubscribe: (channelId: string) => void;
  onDelete?: (channelId: string) => void;
}

export function ChannelInfo({ channel, onBack, onToggleSubscribe, onDelete }: ChannelInfoProps) {
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
        <h2 className="text-lg font-semibold text-foreground">Информация о канале</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Channel avatar & name */}
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Megaphone className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{channel.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {channel.subscriberCount.toLocaleString('ru-RU')} подписчик(ов)
          </p>
          {channel.isOwner && (
            <span className="mt-1.5 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Вы — владелец
            </span>
          )}
        </div>

        {/* Description */}
        {channel.description && (
          <div className="mx-4 mb-4 bg-muted rounded-xl p-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Описание</p>
            <p className="text-sm text-foreground leading-relaxed">{channel.description}</p>
          </div>
        )}

        {/* Meta */}
        <div className="mx-4 mb-4 bg-muted rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Создан {channel.createdAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {channel.isOwner ? 'Создатель: Вы' : 'Публичный канал'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mx-4 mb-6 space-y-2">
          {!channel.isOwner && (
            <button
              onClick={() => onToggleSubscribe(channel.id)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-colors ${
                channel.subscribed
                  ? 'bg-muted text-foreground hover:bg-muted/80'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {channel.subscribed ? (
                <>
                  <BellOff className="w-4 h-4" />
                  Отписаться
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Подписаться
                </>
              )}
            </button>
          )}

          {channel.isOwner && onDelete && (
            <button
              onClick={() => onDelete(channel.id)}
              className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl py-3 text-sm font-medium transition-colors hover:bg-destructive/20"
            >
              <LogOut className="w-4 h-4" />
              Удалить канал
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
