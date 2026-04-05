import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { users, type UserStory } from '@/data/mockData';

interface StoriesBarProps {
  stories: UserStory[];
  myStory: UserStory | null;
  onViewStory: (userId: string) => void;
  onCreateStory: () => void;
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

export function StoriesBar({ stories, myStory, onViewStory, onCreateStory }: StoriesBarProps) {
  const sorted = [...stories].sort((a, b) => {
    const aViewed = a.items.every(item => a.viewedIds.includes(item.id));
    const bViewed = b.items.every(item => b.viewedIds.includes(item.id));
    if (aViewed === bViewed) return 0;
    return aViewed ? 1 : -1;
  });

  const hasMyStory = myStory && myStory.items.length > 0;

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 overflow-x-auto scrollbar-none border-b border-border">
      {/* Create story button — always visible */}
      <button
        onClick={onCreateStory}
        className="flex flex-col items-center gap-1 flex-shrink-0"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-muted">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-card">
            <Plus className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground w-14 text-center truncate">
          Добавить
        </span>
      </button>

      {/* My story — shown separately when exists */}
      {hasMyStory && (
        <button
          onClick={() => onViewStory('me')}
          className="flex flex-col items-center gap-1 flex-shrink-0"
        >
          <div className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm',
            'ring-2 ring-primary ring-offset-2 ring-offset-card',
            'bg-gradient-to-br from-violet-500 to-fuchsia-500',
          )}>
            {getInitials('Я')}
          </div>
          <span className="text-[10px] text-foreground font-medium w-14 text-center truncate">
            Моя
          </span>
        </button>
      )}

      {/* Other users' stories */}
      {sorted.map(story => {
        const user = users.find(u => u.id === story.userId);
        if (!user || story.userId === 'me') return null;
        const allViewed = story.items.every(item => story.viewedIds.includes(item.id));
        const firstName = user.name.split(' ')[0];

        return (
          <button
            key={story.userId}
            onClick={() => onViewStory(story.userId)}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm ring-2 ring-offset-2 ring-offset-card',
                allViewed ? 'ring-muted-foreground/30' : 'ring-primary',
                getColor(user.name),
              )}
            >
              {getInitials(user.name)}
            </div>
            <span className={cn(
              'text-[10px] w-14 text-center truncate',
              allViewed ? 'text-muted-foreground' : 'text-foreground font-medium',
            )}>
              {firstName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
