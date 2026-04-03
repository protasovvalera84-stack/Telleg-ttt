import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Topic } from '@/data/mockData';
import { motion } from 'framer-motion';

interface CreateTopicProps {
  groupId: string;
  onBack: () => void;
  onCreated: (topic: Topic) => void;
}

const ICON_OPTIONS = ['💬', '📋', '💡', '🎉', '🔥', '📌', '🎯', '🛠️', '📢', '❓', '🎨', '📊', '🏆', '🌍', '📚', '🎵'];

export function CreateTopic({ groupId, onBack, onCreated }: CreateTopicProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💬');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      groupId,
      name: name.trim(),
      icon,
      createdBy: 'me',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      messageCount: 0,
    };

    onCreated(newTopic);
  };

  const isValid = name.trim().length >= 1;

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
        <h2 className="text-lg font-semibold text-foreground">Новая тема</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl mb-2">
              {icon}
            </div>
            <p className="text-xs text-muted-foreground">Иконка темы</p>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Выберите иконку
            </label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all',
                    icon === emoji
                      ? 'bg-primary/10 ring-2 ring-primary scale-110'
                      : 'bg-muted hover:bg-muted/80',
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Название темы
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Обсуждение проекта"
              autoFocus
              maxLength={60}
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Тема — это отдельная ветка обсуждения внутри группы. Участники группы смогут писать сообщения в каждой теме независимо.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Создать тему
          </button>
        </form>
      </div>
    </motion.div>
  );
}
