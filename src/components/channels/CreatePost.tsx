import { useState, useRef, type FormEvent } from 'react';
import { ArrowLeft, Image, Film, Music, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ChannelPost, type PostMedia } from '@/data/mockData';
import { motion } from 'framer-motion';

interface CreatePostProps {
  channelId: string;
  onBack: () => void;
  onCreated: (post: ChannelPost) => void;
}

const ACCEPT_MAP: Record<string, string> = {
  image: 'image/*',
  video: 'video/*',
  audio: 'audio/*',
};

const ICON_MAP: Record<string, typeof Image> = {
  image: Image,
  video: Film,
  audio: Music,
};

export function CreatePost({ channelId, onBack, onCreated }: CreatePostProps) {
  const [text, setText] = useState('');
  const [media, setMedia] = useState<PostMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingType, setPendingType] = useState<PostMedia['type']>('image');

  const openFilePicker = (type: PostMedia['type']) => {
    setPendingType(type);
    if (fileRef.current) {
      fileRef.current.accept = ACCEPT_MAP[type];
      fileRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setMedia(prev => [...prev, { type: pendingType, url, name: file.name }]);
    });

    // Reset so the same file can be selected again.
    e.target.value = '';
  };

  const removeMedia = (index: number) => {
    setMedia(prev => {
      const removed = prev[index];
      if (removed.url.startsWith('blob:')) URL.revokeObjectURL(removed.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() && media.length === 0) return;

    setLoading(true);
    // Simulate network delay.
    await new Promise(r => setTimeout(r, 400));

    const post: ChannelPost = {
      id: `cp-${Date.now()}`,
      channelId,
      text: text.trim() || undefined,
      media: media.length > 0 ? media : undefined,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      views: 0,
    };

    onCreated(post);
    setLoading(false);
  };

  const hasContent = text.trim() || media.length > 0;

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
        <h2 className="text-lg font-semibold text-foreground flex-1">Новый пост</h2>
        <button
          onClick={handleSubmit}
          disabled={!hasContent || loading}
          className={cn(
            'p-2 rounded-lg transition-all',
            hasContent && !loading
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'text-muted-foreground opacity-50',
          )}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Text */}
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Напишите что-нибудь..."
            autoFocus
            rows={5}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm resize-none leading-relaxed"
          />

          {/* Media previews */}
          {media.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">
                Вложения ({media.length})
              </p>
              {media.map((m, i) => {
                const Icon = ICON_MAP[m.type] || Image;
                return (
                  <div
                    key={i}
                    className="relative bg-muted rounded-xl overflow-hidden"
                  >
                    {m.type === 'image' && (
                      <img
                        src={m.url}
                        alt={m.name || ''}
                        className="w-full max-h-48 object-cover"
                      />
                    )}
                    {m.type === 'video' && (
                      <video
                        src={m.url}
                        className="w-full max-h-48"
                        preload="metadata"
                      >
                        <track kind="captions" />
                      </video>
                    )}
                    {m.type === 'audio' && (
                      <div className="flex items-center gap-3 p-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm text-foreground truncate flex-1">
                          {m.name || 'Аудио'}
                        </p>
                      </div>
                    )}

                    {/* Type badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      <Icon className="w-3 h-3" />
                      {m.type === 'image' ? 'Фото' : m.type === 'video' ? 'Видео' : 'Аудио'}
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </form>
      </div>

      {/* Bottom toolbar */}
      <div className="px-4 py-3 bg-card border-t border-border">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openFilePicker('image')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Image className="w-5 h-5" />
            <span className="text-xs">Фото</span>
          </button>
          <button
            type="button"
            onClick={() => openFilePicker('video')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Film className="w-5 h-5" />
            <span className="text-xs">Видео</span>
          </button>
          <button
            type="button"
            onClick={() => openFilePicker('audio')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Music className="w-5 h-5" />
            <span className="text-xs">Музыка</span>
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </div>
    </motion.div>
  );
}
