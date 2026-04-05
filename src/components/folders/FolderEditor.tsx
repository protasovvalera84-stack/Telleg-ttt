import { useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Search, UsersRound, Radio, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { users, type ChatFolder, type Chat, type Channel } from '@/data/mockData';
import { motion } from 'framer-motion';

interface FolderEditorProps {
  folder?: ChatFolder;
  availableChats: Chat[];
  availableChannels: Channel[];
  onBack: () => void;
  onSave: (folder: ChatFolder) => void;
}

const ICON_OPTIONS = ['📁', '👤', '👥', '📢', '💼', '🏠', '⭐', '🔖', '🤖', '🎮', '📚', '🎵', '✈️', '🛒', '❤️', '🔔'];

const TYPE_OPTIONS: { key: 'private' | 'group'; label: string; icon: string }[] = [
  { key: 'private', label: 'Все личные чаты', icon: '👤' },
  { key: 'group', label: 'Все группы', icon: '👥' },
];

function getChatName(chat: Chat) {
  if (chat.name) return chat.name;
  const other = chat.participants.find(p => p !== 'me');
  return users.find(u => u.id === other)?.name ?? 'Unknown';
}

/**
 * Split a combined includeChatIds array into chat IDs and channel IDs
 * using the actual available data as the source of truth.
 */
function splitIds(
  combined: string[],
  availableChannels: Channel[],
): { chatIds: string[]; channelIds: string[] } {
  const channelIdSet = new Set(availableChannels.map(c => c.id));
  const chatIds: string[] = [];
  const channelIds: string[] = [];
  for (const id of combined) {
    if (channelIdSet.has(id)) {
      channelIds.push(id);
    } else {
      chatIds.push(id);
    }
  }
  return { chatIds, channelIds };
}

export function FolderEditor({ folder, availableChats, availableChannels, onBack, onSave }: FolderEditorProps) {
  const isEditing = !!folder;

  // Split the saved includeChatIds into chats vs channels using actual data.
  const initial = splitIds(folder?.includeChatIds || [], availableChannels);

  const [name, setName] = useState(folder?.name || '');
  const [icon, setIcon] = useState(folder?.icon || '📁');
  const [includeTypes, setIncludeTypes] = useState<('private' | 'group')[]>(folder?.includeTypes || []);
  const [includeChannelsAll, setIncludeChannelsAll] = useState(folder?.includeChannels || false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>(initial.chatIds);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>(initial.channelIds);
  const [pickerSearch, setPickerSearch] = useState('');

  const toggleType = (type: 'private' | 'group') => {
    setIncludeTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type],
    );
  };

  const toggleChat = (chatId: string) => {
    setSelectedChatIds(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId],
    );
  };

  const toggleChannel = (channelId: string) => {
    setSelectedChannelIds(prev =>
      prev.includes(channelId) ? prev.filter(id => id !== channelId) : [...prev, channelId],
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: folder?.id || `folder-${Date.now()}`,
      name: name.trim(),
      icon,
      includeTypes,
      includeChannels: includeChannelsAll,
      // Merge chat IDs and channel IDs into a single array for storage.
      includeChatIds: [...selectedChatIds, ...selectedChannelIds],
      excludeChatIds: folder?.excludeChatIds || [],
    });
  };

  const isValid = name.trim().length >= 1;

  const filteredChats = availableChats.filter(c =>
    getChatName(c).toLowerCase().includes(pickerSearch.toLowerCase()),
  );
  const filteredChannels = availableChannels.filter(c =>
    c.name.toLowerCase().includes(pickerSearch.toLowerCase()),
  );

  const selectedCount = selectedChatIds.length + selectedChannelIds.length;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-card flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Редактировать папку' : 'Новая папка'}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-5">
          {/* Preview */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-3xl mb-2">
              {icon}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Иконка</label>
            <div className="grid grid-cols-8 gap-2">
              {ICON_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all',
                    icon === emoji ? 'bg-primary/10 ring-2 ring-primary scale-110' : 'bg-muted hover:bg-muted/80',
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Название папки</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Работа"
              maxLength={30}
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          {/* Include by type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Фильтр по типу</label>
            <div className="space-y-2">
              {TYPE_OPTIONS.map(opt => {
                const isSelected = includeTypes.includes(opt.key);
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleType(opt.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                    )}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className={cn('text-sm flex-1', isSelected ? 'text-primary font-medium' : 'text-foreground')}>
                      {opt.label}
                    </span>
                    <div className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30',
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setIncludeChannelsAll(!includeChannelsAll)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left',
                  includeChannelsAll ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
                )}
              >
                <span className="text-lg">📢</span>
                <span className={cn('text-sm flex-1', includeChannelsAll ? 'text-primary font-medium' : 'text-foreground')}>
                  Все каналы
                </span>
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  includeChannelsAll ? 'bg-primary border-primary' : 'border-muted-foreground/30',
                )}>
                  {includeChannelsAll && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </button>
            </div>
          </div>

          {/* ── Specific chats/channels picker ── */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Добавить конкретные чаты
              {selectedCount > 0 && (
                <span className="ml-1.5 text-xs text-primary font-normal">({selectedCount} выбрано)</span>
              )}
            </label>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={pickerSearch}
                onChange={e => setPickerSearch(e.target.value)}
                placeholder="Поиск чатов и каналов..."
                className="w-full bg-muted rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto rounded-xl border border-border">
              {/* Chats */}
              {filteredChats.length > 0 && (
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Чаты и группы</p>
                </div>
              )}
              {filteredChats.map(chat => {
                const chatName = getChatName(chat);
                const isGroup = chat.type === 'group';
                const isSelected = selectedChatIds.includes(chat.id);
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => toggleChat(chat.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left',
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/50',
                    )}
                  >
                    {isGroup ? (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <UsersRound className="w-4 h-4 text-primary" />
                      </div>
                    ) : (
                      <Avatar name={chatName} size="sm" />
                    )}
                    <span className={cn('text-sm flex-1 truncate', isSelected ? 'text-primary font-medium' : 'text-foreground')}>
                      {chatName}
                    </span>
                    <div className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30',
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}

              {/* Channels */}
              {filteredChannels.length > 0 && (
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Каналы</p>
                </div>
              )}
              {filteredChannels.map(ch => {
                const isSelected = selectedChannelIds.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => toggleChannel(ch.id)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left',
                      isSelected ? 'bg-primary/5' : 'hover:bg-muted/50',
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Radio className="w-4 h-4 text-primary" />
                    </div>
                    <span className={cn('text-sm flex-1 truncate', isSelected ? 'text-primary font-medium' : 'text-foreground')}>
                      {ch.name}
                    </span>
                    <div className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                      isSelected ? 'bg-primary border-primary' : 'border-muted-foreground/30',
                    )}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}

              {filteredChats.length === 0 && filteredChannels.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Zap className="w-6 h-6 mb-1 opacity-50" />
                  <p className="text-xs">Ничего не найдено</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            {isEditing ? 'Сохранить' : 'Создать папку'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
