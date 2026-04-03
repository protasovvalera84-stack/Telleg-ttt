import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Megaphone } from 'lucide-react';
import { type Channel } from '@/data/mockData';
import { motion } from 'framer-motion';

interface CreateChannelProps {
  onBack: () => void;
  onCreated: (channel: Channel) => void;
}

export function CreateChannel({ onBack, onCreated }: CreateChannelProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newChannel: Channel = {
      id: `ch-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || undefined,
      subscriberCount: 1,
      createdAt: new Date().toLocaleDateString('ru-RU'),
      createdBy: 'me',
      subscribed: true,
      isOwner: true,
    };

    onCreated(newChannel);
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
        <h2 className="text-lg font-semibold text-foreground">Новый канал</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Icon */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Megaphone className="w-10 h-10 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Ваш канал</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Название канала
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Мой блог"
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
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="О чём этот канал?"
              maxLength={200}
              rows={3}
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
            />
          </div>

          {/* Info */}
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Канал — это инструмент для публикации контента. Вы сможете добавлять текст, картинки, видео и музыку. Подписчики будут видеть ваши посты в ленте.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Создать канал
          </button>
        </form>
      </div>
    </motion.div>
  );
}
