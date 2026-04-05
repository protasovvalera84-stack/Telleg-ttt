import { useState } from 'react';
import { Search, LayoutGrid, SlidersHorizontal, UsersRound, Zap, Plus, Radio, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { chats as defaultChats, users, type Chat, type Channel, type ChatFolder } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'chats' | 'groups' | 'channels';

interface ChatListProps {
  activeChatId: string | null;
  activeChannelId: string | null;
  onSelectChat: (chatId: string) => void;
  onSelectChannel: (channelId: string) => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onCreateGroup: () => void;
  onCreateChannel: () => void;
  onManageFolders: () => void;
  extraChats?: Chat[];
  channels?: Channel[];
  folders?: ChatFolder[];
  /** Slot for stories bar rendered above folder tabs. */
  storiesSlot?: React.ReactNode;
}

function getChatName(chat: Chat) {
  if (chat.name) return chat.name;
  const other = chat.participants.find(p => p !== 'me');
  return users.find(u => u.id === other)?.name ?? 'Unknown';
}

function getChatUser(chat: Chat) {
  const other = chat.participants.find(p => p !== 'me');
  return users.find(u => u.id === other);
}

/** Check if a chat matches a folder's filter criteria. */
function chatMatchesFolder(chat: Chat, folder: ChatFolder): boolean {
  if (folder.excludeChatIds.includes(chat.id)) return false;
  if (folder.includeChatIds.includes(chat.id)) return true;
  if (folder.includeTypes.length > 0 && folder.includeTypes.includes(chat.type)) return true;
  return false;
}

export function ChatList({
  activeChatId,
  activeChannelId,
  onSelectChat,
  onSelectChannel,
  onOpenSettings,
  onOpenAdmin,
  onCreateGroup,
  onCreateChannel,
  onManageFolders,
  extraChats = [],
  channels = [],
  folders = [],
  storiesSlot,
}: ChatListProps) {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('chats');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const allChats = [...defaultChats, ...extraChats];
  const activeFolder = activeFolderId ? folders.find(f => f.id === activeFolderId) : null;

  // Apply folder filter.
  const folderFilteredChats = activeFolder
    ? allChats.filter(chat => chatMatchesFolder(chat, activeFolder))
    : allChats;

  const folderFilteredChannels = activeFolder
    ? channels.filter(ch =>
        activeFolder.includeChannels ||
        activeFolder.includeChatIds.includes(ch.id),
      )
    : channels;

  const visibleChats = folderFilteredChats.filter(chat => {
    const matchesSearch = getChatName(chat).toLowerCase().includes(search.toLowerCase());
    if (tab === 'groups') return chat.type === 'group' && matchesSearch;
    return matchesSearch;
  });

  const visibleChannels = folderFilteredChannels.filter(ch =>
    ch.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Determine which tabs to show based on folder.
  const showChannelsTab = !activeFolderId || folderFilteredChannels.length > 0;
  const showGroupsTab = !activeFolderId || folderFilteredChats.some(c => c.type === 'group');

  const tabs: { key: Tab; label: string; visible: boolean }[] = [
    { key: 'chats', label: 'Чаты', visible: true },
    { key: 'groups', label: 'Группы', visible: showGroupsTab },
    { key: 'channels', label: 'Каналы', visible: showChannelsTab },
  ];

  const visibleTabs = tabs.filter(t => t.visible);

  // Reset tab if current tab is hidden by folder filter.
  if (!visibleTabs.find(t => t.key === tab)) {
    // This is a render-time side effect, but safe since it only happens on folder change.
    // We handle it by checking in the render.
  }
  const effectiveTab = visibleTabs.find(t => t.key === tab) ? tab : 'chats';

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-3 flex items-center gap-2 border-b border-border">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <LayoutGrid className="w-5 h-5 text-muted-foreground" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute left-0 top-full mt-1 z-50 w-56 bg-popover border border-border rounded-xl shadow-xl overflow-hidden"
              >
                <button
                  onClick={() => { onCreateGroup(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted transition-colors text-foreground"
                >
                  <Plus className="w-4 h-4 text-muted-foreground" />
                  Новая группа
                </button>
                <button
                  onClick={() => { onCreateChannel(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted transition-colors text-foreground"
                >
                  <Radio className="w-4 h-4 text-muted-foreground" />
                  Новый канал
                </button>
                <button
                  onClick={() => { onManageFolders(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted transition-colors text-foreground"
                >
                  <FolderOpen className="w-4 h-4 text-muted-foreground" />
                  Папки чатов
                </button>
                <button
                  onClick={() => { onOpenSettings(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted transition-colors text-foreground"
                >
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  Настройки
                </button>
                <button
                  onClick={() => { onOpenAdmin(); setMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-muted transition-colors text-foreground"
                >
                  <UsersRound className="w-4 h-4 text-muted-foreground" />
                  Админ-панель
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-muted rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Stories bar */}
      {storiesSlot}

      {/* Folder tabs (horizontal scroll) */}
      {folders.length > 0 && (
        <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveFolderId(null); setTab('chats'); }}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              !activeFolderId ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
            )}
          >
            Все
          </button>
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => { setActiveFolderId(folder.id); setTab('chats'); }}
              className={cn(
                'flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                activeFolderId === folder.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <span className="text-sm">{folder.icon}</span>
              {folder.name}
            </button>
          ))}
        </div>
      )}

      {/* Type tabs */}
      <div className="flex border-b border-border">
        {visibleTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 py-2.5 text-xs font-medium transition-colors relative',
              effectiveTab === t.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
            {effectiveTab === t.key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* ── Channels tab ── */}
        {effectiveTab === 'channels' && (
          <>
            <button
              onClick={onCreateChannel}
              className="w-full flex items-center gap-3 px-3 py-3 hover:bg-chat-hover transition-colors text-left border-b border-border/50"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">Создать канал</p>
                <p className="text-xs text-muted-foreground">Публикуйте контент</p>
              </div>
            </button>

            {visibleChannels.map(ch => {
              const isActive = ch.id === activeChannelId;
              return (
                <button
                  key={ch.id}
                  onClick={() => onSelectChannel(ch.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 transition-colors text-left',
                    isActive ? 'bg-chat-active' : 'hover:bg-chat-hover',
                  )}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Radio className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn('font-medium text-sm truncate', isActive ? 'text-chat-active-foreground' : 'text-foreground')}>
                        {ch.name}
                      </span>
                      {ch.isOwner && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ml-1">
                          мой
                        </span>
                      )}
                    </div>
                    <p className={cn('text-xs truncate mt-0.5', isActive ? 'text-chat-active-foreground/70' : 'text-muted-foreground')}>
                      {ch.subscriberCount.toLocaleString('ru-RU')} подписчик(ов)
                    </p>
                  </div>
                </button>
              );
            })}

            {visibleChannels.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Radio className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Каналов пока нет</p>
              </div>
            )}
          </>
        )}

        {/* ── Groups tab ── */}
        {effectiveTab === 'groups' && (
          <button
            onClick={onCreateGroup}
            className="w-full flex items-center gap-3 px-3 py-3 hover:bg-chat-hover transition-colors text-left border-b border-border/50"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">Создать группу</p>
              <p className="text-xs text-muted-foreground">Добавьте участников</p>
            </div>
          </button>
        )}

        {/* ── Chats / Groups list ── */}
        {effectiveTab !== 'channels' && (
          <>
            {visibleChats.map(chat => {
              const name = getChatName(chat);
              const user = getChatUser(chat);
              const isActive = chat.id === activeChatId;
              const lastMsg = chat.lastMessage;
              const isGroup = chat.type === 'group';

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-3 transition-colors text-left',
                    isActive ? 'bg-chat-active' : 'hover:bg-chat-hover',
                  )}
                >
                  {isGroup ? (
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UsersRound className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  ) : (
                    <Avatar name={name} size="lg" online={user?.online} />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={cn('font-medium text-sm truncate', isActive ? 'text-chat-active-foreground' : 'text-foreground')}>
                        {name}
                      </span>
                      <span className={cn('text-xs flex-shrink-0 ml-2', isActive ? 'text-chat-active-foreground/70' : 'text-muted-foreground')}>
                        {lastMsg?.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className={cn('text-xs truncate', isActive ? 'text-chat-active-foreground/70' : 'text-muted-foreground')}>
                        {isGroup && lastMsg?.senderId && (
                          <span className="text-primary">
                            {lastMsg.senderId === 'me'
                              ? 'Вы: '
                              : `${users.find(u => u.id === lastMsg.senderId)?.name?.split(' ')[0] || ''}: `}
                          </span>
                        )}
                        {!isGroup && lastMsg?.senderId === 'me' && (
                          <span className="text-primary">Вы: </span>
                        )}
                        {lastMsg?.text}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="ml-2 flex-shrink-0 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {visibleChats.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                {effectiveTab === 'groups' ? (
                  <>
                    <UsersRound className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Групп пока нет</p>
                  </>
                ) : (
                  <>
                    <Zap className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Чаты не найдены</p>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
