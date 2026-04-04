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
import { EditTopic } from '@/components/groups/EditTopic';
import { GroupPrivacyPage } from '@/components/groups/GroupPrivacyPage';
import { ChannelFeed } from '@/components/channels/ChannelFeed';
import { CreateChannel } from '@/components/channels/CreateChannel';
import { ChannelInfo } from '@/components/channels/ChannelInfo';
import { CreatePost } from '@/components/channels/CreatePost';
import { ChannelPrivacyPage } from '@/components/channels/ChannelPrivacyPage';
import { PrivacySettingsPage } from '@/components/settings/PrivacySettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { FolderManager } from '@/components/folders/FolderManager';
import { FolderEditor } from '@/components/folders/FolderEditor';
import { StoriesBar } from '@/components/stories/StoriesBar';
import { StoryViewer } from '@/components/stories/StoryViewer';
import { CreateStory } from '@/components/stories/CreateStory';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  chats as defaultChats,
  defaultChannels,
  defaultChannelPosts,
  defaultTopics,
  defaultTopicMessages,
  DEFAULT_FOLDERS,
  defaultStories,
  type Chat,
  type Channel,
  type ChannelPost,
  type ChannelPrivacy,
  type GroupPrivacy,
  type ChatFolder,
  type UserStory,
  type StoryItem,
  type Topic,
  type Message,
} from '@/data/mockData';
import { AnimatePresence } from 'framer-motion';

type View =
  | 'chat'
  | 'settings'
  | 'privacy'
  | 'appearance'
  | 'admin'
  | 'create-group'
  | 'group-info'
  | 'group-privacy'
  | 'topics'
  | 'create-topic'
  | 'edit-topic'
  | 'create-channel'
  | 'channel-info'
  | 'channel-privacy'
  | 'create-post'
  | 'manage-folders'
  | 'create-folder'
  | 'edit-folder'
  | 'create-story'
  | 'view-story';

const Index = () => {
  const { privacy, updatePrivacy, appearance, updateAppearance } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [view, setView] = useState<View>('chat');
  const [createdGroups, setCreatedGroups] = useState<Chat[]>([]);
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [channelPosts, setChannelPosts] = useState<Record<string, ChannelPost[]>>(defaultChannelPosts);
  const [topics, setTopics] = useState<Topic[]>(defaultTopics);
  const [topicMessages, setTopicMessages] = useState<Record<string, Message[]>>(defaultTopicMessages);
  const [folders, setFolders] = useState<ChatFolder[]>(DEFAULT_FOLDERS);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [stories, setStories] = useState<UserStory[]>(defaultStories);
  const [myStory, setMyStory] = useState<UserStory>({ userId: 'me', items: [], viewedIds: [] });
  const [viewingStoryUserId, setViewingStoryUserId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // On mobile: show sidebar when nothing is actively open, OR when viewing topic list.
  const isInTopicList = view === 'topics' && activeChatId && !activeTopicId;
  const showSidebar = !isMobile || ((!activeChatId && !activeChannelId) || !!isInTopicList);
  const showContent = !isMobile || ((!!activeChatId || !!activeChannelId) && !isInTopicList);

  const allChats = [...defaultChats, ...createdGroups];
  const activeChat = activeChatId ? allChats.find(c => c.id === activeChatId) : null;
  const activeChannel = activeChannelId ? channels.find(c => c.id === activeChannelId) : null;
  const activeTopic = activeTopicId ? topics.find(t => t.id === activeTopicId) : null;
  const editingTopic = editingTopicId ? topics.find(t => t.id === editingTopicId) : null;
  const groupTopics = activeChatId ? topics.filter(t => t.groupId === activeChatId) : [];
  const editingFolder = editingFolderId ? folders.find(f => f.id === editingFolderId) : null;

  /* ── Chat / Group handlers ── */
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveChannelId(null);
    setActiveTopicId(null);
    const chat = [...defaultChats, ...createdGroups].find(c => c.id === chatId);
    if (chat?.type === 'group') {
      setView('topics');
    }
  };

  const handleGroupCreated = (newChat: Chat) => {
    setCreatedGroups(prev => [...prev, newChat]);
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

  const handleEditTopic = (topicId: string) => {
    setEditingTopicId(topicId);
    setView('edit-topic');
  };

  const handleTopicSaved = (updated: Topic) => {
    setTopics(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    setEditingTopicId(null);
    setView('topics');
  };

  const handleTopicDeleted = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
    setTopicMessages(prev => {
      const next = { ...prev };
      delete next[topicId];
      return next;
    });
    if (activeTopicId === topicId) setActiveTopicId(null);
    setEditingTopicId(null);
    setView('topics');
  };

  const handleTopicMessageSent = (msg: Message) => {
    if (!activeTopicId) return;
    setTopicMessages(prev => ({
      ...prev,
      [activeTopicId]: [...(prev[activeTopicId] || []), msg],
    }));
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

  const handleChannelPrivacyChange = (channelId: string, newPrivacy: ChannelPrivacy) => {
    setChannels(prev =>
      prev.map(ch => (ch.id === channelId ? { ...ch, privacy: newPrivacy } : ch)),
    );
  };

  const handleGroupPrivacyChange = (chatId: string, newPrivacy: GroupPrivacy) => {
    // Update in createdGroups (user-created groups).
    setCreatedGroups(prev =>
      prev.map(c => (c.id === chatId ? { ...c, groupPrivacy: newPrivacy } : c)),
    );
  };

  /* ── Folder handlers ── */
  const handleFolderSaved = (folder: ChatFolder) => {
    setFolders(prev => {
      const exists = prev.find(f => f.id === folder.id);
      if (exists) return prev.map(f => (f.id === folder.id ? folder : f));
      return [...prev, folder];
    });
    setEditingFolderId(null);
    setView('manage-folders');
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const handleEditFolder = (folderId: string) => {
    setEditingFolderId(folderId);
    setView('edit-folder');
  };

  /* ── Story handlers ── */
  const handleViewStory = (userId: string) => {
    setViewingStoryUserId(userId);
    setView('view-story');
  };

  const handleMarkStoryViewed = (userId: string, storyId: string) => {
    if (userId === 'me') {
      setMyStory(prev => ({
        ...prev,
        viewedIds: prev.viewedIds.includes(storyId) ? prev.viewedIds : [...prev.viewedIds, storyId],
      }));
    } else {
      setStories(prev =>
        prev.map(s =>
          s.userId === userId
            ? { ...s, viewedIds: s.viewedIds.includes(storyId) ? s.viewedIds : [...s.viewedIds, storyId] }
            : s,
        ),
      );
    }
  };

  const handleStoryCreated = (item: StoryItem) => {
    setMyStory(prev => ({ ...prev, items: [...prev.items, item] }));
    setView('chat');
  };

  const handleBack = () => {
    if (activeTopicId) {
      setActiveTopicId(null);
      setView('topics');
      return;
    }
    setActiveChatId(null);
    setActiveChannelId(null);
  };

  /* ── Render ── */
  const renderSidebar = () => {
    if (view === 'topics' && activeChatId && activeChat?.type === 'group') {
      return (
        <TopicList
          groupName={activeChat.name || 'Группа'}
          topics={groupTopics}
          activeTopicId={activeTopicId}
          onSelectTopic={handleSelectTopic}
          onCreateTopic={() => setView('create-topic')}
          onEditTopic={handleEditTopic}
          onBack={() => {
            setActiveChatId(null);
            setActiveTopicId(null);
            setView('chat');
          }}
          onOpenGroupInfo={() => setView('group-info')}
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
        onManageFolders={() => setView('manage-folders')}
        extraChats={createdGroups}
        channels={channels}
        folders={folders}
        storiesSlot={
          <StoriesBar
            stories={stories}
            myStory={myStory}
            onViewStory={handleViewStory}
            onCreateStory={() => setView('create-story')}
          />
        }
      />
    );
  };

  const renderContent = () => {
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

    if (activeChatId && activeChat?.type === 'group' && !activeTopicId) {
      return <EmptyChat />;
    }

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
        {view === 'settings' && <ProfileSettings onBack={() => setView('chat')} onOpenPrivacy={() => setView('privacy')} onOpenAppearance={() => setView('appearance')} />}
        {view === 'privacy' && (
          <PrivacySettingsPage
            privacy={privacy}
            onBack={() => setView('settings')}
            onChange={updatePrivacy}
          />
        )}
        {view === 'appearance' && (
          <AppearanceSettings
            config={appearance}
            onBack={() => setView('settings')}
            onChange={updateAppearance}
          />
        )}
        {view === 'admin' && <AdminPanel onBack={() => setView('chat')} />}
        {view === 'create-group' && (
          <CreateGroup onBack={() => setView('chat')} onCreated={handleGroupCreated} />
        )}
        {view === 'group-info' && activeChat?.type === 'group' && (
          <GroupInfo
            chat={activeChat}
            topicCount={groupTopics.length}
            onBack={() => setView('topics')}
            onLeave={handleLeaveGroup}
            onOpenTopics={() => setView('topics')}
            onOpenPrivacy={activeChat.createdBy === 'me' ? () => setView('group-privacy') : undefined}
          />
        )}
        {view === 'group-privacy' && activeChatId && activeChat?.type === 'group' && activeChat.groupPrivacy && (
          <GroupPrivacyPage
            groupName={activeChat.name || 'Группа'}
            privacy={activeChat.groupPrivacy}
            onBack={() => setView('group-info')}
            onChange={(p) => handleGroupPrivacyChange(activeChatId, p)}
          />
        )}
        {view === 'create-topic' && activeChatId && (
          <CreateTopic
            groupId={activeChatId}
            onBack={() => setView('topics')}
            onCreated={handleTopicCreated}
          />
        )}
        {view === 'edit-topic' && editingTopic && (
          <EditTopic
            topic={editingTopic}
            onBack={() => { setEditingTopicId(null); setView('topics'); }}
            onSave={handleTopicSaved}
            onDelete={handleTopicDeleted}
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
            onOpenPrivacy={activeChannel.isOwner ? () => setView('channel-privacy') : undefined}
          />
        )}
        {view === 'channel-privacy' && activeChannel && activeChannel.isOwner && (
          <ChannelPrivacyPage
            channelName={activeChannel.name}
            privacy={activeChannel.privacy}
            onBack={() => setView('channel-info')}
            onChange={(p) => handleChannelPrivacyChange(activeChannel.id, p)}
          />
        )}
        {view === 'create-post' && activeChannelId && (
          <CreatePost channelId={activeChannelId} onBack={() => setView('chat')} onCreated={handlePostCreated} />
        )}
        {view === 'manage-folders' && (
          <FolderManager
            folders={folders}
            onBack={() => setView('chat')}
            onCreateFolder={() => { setEditingFolderId(null); setView('create-folder'); }}
            onEditFolder={handleEditFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        )}
        {(view === 'create-folder' || view === 'edit-folder') && (
          <FolderEditor
            folder={editingFolder || undefined}
            availableChats={allChats}
            availableChannels={channels}
            onBack={() => setView('manage-folders')}
            onSave={handleFolderSaved}
          />
        )}
        {view === 'create-story' && (
          <CreateStory
            onBack={() => setView('chat')}
            onCreated={handleStoryCreated}
          />
        )}
        {view === 'view-story' && viewingStoryUserId && (
          <StoryViewer
            stories={viewingStoryUserId === 'me' ? [myStory, ...stories] : [...stories, ...(myStory.items.length > 0 ? [myStory] : [])]}
            initialUserId={viewingStoryUserId}
            onClose={() => { setViewingStoryUserId(null); setView('chat'); }}
            onMarkViewed={handleMarkStoryViewed}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
