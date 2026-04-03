import { useState } from 'react';
import { ChatList } from '@/components/messenger/ChatList';
import { ChatWindow } from '@/components/messenger/ChatWindow';
import { EmptyChat } from '@/components/messenger/EmptyChat';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AdminPanel } from '@/components/admin/AdminPanel';
import { CreateGroup } from '@/components/groups/CreateGroup';
import { GroupInfo } from '@/components/groups/GroupInfo';
import { TopicList } from '@/components/groups/TopicList';
import { CreateTopic } from '@/components/groups/CreateTopic';
import { ChannelFeed } from '@/components/channels/ChannelFeed';
import { CreateChannel } from '@/components/channels/CreateChannel';
import { ChannelInfo } from '@/components/channels/ChannelInfo';
import { CreatePost } from '@/components/channels/CreatePost';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  chats as defaultChats,
  defaultChannels,
  defaultChannelPosts,
  defaultTopics,
  defaultTopicMessages,
  type Chat,
  type Channel,
  type ChannelPost,
  type Topic,
  type Message,
} from '@/data/mockData';
import { AnimatePresence } from 'framer-motion';

type View =
  | 'chat'
  | 'settings'
  | 'admin'
  | 'create-group'
  | 'group-info'
  | 'topics'
  | 'create-topic'
  | 'create-channel'
  | 'channel-info'
  | 'create-post';

const Index = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [view, setView] = useState<View>('chat');
  const [createdGroups, setCreatedGroups] = useState<Chat[]>([]);
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [channelPosts, setChannelPosts] = useState<Record<string, ChannelPost[]>>(defaultChannelPosts);
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  const [topicMessages, setTopicMessages] = useState<Record<string, Message[]>>(defaultTopicMessages);
  const isMobile = useIsMobile();

  const showSidebar = !isMobile || (!activeChatId && !activeChannelId);
  const showContent = !isMobile || !!activeChatId || !!activeChannelId;

  const allChats = [...defaultChats, ...createdGroups];
  const activeChat = activeChatId ? allChats.find(c => c.id === activeChatId) : null;
  const activeChannel = activeChannelId ? channels.find(c => c.id === activeChannelId) : null;
  const activeTopic = activeTopicId ? topics.find(t => t.id === activeTopicId) : null;
  const groupTopics = activeChatId ? topics.filter(t => t.groupId === activeChatId) : [];

  /* ── Chat / Group handlers ── */
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveChannelId(null);
    setActiveTopicId(null);
    // If it's a group, show topics view.
    const chat = [...defaultChats, ...createdGroups].find(c => c.id === chatId);
    if (chat?.type === 'group') {
      setView('topics');
    }
  };

  const handleGroupCreated = (newChat: Chat) => {
    setCreatedGroups(prev => [...prev, newChat]);
    // Create a default "Общее" topic for the new group.
    const generalTopic: Topic = {
      id: `topic-general-${newChat.id}`,
      groupId: newChat.id,
      name: 'Общее',
      icon: '💬',
      createdBy: 'me',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      messageCount: 0,
    };
    setTopics(prev => [...prev, generalTopic]);
    setTopicMessages(prev => ({ ...prev, [generalTopic.id]: [] }));
    setActiveChatId(newChat.id);
    setActiveChannelId(null);
    setActiveTopicId(null);
    setView('topics');
  };

  const handleLeaveGroup = (chatId: string) => {
    setCreatedGroups(prev => prev.filter(c => c.id !== chatId));
    setTopics(prev => prev.filter(t => t.groupId !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setActiveTopicId(null);
    }
    setView('chat');
  };

  const handleTopicCreated = (topic: Topic) => {
    setTopics(prev => [...prev, topic]);
    setTopicMessages(prev => ({ ...prev, [topic.id]: [] }));
    setActiveTopicId(topic.id);
    setView('chat');
  };

  const handleSelectTopic = (topicId: string) => {
    setActiveTopicId(topicId);
    setView('chat');
  };

  const handleTopicMessageSent = (msg: Message) => {
    if (!activeTopicId) return;
    setTopicMessages(prev => ({
      ...prev,
      [activeTopicId]: [...(prev[activeTopicId] || []), msg],
    }));
    // Update topic's lastMessage and messageCount.
    setTopics(prev =>
      prev.map(t =>
        t.id === activeTopicId
          ? {
              ...t,
              lastMessage: { text: msg.text, timestamp: msg.timestamp, senderId: msg.senderId },
              messageCount: t.messageCount + 1,
            }
          : t,
      ),
    );
  };

  /* ── Channel handlers ── */
  const handleSelectChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setActiveChatId(null);
    setActiveTopicId(null);
  };

  const handleChannelCreated = (channel: Channel) => {
    setChannels(prev => [...prev, channel]);
    setChannelPosts(prev => ({ ...prev, [channel.id]: [] }));
    setActiveChannelId(channel.id);
    setActiveChatId(null);
    setActiveTopicId(null);
    setView('chat');
  };

  const handleToggleSubscribe = (channelId: string) => {
    setChannels(prev =>
      prev.map(ch =>
        ch.id === channelId
          ? { ...ch, subscribed: !ch.subscribed, subscriberCount: ch.subscribed ? ch.subscriberCount - 1 : ch.subscriberCount + 1 }
          : ch,
      ),
    );
  };

  const handleDeleteChannel = (channelId: string) => {
    setChannels(prev => prev.filter(ch => ch.id !== channelId));
    setChannelPosts(prev => { const next = { ...prev }; delete next[channelId]; return next; });
    if (activeChannelId === channelId) setActiveChannelId(null);
    setView('chat');
  };

  const handlePostCreated = (post: ChannelPost) => {
    setChannelPosts(prev => ({ ...prev, [post.channelId]: [post, ...(prev[post.channelId] || [])] }));
    setView('chat');
  };

  const handleBack = () => {
    if (activeTopicId) {
      // Go back from topic to topic list.
      setActiveTopicId(null);
      setView('topics');
      return;
    }
    setActiveChatId(null);
    setActiveChannelId(null);
  };

  /* ── Render ── */
  const renderSidebar = () => {
    // If viewing topics for a group, show TopicList instead of ChatList.
    if (view === 'topics' && activeChatId && activeChat?.type === 'group') {
      return (
        <TopicList
          groupName={activeChat.name || 'Группа'}
          topics={groupTopics}
          activeTopicId={activeTopicId}
          onSelectTopic={handleSelectTopic}
          onCreateTopic={() => setView('create-topic')}
          onBack={() => {
            setActiveChatId(null);
            setActiveTopicId(null);
            setView('chat');
          }}
        />
      );
    }

    return (
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
    );
  };

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

    // Topic thread
    if (activeChatId && activeTopicId && activeTopic) {
      return (
        <ChatWindow
          chatId={activeChatId}
          onBack={isMobile ? handleBack : undefined}
          extraChats={createdGroups}
          topicId={activeTopicId}
          topicName={activeTopic.name}
          topicIcon={activeTopic.icon}
          topicMessages={topicMessages[activeTopicId] || []}
          onTopicMessageSent={handleTopicMessageSent}
        />
      );
    }

    // Group selected but no topic -- show empty state prompting to pick a topic.
    if (activeChatId && activeChat?.type === 'group' && !activeTopicId) {
      return <EmptyChat />;
    }

    // Regular chat
    if (activeChatId) {
      return (
        <ChatWindow
          chatId={activeChatId}
          onBack={isMobile ? handleBack : undefined}
          onOpenGroupInfo={activeChat?.type === 'group' ? () => setView('group-info') : undefined}
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
          {renderSidebar()}
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
          <GroupInfo
            chat={activeChat}
            topicCount={groupTopics.length}
            onBack={() => setView('chat')}
            onLeave={handleLeaveGroup}
            onOpenTopics={() => setView('topics')}
          />
        )}
        {view === 'create-topic' && activeChatId && (
          <CreateTopic
            groupId={activeChatId}
            onBack={() => setView('topics')}
            onCreated={handleTopicCreated}
          />
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
          <CreatePost channelId={activeChannelId} onBack={() => setView('chat')} onCreated={handlePostCreated} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
