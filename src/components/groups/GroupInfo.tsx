import { ArrowLeft, UsersRound, LogOut, Info, Calendar, UserPlus, Hash, ChevronRight, Shield, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { users, type Chat } from '@/data/mockData';
import { motion } from 'framer-motion';

interface GroupInfoProps {
  chat: Chat;
  topicCount: number;
  onBack: () => void;
  onLeave: (chatId: string) => void;
  onOpenTopics: () => void;
  onOpenPrivacy?: () => void;
}

export function GroupInfo({ chat, topicCount, onBack, onLeave, onOpenTopics, onOpenPrivacy }: GroupInfoProps) {
  const memberUsers = chat.participants
    .map(id => users.find(u => u.id === id))
    .filter(Boolean) as typeof users;

  const onlineCount = memberUsers.filter(u => u.online).length;
  const creator = chat.createdBy ? users.find(u => u.id === chat.createdBy) : null;
  const isCreator = chat.createdBy === 'me';
  const gp = chat.groupPrivacy;
  const VisIcon = gp?.visibility === 'private' ? Lock : Globe;

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
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">Информация о группе</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Group avatar & name */}
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <UsersRound className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground">{chat.name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {chat.participants.length} участник(ов), {onlineCount} в сети
          </p>
        </div>

        {/* Description */}
        {chat.description && (
          <div className="mx-4 mb-4 bg-muted rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Описание</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{chat.description}</p>
          </div>
        )}

        {/* Topics button */}
        <div className="mx-4 mb-4">
          <button
            onClick={onOpenTopics}
            className="w-full flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">Темы</p>
              <p className="text-xs text-muted-foreground">
                {topicCount > 0 ? `${topicCount} тем(ы)` : 'Нет тем'}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Privacy settings button (creator only) */}
        {isCreator && onOpenPrivacy && (
          <div className="mx-4 mb-4">
            <button
              onClick={onOpenPrivacy}
              className="w-full flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Приватность группы</p>
                <p className="text-xs text-muted-foreground">
                  {gp?.visibility === 'private' ? 'Приватная' : 'Публичная'}
                  {gp?.slowMode ? `, медленный режим` : ''}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Meta info */}
        {(chat.createdAt || creator) && (
          <div className="mx-4 mb-4 bg-muted rounded-xl p-4 space-y-2">
            {chat.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Создана {chat.createdAt}</span>
              </div>
            )}
            {gp && (
              <div className="flex items-center gap-2">
                <VisIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {gp.visibility === 'private' ? 'Приватная группа' : 'Публичная группа'}
                </span>
              </div>
            )}
            {creator && (
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Создал(а): {creator.id === 'me' ? 'Вы' : creator.name}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Members list */}
        <div className="mx-4 mb-4">
          <p className="text-sm font-semibold text-foreground mb-2 px-1">
            Участники ({chat.participants.length})
          </p>
          <div className="bg-muted rounded-xl overflow-hidden">
            {memberUsers.map((user, i) => (
              <div
                key={user.id}
                className={cn(
                  'flex items-center gap-3 px-4 py-3',
                  i > 0 && 'border-t border-border',
                )}
              >
                <Avatar name={user.name} size="md" online={user.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.id === 'me' ? 'Вы' : user.name}
                    </p>
                    {user.id === chat.createdBy && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                        создатель
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.online ? 'в сети' : `был(а) ${user.lastSeen || 'давно'}`}
                  </p>
                </div>
                <span
                  className={cn(
                    'w-2.5 h-2.5 rounded-full flex-shrink-0',
                    user.online ? 'bg-green-500' : 'bg-gray-400',
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Leave group */}
        <div className="mx-4 mb-6">
          <button
            onClick={() => onLeave(chat.id)}
            className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl py-3 text-sm font-medium transition-colors hover:bg-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            Покинуть группу
          </button>
        </div>
      </div>
    </motion.div>
  );
}
