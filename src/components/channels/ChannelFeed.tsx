import { useRef } from 'react';
import { ArrowLeft, Eye, Radio, Plus, Image, Play, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Channel, type ChannelPost, type PostMedia } from '@/data/mockData';
import { motion } from 'framer-motion';

interface ChannelFeedProps {
  channel: Channel;
  posts: ChannelPost[];
  onBack?: () => void;
  onOpenInfo: () => void;
  onCreatePost: () => void;
}

function MediaItem({ media }: { media: PostMedia }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  if (media.type === 'image') {
    return (
      <img
        src={media.url}
        alt={media.name || 'image'}
        className="w-full rounded-lg object-cover max-h-80"
        loading="lazy"
      />
    );
  }

  if (media.type === 'video') {
    return (
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          src={media.url}
          controls
          preload="metadata"
          className="w-full max-h-80"
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  if (media.type === 'audio') {
    return (
      <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Music className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {media.name || 'Аудио'}
          </p>
          <audio ref={audioRef} src={media.url} controls preload="metadata" className="w-full mt-1 h-8">
            <track kind="captions" />
          </audio>
        </div>
      </div>
    );
  }

  return null;
}

function MediaTypeIcon({ type }: { type: PostMedia['type'] }) {
  if (type === 'image') return <Image className="w-3 h-3" />;
  if (type === 'video') return <Play className="w-3 h-3" />;
  return <Music className="w-3 h-3" />;
}

function PostCard({ post }: { post: ChannelPost }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="space-y-2 p-3 pb-0">
          {post.media.map((m, i) => (
            <MediaItem key={i} media={m} />
          ))}
        </div>
      )}

      {/* Text */}
      {post.text && (
        <div className="px-4 pt-3">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {post.text}
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
        <div className="flex items-center gap-3">
          {post.media && post.media.length > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              {[...new Set(post.media.map(m => m.type))].map(type => (
                <MediaTypeIcon key={type} type={type} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs">
              {post.views >= 1000 ? `${(post.views / 1000).toFixed(1)}K` : post.views}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ChannelFeed({ channel, posts, onBack, onOpenInfo, onCreatePost }: ChannelFeedProps) {
  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        {onBack && (
          <button onClick={onBack} className="p-1 hover:bg-muted rounded-lg transition-colors mr-1">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={onOpenInfo}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Radio className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{channel.name}</h3>
            <p className="text-xs text-muted-foreground">
              {channel.subscriberCount.toLocaleString('ru-RU')} подписчик(ов)
            </p>
          </div>
        </div>
        {channel.isOwner && (
          <button
            onClick={onCreatePost}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            title="Новый пост"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Posts feed */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Radio className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Нет публикаций</p>
            {channel.isOwner && (
              <button
                onClick={onCreatePost}
                className={cn(
                  'mt-3 flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors',
                )}
              >
                <Plus className="w-4 h-4" />
                Создать первый пост
              </button>
            )}
          </div>
        )}
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
