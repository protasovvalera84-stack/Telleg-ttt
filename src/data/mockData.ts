export interface User {
  id: string;
  name: string;
  online: boolean;
  lastSeen?: string;
  avatar?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  type: 'private' | 'group';
  name?: string;
  description?: string;
  participants: string[];
  lastMessage?: { text: string; timestamp: string; senderId: string };
  unreadCount: number;
  createdAt?: string;
  createdBy?: string;
}

/* ── Channels ── */

export type MediaType = 'image' | 'video' | 'audio';

export interface PostMedia {
  type: MediaType;
  /** URL or object-URL for local files. */
  url: string;
  name?: string;
}

export interface ChannelPost {
  id: string;
  channelId: string;
  text?: string;
  media?: PostMedia[];
  timestamp: string;
  views: number;
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  subscriberCount: number;
  createdAt: string;
  createdBy: string;
  /** Current user is subscribed. */
  subscribed: boolean;
  /** Current user is the owner (can post). */
  isOwner: boolean;
}

/* ── Static data ── */

export const users: User[] = [
  { id: 'me', name: 'Я', online: true },
  { id: 'user1', name: 'Алексей Иванов', online: true, lastSeen: '12:30' },
  { id: 'user2', name: 'Мария Петрова', online: false, lastSeen: '11:45' },
  { id: 'user3', name: 'Дмитрий Сидоров', online: true, lastSeen: '13:00' },
  { id: 'user4', name: 'Елена Козлова', online: false, lastSeen: 'вчера' },
  { id: 'user5', name: 'Андрей Новиков', online: true, lastSeen: '14:20' },
  { id: 'user6', name: 'Ольга Морозова', online: false, lastSeen: '2 дня назад' },
];

export const chats: Chat[] = [
  { id: 'chat1', type: 'private', participants: ['me', 'user1'], lastMessage: { text: 'Привет! Как дела?', timestamp: '14:30', senderId: 'user1' }, unreadCount: 2 },
  { id: 'chat2', type: 'private', participants: ['me', 'user2'], lastMessage: { text: 'Увидимся завтра!', timestamp: '13:15', senderId: 'me' }, unreadCount: 0 },
  { id: 'chat3', type: 'group', name: 'Рабочий чат', description: 'Обсуждение рабочих вопросов и задач команды', participants: ['me', 'user1', 'user3', 'user5'], lastMessage: { text: 'Встреча в 15:00', timestamp: '12:00', senderId: 'user3' }, unreadCount: 5, createdAt: '01.03.2025', createdBy: 'me' },
  { id: 'chat4', type: 'private', participants: ['me', 'user4'], lastMessage: { text: 'Спасибо за помощь!', timestamp: '11:30', senderId: 'user4' }, unreadCount: 1 },
  { id: 'chat5', type: 'group', name: 'Друзья', description: 'Планируем встречи и делимся новостями', participants: ['me', 'user2', 'user4', 'user6'], lastMessage: { text: 'Кто идёт на выходных?', timestamp: '10:45', senderId: 'user6' }, unreadCount: 3, createdAt: '15.01.2025', createdBy: 'user2' },
  { id: 'chat6', type: 'private', participants: ['me', 'user5'], lastMessage: { text: 'Отправил документы', timestamp: '09:20', senderId: 'me' }, unreadCount: 0 },
];

export const messages: Record<string, Message[]> = {
  chat1: [
    { id: 'm1', chatId: 'chat1', senderId: 'user1', text: 'Привет!', timestamp: '14:25', read: true },
    { id: 'm2', chatId: 'chat1', senderId: 'me', text: 'Привет! Как дела?', timestamp: '14:26', read: true },
    { id: 'm3', chatId: 'chat1', senderId: 'user1', text: 'Отлично! Работаю над проектом.', timestamp: '14:28', read: true },
    { id: 'm4', chatId: 'chat1', senderId: 'user1', text: 'Привет! Как дела?', timestamp: '14:30', read: false },
  ],
  chat2: [
    { id: 'm5', chatId: 'chat2', senderId: 'user2', text: 'Привет, можешь помочь?', timestamp: '13:00', read: true },
    { id: 'm6', chatId: 'chat2', senderId: 'me', text: 'Конечно, что нужно?', timestamp: '13:05', read: true },
    { id: 'm7', chatId: 'chat2', senderId: 'user2', text: 'Нужно обсудить проект', timestamp: '13:10', read: true },
    { id: 'm8', chatId: 'chat2', senderId: 'me', text: 'Увидимся завтра!', timestamp: '13:15', read: true },
  ],
  chat3: [
    { id: 'm9', chatId: 'chat3', senderId: 'user1', text: 'Всем привет!', timestamp: '11:30', read: true },
    { id: 'm10', chatId: 'chat3', senderId: 'user5', text: 'Привет!', timestamp: '11:35', read: true },
    { id: 'm11', chatId: 'chat3', senderId: 'me', text: 'Здравствуйте!', timestamp: '11:40', read: true },
    { id: 'm12', chatId: 'chat3', senderId: 'user3', text: 'Встреча в 15:00', timestamp: '12:00', read: false },
  ],
  chat4: [
    { id: 'm13', chatId: 'chat4', senderId: 'me', text: 'Вот файлы, которые ты просила', timestamp: '11:00', read: true },
    { id: 'm14', chatId: 'chat4', senderId: 'user4', text: 'Спасибо за помощь!', timestamp: '11:30', read: false },
  ],
  chat5: [
    { id: 'm15', chatId: 'chat5', senderId: 'user2', text: 'Планы на выходные?', timestamp: '10:00', read: true },
    { id: 'm16', chatId: 'chat5', senderId: 'user4', text: 'Можно в парк сходить', timestamp: '10:20', read: true },
    { id: 'm17', chatId: 'chat5', senderId: 'me', text: 'Я за!', timestamp: '10:30', read: true },
    { id: 'm18', chatId: 'chat5', senderId: 'user6', text: 'Кто идёт на выходных?', timestamp: '10:45', read: false },
  ],
  chat6: [
    { id: 'm19', chatId: 'chat6', senderId: 'user5', text: 'Можешь отправить документы?', timestamp: '09:00', read: true },
    { id: 'm20', chatId: 'chat6', senderId: 'me', text: 'Отправил документы', timestamp: '09:20', read: true },
  ],
};

/* ── Channels mock data ── */

export const defaultChannels: Channel[] = [
  { id: 'ch1', name: 'Новости технологий', description: 'Последние новости из мира IT, гаджетов и науки', subscriberCount: 12400, createdAt: '10.01.2025', createdBy: 'user1', subscribed: true, isOwner: false },
  { id: 'ch2', name: 'Музыка дня', description: 'Ежедневные подборки треков разных жанров', subscriberCount: 8700, createdAt: '05.02.2025', createdBy: 'user2', subscribed: true, isOwner: false },
  { id: 'ch3', name: 'Фото и путешествия', description: 'Красивые фотографии со всего мира', subscriberCount: 23100, createdAt: '20.12.2024', createdBy: 'user3', subscribed: false, isOwner: false },
];

export const defaultChannelPosts: Record<string, ChannelPost[]> = {
  ch1: [
    { id: 'cp1', channelId: 'ch1', text: 'Apple представила новый MacBook Pro с чипом M4 Ultra. Производительность выросла на 40% по сравнению с предыдущим поколением.', timestamp: '14:00', views: 3200, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop', name: 'macbook.jpg' }] },
    { id: 'cp2', channelId: 'ch1', text: 'SpaceX успешно запустила Starship в пятый раз. Корабль впервые совершил мягкую посадку на платформу в океане.', timestamp: '11:30', views: 5100 },
    { id: 'cp3', channelId: 'ch1', text: 'Google анонсировал Gemini 2.0 — новую мультимодальную AI-модель с поддержкой реального времени.', timestamp: '09:15', views: 4800, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop', name: 'ai.jpg' }] },
  ],
  ch2: [
    { id: 'cp4', channelId: 'ch2', text: 'Трек дня: Radiohead — Everything In Its Right Place', timestamp: '12:00', views: 1800, media: [{ type: 'audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', name: 'Everything In Its Right Place.mp3' }] },
    { id: 'cp5', channelId: 'ch2', text: 'Новый альбом Kendrick Lamar уже доступен! Послушайте первый сингл.', timestamp: '10:00', views: 2400, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop', name: 'music.jpg' }, { type: 'audio', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', name: 'First Single.mp3' }] },
  ],
  ch3: [
    { id: 'cp6', channelId: 'ch3', text: 'Закат на Санторини, Греция', timestamp: '16:00', views: 8900, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop', name: 'santorini.jpg' }] },
    { id: 'cp7', channelId: 'ch3', text: 'Северное сияние в Норвегии. Видео снято прошлой ночью.', timestamp: '13:00', views: 12300, media: [{ type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', name: 'aurora.mp4' }, { type: 'image', url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=600&h=400&fit=crop', name: 'norway.jpg' }] },
    { id: 'cp8', channelId: 'ch3', text: 'Утро в горах Швейцарии', timestamp: '08:30', views: 6700, media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', name: 'switzerland.jpg' }] },
  ],
};
