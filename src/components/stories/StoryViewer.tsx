import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { users, type UserStory, type StoryItem } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

interface StoryViewerProps {
  stories: UserStory[];
  initialUserId: string;
  onClose: () => void;
  onMarkViewed: (userId: string, storyId: string) => void;
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function getColor(name: string) {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-teal-500'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function StoryContent({ item }: { item: StoryItem }) {
  if (item.type === 'text') {
    return (
      <div className={cn('w-full h-full flex items-center justify-center bg-gradient-to-br p-8', item.bgColor || 'from-blue-500 to-purple-600')}>
        <p className="text-white text-2xl font-bold text-center leading-relaxed drop-shadow-lg">
          {item.content}
        </p>
      </div>
    );
  }

  if (item.type === 'image') {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <img src={item.content} alt="" className="w-full h-full object-cover" />
      </div>
    );
  }

  if (item.type === 'video') {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <video src={item.content} className="w-full h-full object-cover" autoPlay muted>
          <track kind="captions" />
        </video>
      </div>
    );
  }

  return null;
}

export function StoryViewer({ stories, initialUserId, onClose, onMarkViewed }: StoryViewerProps) {
  // Find the index of the user whose story we're viewing.
  const userIndex = stories.findIndex(s => s.userId === initialUserId);
  const [currentUserIdx, setCurrentUserIdx] = useState(Math.max(userIndex, 0));
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentUserIdx];
  const currentItem = currentStory?.items[currentItemIdx];
  const user = currentStory ? users.find(u => u.id === currentStory.userId) : null;
  const userName = currentStory?.userId === 'me' ? 'Моя история' : (user?.name || 'Пользователь');

  // Mark as viewed.
  useEffect(() => {
    if (currentStory && currentItem) {
      onMarkViewed(currentStory.userId, currentItem.id);
    }
  }, [currentStory, currentItem, onMarkViewed]);

  // Auto-advance timer.
  useEffect(() => {
    if (!currentItem) return;
    setProgress(0);
    const duration = currentItem.duration * 1000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed >= duration) {
        clearInterval(timer);
        goNext();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentUserIdx, currentItemIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  const goNext = useCallback(() => {
    if (!currentStory) return;
    if (currentItemIdx < currentStory.items.length - 1) {
      setCurrentItemIdx(prev => prev + 1);
    } else if (currentUserIdx < stories.length - 1) {
      setCurrentUserIdx(prev => prev + 1);
      setCurrentItemIdx(0);
    } else {
      onClose();
    }
  }, [currentStory, currentItemIdx, currentUserIdx, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentItemIdx > 0) {
      setCurrentItemIdx(prev => prev - 1);
    } else if (currentUserIdx > 0) {
      setCurrentUserIdx(prev => prev - 1);
      const prevStory = stories[currentUserIdx - 1];
      setCurrentItemIdx(prevStory ? prevStory.items.length - 1 : 0);
    }
  }, [currentItemIdx, currentUserIdx, stories]);

  // Keyboard navigation.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  if (!currentStory || !currentItem) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
    >
      {/* Story container */}
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <StoryContent item={currentItem} />
          </motion.div>
        </AnimatePresence>

        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-30">
          {currentStory.items.map((item, i) => (
            <div key={item.id} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: i < currentItemIdx ? '100%' : i === currentItemIdx ? `${progress * 100}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 flex items-center gap-3 px-4 z-30">
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold', getColor(userName))}>
            {getInitials(userName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate drop-shadow">{userName}</p>
            <p className="text-white/70 text-[10px] drop-shadow">{currentItem.timestamp}</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/80 hover:text-white bg-black/30 hover:bg-black/50 rounded-full transition-colors">
            <X className="w-5 h-5 drop-shadow" />
          </button>
        </div>

        {/* Tap zones for navigation */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="Previous"
        />
        <button
          onClick={goNext}
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
          aria-label="Next"
        />

        {/* Arrow indicators (desktop) */}
        {currentUserIdx > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 rounded-full text-white/80 hover:text-white hover:bg-black/50 transition-colors hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {(currentItemIdx < currentStory.items.length - 1 || currentUserIdx < stories.length - 1) && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/30 rounded-full text-white/80 hover:text-white hover:bg-black/50 transition-colors hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
