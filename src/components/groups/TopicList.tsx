import { ArrowLeft, Plus, Hash, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { users, type Topic } from '@/data/mockData';
import { motion } from 'framer-motion';

interface TopicListProps {
  groupName: string;
  topics: Topic[];
  activeTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onCreateTopic: () => void;
  onBack: () => void;
}

export function TopicList({
  groupName,
  topics,
  activeTopicId,
  onSelectTopic,
  onCreateTopic,
  onBack,
}: TopicListProps) {
  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-3 flex items-center gap-2 border-b border-border">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-foreground truncate">{groupName}</h2>
          <p className="text-xs text-muted-foreground">Темы</p>
        </div>
      </div>

      {/* Create topic button */}
      <button
        onClick={onCreateTopic}
        className="flex items-center gap-3 px-3 py-3 hover:bg-chat-hover transition-colors text-left border-b border-border/50"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary">Новая тема</p>
          <p className="text-xs text-muted-foreground">Создать ветку обсуждения</p>
        </div>
      </button>

      {/* Topic list */}
      <div className="flex-1 overflow-y-auto">
        {topics.map(topic => {
          const isActive = topic.id === activeTopicId;
          const lastMsg = topic.lastMessage;
          const senderName = lastMsg?.senderId
            ? lastMsg.senderId === 'me'
              ? 'Вы'
              : users.find(u => u.id === lastMsg.senderId)?.name?.split(' ')[0] || ''
            : '';

          return (
            <motion.button
              key={topic.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onSelectTopic(topic.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 transition-colors text-left',
                isActive ? 'bg-chat-active' : 'hover:bg-chat-hover',
              )}
            >
              {/* Topic icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg',
                  isActive ? 'bg-primary-foreground/20' : 'bg-muted',
                )}
              >
                {topic.icon || <Hash className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-medium text-sm truncate',
                      isActive ? 'text-chat-active-foreground' : 'text-foreground',
                    )}
                  >
                    {topic.name}
                  </span>
                  <span
                    className={cn(
                      'text-xs flex-shrink-0 ml-2',
                      isActive ? 'text-chat-active-foreground/70' : 'text-muted-foreground',
                    )}
                  >
                    {lastMsg?.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p
                    className={cn(
                      'text-xs truncate',
                      isActive ? 'text-chat-active-foreground/70' : 'text-muted-foreground',
                    )}
                  >
                    {senderName && <span className="text-primary">{senderName}: </span>}
                    {lastMsg?.text || 'Нет сообщений'}
                  </p>
                  {topic.messageCount > 0 && (
                    <span
                      className={cn(
                        'ml-2 flex-shrink-0 flex items-center gap-0.5 text-[10px]',
                        isActive ? 'text-chat-active-foreground/60' : 'text-muted-foreground',
                      )}
                    >
                      <MessageSquare className="w-3 h-3" />
                      {topic.messageCount}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}

        {topics.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Hash className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Тем пока нет</p>
            <p className="text-xs mt-1">Создайте первую тему</p>
          </div>
        )}
      </div>
    </div>
  );
}
