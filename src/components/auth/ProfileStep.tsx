import { useState, type FormEvent } from 'react';
import { User, Check, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Avatar placeholder */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Как вас зовут?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Введите имя, которое будет видно другим пользователям
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Ваше имя
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Иван Петров"
              autoFocus
              maxLength={50}
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Минимум 2 символа
            </p>
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>
      </motion.div>
    </div>
  );
}
