import { useState, useEffect, useRef } from 'react';
import { Search, Clock, Smile, Hand, User, Dog, UtensilsCrossed, Plane, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

/* ── Emoji data by category ── */

const CATEGORIES = [
  { id: 'recent', label: 'Недавние', icon: Clock },
  { id: 'smileys', label: 'Смайлы', icon: Smile },
  { id: 'gestures', label: 'Жесты', icon: Hand },
  { id: 'people', label: 'Люди', icon: User },
  { id: 'animals', label: 'Животные', icon: Dog },
  { id: 'food', label: 'Еда', icon: UtensilsCrossed },
  { id: 'travel', label: 'Путешествия', icon: Plane },
  { id: 'objects', label: 'Объекты', icon: Lightbulb },
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

const EMOJI_DATA: Record<Exclude<CategoryId, 'recent'>, string[]> = {
  smileys: [
    '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊',
    '😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋',
    '😛','😜','🤪','😝','🤑','🤗','🤭','🫢','🤫','🤔',
    '🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄',
    '😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕',
    '🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸',
    '😎','🤓','🧐','😕','🫤','😟','🙁','😮','😯','😲',
    '😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭',
    '😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡',
    '😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺',
    '👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽',
    '🙀','😿','😾','❤️','🧡','💛','💚','💙','💜','🖤',
    '🤍','🤎','💔','❤️‍🔥','❤️‍🩹','💕','💞','💓','💗','💖',
    '💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯',
  ],
  gestures: [
    '👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌',
    '🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉',
    '👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛',
    '🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅',
    '🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠',
    '🫀','🫁','🦷','🦴','👀','👁️','👅','👄','🫦','💋',
  ],
  people: [
    '👶','👧','🧒','👦','👩','🧑','👨','👩‍🦱','🧑‍🦱','👨‍🦱',
    '👩‍🦰','🧑‍🦰','👨‍🦰','👱‍♀️','👱','👱‍♂️','👩‍🦳','🧑‍🦳','👨‍🦳','👩‍🦲',
    '🧑‍🦲','👨‍🦲','🧔‍♀️','🧔','🧔‍♂️','👵','🧓','👴','👲','👳‍♀️',
    '👳','👳‍♂️','🧕','👮‍♀️','👮','👮‍♂️','👷‍♀️','👷','👷‍♂️','💂‍♀️',
    '💂','💂‍♂️','🕵️‍♀️','🕵️','🕵️‍♂️','👩‍⚕️','🧑‍⚕️','👨‍⚕️','👩‍🌾','🧑‍🌾',
    '👨‍🌾','👩‍🍳','🧑‍🍳','👨‍🍳','👩‍🎓','🧑‍🎓','👨‍🎓','👩‍🎤','🧑‍🎤','👨‍🎤',
  ],
  animals: [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨',
    '🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊',
    '🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉',
    '🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌',
    '🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢',
    '🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡',
    '🐠','🐟','🐬','🐳','🐋','🦈','🦭','🐊','🐅','🐆',
    '🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘',
  ],
  food: [
    '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐',
    '🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑',
    '🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅',
    '🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳',
    '🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔',
    '🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗',
    '🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟',
    '🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡',
    '🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬',
    '🍫','🍿','🍩','🍪','🌰','🥜','🍯','☕','🍵','🧃',
  ],
  travel: [
    '🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐',
    '🛻','🚚','🚛','🚜','🏍️','🛵','🚲','🛴','🛹','🛼',
    '✈️','🛫','🛬','🪂','💺','🚀','🛸','🚁','🛶','⛵',
    '🚤','🛥️','🛳️','⛴️','🚢','🗼','🏰','🏯','🏟️','🎡',
    '🎢','🎠','⛲','⛱️','🏖️','🏝️','🏜️','🌋','⛰️','🏔️',
    '🗻','🏕️','🛖','🏠','🏡','🏢','🏣','🏤','🏥','🏦',
    '🌍','🌎','🌏','🗺️','🧭','🏳️','🏴','🚩','🎌','🏁',
  ],
  objects: [
    '⌚','📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','🕹️','🗜️',
    '💾','💿','📀','📼','📷','📸','📹','🎥','📽️','🎞️',
    '📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭',
    '⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋','🔌','💡',
    '🔦','🕯️','🧯','🛢️','💸','💵','💴','💶','💷','🪙',
    '💰','💳','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒️',
    '🛠️','⛏️','🪚','🔩','⚙️','🪤','🧱','⛓️','🧲','🔫',
    '🎵','🎶','🎤','🎧','📯','🎷','🪗','🎸','🎹','🎺',
    '🎻','🪕','🥁','🪘','📚','📖','📝','✏️','🖊️','🖋️',
    '⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱',
  ],
};

const RECENT_STORAGE_KEY = 'telleg_recent_emoji';
const MAX_RECENT = 32;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveRecent(emojis: string[]) {
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(emojis.slice(0, MAX_RECENT)));
}

/* ── Component ── */

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('smileys');
  const [search, setSearch] = useState('');
  const [recent, setRecent] = useState<string[]>(() => loadRecent());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on outside click.
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    const updated = [emoji, ...recent.filter(e => e !== emoji)].slice(0, MAX_RECENT);
    setRecent(updated);
    saveRecent(updated);
  };

  // Get emojis for current view.
  const getEmojis = (): string[] => {
    if (search) {
      // Search across all categories.
      const all = Object.values(EMOJI_DATA).flat();
      // Simple search: just return all (emoji search by character is limited without a name database).
      return all;
    }
    if (activeCategory === 'recent') return recent;
    return EMOJI_DATA[activeCategory] || [];
  };

  const emojis = getEmojis();

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full right-0 mb-2 w-80 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden z-50"
    >
      {/* Header with search */}
      <div className="p-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск эмодзи..."
            className="w-full bg-muted rounded-lg pl-8 pr-8 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex items-center border-b border-border px-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const hasItems = cat.id === 'recent' ? recent.length > 0 : true;
            if (!hasItems && cat.id === 'recent') return null;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); scrollRef.current?.scrollTo({ top: 0 }); }}
                className={cn(
                  'flex-1 py-2 flex items-center justify-center transition-colors relative',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
                title={cat.label}
              >
                <Icon className="w-4 h-4" />
                {isActive && (
                  <motion.div
                    layoutId="emoji-tab"
                    className="absolute bottom-0 left-1 right-1 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji grid */}
      <div ref={scrollRef} className="h-52 overflow-y-auto p-2">
        {!search && activeCategory !== 'recent' && (
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1 mb-1">
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </p>
        )}
        {!search && activeCategory === 'recent' && recent.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Clock className="w-6 h-6 mb-1 opacity-50" />
            <p className="text-xs">Нет недавних эмодзи</p>
          </div>
        )}
        <div className="grid grid-cols-8 gap-0.5">
          {emojis.map((emoji, i) => (
            <button
              key={`${emoji}-${i}`}
              onClick={() => handleSelect(emoji)}
              className="w-9 h-9 flex items-center justify-center text-xl hover:bg-muted rounded-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
