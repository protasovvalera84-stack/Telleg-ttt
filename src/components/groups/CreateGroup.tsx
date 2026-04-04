import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { users, type Chat, DEFAULT_GROUP_PRIVACY } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateGroupProps {
  onBack: () => void;
  onCreated: (chat: Chat) => void;
}

type Step = 'members' | 'details';

export function CreateGroup({ onBack, onCreated }: CreateGroupProps) {
  const [step, setStep] = useState<Step>('members');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');

  const availableUsers = users.filter(u => u.id !== 'me');
  const filtered = availableUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleUser = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedIds.length === 0) return;

    const newChat: Chat = {
      id: `group-${Date.now()}`,
      type: 'group',
      name: groupName.trim(),
      description: groupDesc.trim() || undefined,
      participants: ['me', ...selectedIds],
      unreadCount: 0,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      createdBy: 'me',
      groupPrivacy: { ...DEFAULT_GROUP_PRIVACY },
    };

    onCreated(newChat);
  };

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
          onClick={step === 'details' ? () => setStep('members') : onBack}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">
            {step === 'members' ? 'Новая группа' : 'Настройки группы'}
          </h2>
          {step === 'members' && (
            <p className="text-xs text-muted-foreground">
              {selectedIds.length > 0
                ? `Выбрано: ${selectedIds.length}`
                : 'Выберите участников'}
            </p>
          )}
        </div>
        {step === 'members' && selectedIds.length > 0 && (
          <button
            onClick={() => setStep('details')}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {step === 'members' ? (
          <motion.div
            key="members"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Selected chips */}
            {selectedIds.length > 0 && (
              <div className="px-4 py-2 flex flex-wrap gap-2 border-b border-border">
                {selectedIds.map(id => {
                  const u = users.find(x => x.id === id);
                  if (!u) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium rounded-full pl-2 pr-1 py-1"
                    >
                      {u.name.split(' ')[0]}
                      <button
                        onClick={() => toggleUser(id)}
                        className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Search */}
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Поиск пользователей..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto">
              {filtered.map(user => {
                const selected = selectedIds.includes(user.id);
                return (
                  <button
                    key={user.id}
                    onClick={() => toggleUser(user.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <Avatar name={user.name} size="md" online={user.online} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.online ? 'в сети' : `был(а) ${user.lastSeen || 'давно'}`}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        selected
                          ? 'bg-primary border-primary'
                          : 'border-muted-foreground/30',
                      )}
                    >
                      {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Users className="w-6 h-6 mb-2 opacity-50" />
                  <p className="text-sm">Пользователи не найдены</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto"
          >
            <form onSubmit={handleCreate} className="p-4 space-y-5">
              {/* Group icon placeholder */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedIds.length} участник(ов)
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Название группы
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Например: Проект Альфа"
                  autoFocus
                  maxLength={60}
                  className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Описание <span className="text-muted-foreground font-normal">(необязательно)</span>
                </label>
                <textarea
                  value={groupDesc}
                  onChange={e => setGroupDesc(e.target.value)}
                  placeholder="О чём эта группа?"
                  maxLength={200}
                  rows={3}
                  className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                />
              </div>

              {/* Members preview */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Участники ({selectedIds.length})
                </p>
                <div className="space-y-1">
                  {selectedIds.map(id => {
                    const u = users.find(x => x.id === id);
                    if (!u) return null;
                    return (
                      <div
                        key={id}
                        className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg"
                      >
                        <Avatar name={u.name} size="sm" />
                        <span className="text-sm text-foreground">{u.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!groupName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                Создать группу
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
