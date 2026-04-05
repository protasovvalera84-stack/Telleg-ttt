import { ArrowLeft, UsersRound, Zap, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { users, chats } from '@/data/mockData';

interface AdminPanelProps { onBack: () => void; }

export function AdminPanel({ onBack }: AdminPanelProps) {
  return (
    <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-card flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></button>
        <h2 className="text-lg font-semibold text-foreground">Админ-панель</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><UsersRound className="w-4 h-4 text-admin-accent" /><span className="text-xs text-muted-foreground">Пользователи</span></div><p className="text-2xl font-bold text-foreground">{users.length}</p></div>
          <div className="bg-muted rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-admin-accent" /><span className="text-xs text-muted-foreground">Чаты</span></div><p className="text-2xl font-bold text-foreground">{chats.length}</p></div>
          <div className="bg-muted rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-admin-accent" /><span className="text-xs text-muted-foreground">Онлайн</span></div><p className="text-2xl font-bold text-foreground">{users.filter(u => u.online).length}</p></div>
          <div className="bg-muted rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-admin-accent" /><span className="text-xs text-muted-foreground">Группы</span></div><p className="text-2xl font-bold text-foreground">{chats.filter(c => c.type === 'group').length}</p></div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Список пользователей</h3>
          <div className="bg-muted rounded-xl overflow-hidden">
            {users.filter(u => u.id !== 'me').map((user, i) => (
              <div key={user.id} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-border' : ''}`}>
                <div><p className="text-sm font-medium text-foreground">{user.name}</p><p className="text-xs text-muted-foreground">{user.online ? 'в сети' : `был(а) ${user.lastSeen || 'давно'}`}</p></div>
                <span className={`w-2.5 h-2.5 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
