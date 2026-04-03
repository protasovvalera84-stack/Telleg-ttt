import { useState } from 'react';
import { ChatList } from '@/components/messenger/ChatList';
import { ChatWindow } from '@/components/messenger/ChatWindow';
import { EmptyChat } from '@/components/messenger/EmptyChat';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { CreateGroup } from '@/components/groups/CreateGroup';
import { GroupInfo } from '@/components/groups/GroupInfo';
import { ChannelFeed } from '@/components/channels/ChannelFeed';
import { CreateChannel } from '@/components/channels/CreateChannel';
import { ChannelInfo } from '@/components/channels/ChannelInfo';
import { CreatePost } from '@/components/channels/CreatePost';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  chats as defaultChats,
  defaultChannels,
  defaultChannelPosts,
  type Chat,
  type Channel,
  type ChannelPost,
} from '@/data/mockData';
import { AnimatePresence } from 'framer-motion';

type View =
  | 'chat'
  | 'settings'
  | 'admin'
  | 'create-group'
  | 'group-info'
  | 'create-channel'
  | 'channel-info'
  | 'create-post';

const Index = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [view, setView] = useState<View>('chat');
  const [createdGroups, setCreatedGroups] = useState<Chat[]>([]);
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [channelPosts, setChannelPosts] = useState<Record<string, ChannelPost[]>>(defaultChannelPosts);
  const isMobile = useIsMobile();

  const showSidebar = !isMobile || (!activeChatId && !activeChannelId);
  const showContent = !isMobile || !!activeChatId || !!activeChannelId;

  const allChats = [...defaultChats, ...createdGroups];
  const activeChat = activeChatId ? allChats.find(c => c.id === activeChatId) : null;
  const activeChannel = activeChannelId ? channels.find(c => c.id === activeChannelId) : null;

  /* ── Chat / Group handlers ── */
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveChannelId(null);
  };

  const handleGroupCreated = (newChat: Chat) => {
    setCreatedGroups(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
    setActiveChannelId(null);
    setView('chat');
  };

  const handleLeaveGroup = (chatId: string) => {
    setCreatedGroups(prev => prev.filter(c => c.id !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
    setView('chat');
  };

  /* ── Channel handlers ── */
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveChatId(null);
  };

  const handleChannelCreated = (channel: Channel) => {
    setChannels(prev => [...prev, channel]);
    setChannelPosts(prev => ({ ...prev, [channel.id]: [] }));
    setActiveChannelId(channel.id);
    setActiveChatId(null);
    setView('chat');
  };

  const handleToggleSubscribe = (channelId: string) => {
    setChannels(prev =>
      prev.map(ch =>
        ch.id === channelId
          ? {
              ...ch,
              subscribed: !ch.subscribed,
              subscriberCount: ch.subscribed
                ? ch.subscriberCount - 1
                : ch.subscriberCount + 1,
            }
          : ch,
      ),
    );
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels(prev => prev.filter(ch => ch.id !== channelId));
    setChannelPosts(prev => {
      const next = { ...prev };
      delete next[channelId];
      return next;
    });
    if (activeChannelId === channelId) setActiveChannelId(null);
    setView('chat');
  };

  const handlePostCreated = (post: ChannelPost) => {
    setChannelPosts(prev => ({
      ...prev,
      [post.channelId]: [post, ...(prev[post.channelId] || [])],
    }));
    setView('chat');
  };

  const handleBack = () => {
    setActiveChatId(null);
    setActiveChannelId(null);
  };

  /* ── Render ── */
  const renderContent = () => {
    // Channel feed
    if (activeChannelId && activeChannel) {
      return (
        <ChannelFeed
          channel={activeChannel}
          posts={channelPosts[activeChannelId] || []}
          onBack={isMobile ? handleBack : undefined}
          onOpenInfo={() => setView('channel-info')}
          onCreatePost={() => setView('create-post')}
        />
      );
    }

    // Chat window
    if (activeChatId) {
      return (
        <ChatWindow
          chatId={activeChatId}
          onBack={isMobile ? handleBack : undefined}
          onOpenGroupInfo={
            activeChat?.type === 'group' ? () => setView('group-info') : undefined
          }
          extraChats={createdGroups}
        />
      );
    }

    return <EmptyChat />;
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      {showSidebar && (
        <div className={isMobile ? 'w-full' : 'w-80 xl:w-96 flex-shrink-0'}>
          <ChatList
            activeChatId={activeChatId}
            activeChannelId={activeChannelId}
            onSelectChat={handleSelectChat}
            onSelectChannel={handleSelectChannel}
            onOpenSettings={() => setView('settings')}
            onOpenAdmin={() => setView('admin')}
            onCreateGroup={() => setView('create-group')}
            onCreateChannel={() => setView('create-channel')}
            extraChats={createdGroups}
            channels={channels}
          />
        </div>
      )}
      {showContent && (
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      )}
      <AnimatePresence>
        {view === 'settings' && <ProfileSettings onBack={() => setView('chat')} />}
        {view === 'admin' && <AdminPanel onBack={() => setView('chat')} />}
        {view === 'create-group' && (
          <CreateGroup onBack={() => setView('chat')} onCreated={handleGroupCreated} />
        )}
        {view === 'group-info' && activeChat?.type === 'group' && (
          <GroupInfo chat={activeChat} onBack={() => setView('chat')} onLeave={handleLeaveGroup} />
        )}
        {view === 'create-channel' && (
          <CreateChannel onBack={() => setView('chat')} onCreated={handleChannelCreated} />
        )}
        {view === 'channel-info' && activeChannel && (
          <ChannelInfo
            channel={activeChannel}
            onBack={() => setView('chat')}
            onToggleSubscribe={handleToggleSubscribe}
            onDelete={activeChannel.isOwner ? handleDeleteChannel : undefined}
          />
        )}
        {view === 'create-post' && activeChannelId && (
          <CreatePost
            channelId={activeChannelId}
            onBack={() => setView('chat')}
            onCreated={handlePostCreated}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
