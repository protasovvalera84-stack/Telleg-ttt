import { useState, type FormEvent } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export function ProfileStep() {
  const { setProfileName, loading } = useAuth();
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      setProfileName(name.trim());
    }
  };

  const isValid = name.trim().length >= 2;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-fuchsia-500/6 rounded-full blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Avatar placeholder */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 flex items-center justify-center mb-5 border border-violet-500/20"
          >
            <Sparkles className="w-12 h-12 text-violet-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gradient">Как вас зовут?</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Имя, которое увидят другие пользователи
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Ваше имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Иван Петров"
                autoFocus
                maxLength={50}
                className="w-full bg-muted/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base transition-all border border-border/50 focus:border-primary/30"
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                Минимум 2 символа
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full flex items-center justify-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Начать общение
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
