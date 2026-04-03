import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Paperclip, Smile, Phone, MoreVertical, ArrowLeft, Users, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from './Avatar';
import { messages, users, chats as defaultChats, type Message, type Chat } from '@/data/mockData';
import { motion } from 'framer-motion';

interface ChatWindowProps {
  chatId: string;
  onBack?: () => void;
  onOpenGroupInfo?: () => void;
  extraChats?: Chat[];
  /** When set, the window shows a topic thread instead of the main chat. */
  topicId?: string;
  topicName?: string;
  topicIcon?: string;
  /** External messages for topics (managed by parent). */
  topicMessages?: Message[];
  onTopicMessageSent?: (msg: Message) => void;
}

export function ChatWindow({
  chatId,
  onBack,
  onOpenGroupInfo,
  extraChats = [],
  topicId,
  topicName,
  topicIcon,
  topicMessages,
  onTopicMessageSent,
}: ChatWindowProps) {
  const allChats = [...defaultChats, ...extraChats];
  const chat = allChats.find(c => c.id === chatId);

  // For regular chats, use local state from mock data.
  // For topics, use the externally-provided topicMessages.
  const [localMessages, setLocalMessages] = useState<Message[]>(messages[chatId] || []);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTopic = !!topicId;
  const displayMessages = useMemo(
    () => (isTopic ? (topicMessages || []) : localMessages),
    [isTopic, topicMessages, localMessages],
  );

  useEffect(() => {
    if (!isTopic) setLocalMessages(messages[chatId] || []);
  }, [chatId, isTopic]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [displayMessages]);

  if (!chat) return null;

  const otherUser = users.find(u => chat.participants.includes(u.id) && u.id !== 'me');
  const chatName = chat.name || otherUser?.name || 'Unknown';
  const isOnline = otherUser?.online;
  const isGroup = chat.type === 'group';

  // Header text depends on whether we're in a topic or the main chat.
  const headerTitle = isTopic ? topicName || 'Тема' : chatName;
  const headerSubtitle = isTopic
    ? chatName
    : isGroup
      ? `${chat.participants.length} участник(ов)`
      : isOnline ? 'в сети' : `был(а) ${otherUser?.lastSeen || 'давно'}`;

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      chatId: topicId || chatId,
      senderId: 'me',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    if (isTopic && onTopicMessageSent) {
      onTopicMessageSent(newMsg);
    } else {
      setLocalMessages(prev => [...prev, newMsg]);
    }
    setInput('');
  };

  const handleHeaderClick = () => {
    if (!isTopic && isGroup && onOpenGroupInfo) onOpenGroupInfo();
  };

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
          className={cn('flex items-center gap-3 flex-1 min-w-0', !isTopic && isGroup && 'cursor-pointer')}
          onClick={handleHeaderClick}
        >
          {isTopic ? (
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 text-lg">
              {topicIcon || <Hash className="w-5 h-5 text-muted-foreground" />}
            </div>
          ) : isGroup ? (
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          ) : (
            <Avatar name={chatName} size="md" online={isOnline} />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{headerTitle}</h3>
            <p className={cn('text-xs', !isTopic && !isGroup && isOnline ? 'text-online' : 'text-muted-foreground')}>
              {headerSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isGroup && !isTopic && (
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {displayMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            {isTopic ? (
              <>
                <Hash className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Нет сообщений в теме</p>
              </>
            ) : (
              <>
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Нет сообщений</p>
              </>
            )}
            <p className="text-xs mt-1">Напишите первое сообщение!</p>
          </div>
        )}
        {displayMessages.map((msg, i) => {
          const isOwn = msg.senderId === 'me';
          const sender = users.find(u => u.id === msg.senderId);
          const showGroupAvatar = isGroup || isTopic;
          const showAvatar = !isOwn && showGroupAvatar && (i === 0 || displayMessages[i - 1].senderId !== msg.senderId);
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
            >
              {!isOwn && showGroupAvatar && (
                <div className="w-8 mr-2 flex-shrink-0">
                  {showAvatar && sender && <Avatar name={sender.name} size="sm" />}
                </div>
              )}
              <div className={cn('max-w-[75%] px-3.5 py-2 text-sm', isOwn ? 'chat-bubble-own' : 'chat-bubble-other')}>
                {!isOwn && showGroupAvatar && showAvatar && sender && (
                  <p className="text-xs font-medium text-primary mb-0.5">{sender.name}</p>
                )}
                <p className="leading-relaxed">{msg.text}</p>
                <p className={cn('text-[10px] mt-1 text-right', isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground')}>
                  {msg.timestamp}{isOwn && ' ✓✓'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={isTopic ? `Сообщение в "${topicName}"...` : 'Сообщение...'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="w-full bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              'p-2 rounded-lg transition-all',
              input.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground',
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
