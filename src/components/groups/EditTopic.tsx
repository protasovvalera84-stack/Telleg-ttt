import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Topic } from '@/data/mockData';
import { motion } from 'framer-motion';

interface EditTopicProps {
  topic: Topic;
  onBack: () => void;
  onSave: (updated: Topic) => void;
  onDelete: (topicId: string) => void;
}

const ICON_OPTIONS = ['💬', '📋', '💡', '🎉', '🔥', '📌', '🎯', '🛠️', '📢', '❓', '🎨', '📊', '🏆', '🌍', '📚', '🎵'];

export function EditTopic({ topic, onBack, onSave, onDelete }: EditTopicProps) {
  const [name, setName] = useState(topic.name);
  const [icon, setIcon] = useState(topic.icon);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasChanges = name.trim() !== topic.name || icon !== topic.icon;
  const isValid = name.trim().length >= 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || !hasChanges) return;

    onSave({
      ...topic,
      name: name.trim(),
      icon,
    });
  };

  const handleDelete = () => {
    onDelete(topic.id);
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
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground flex-1">Редактировать тему</h2>
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
              placeholder="Название темы"
              autoFocus
              maxLength={60}
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-1">
            <p className="text-xs text-muted-foreground">
              Создана: {topic.createdAt}
            </p>
            <p className="text-xs text-muted-foreground">
              Сообщений: {topic.messageCount}
            </p>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={!isValid || !hasChanges}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Сохранить изменения
          </button>

          {/* Delete */}
          <div className="pt-2">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive rounded-xl py-3 text-sm font-medium transition-colors hover:bg-destructive/20"
              >
                <Trash2 className="w-4 h-4" />
                Удалить тему
              </button>
            ) : (
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
                <p className="text-sm text-foreground text-center">
                  Удалить тему <span className="font-semibold">"{topic.name}"</span>?
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Все сообщения в этой теме будут потеряны
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
