import { useState, type FormEvent } from 'react';
import { Zap, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export function PhoneStep() {
  const { submitPhone, loading, error } = useAuth();
  const [phone, setPhone] = useState('+7 ');

  const handleChange = (value: string) => {
    let digits = value.replace(/[^\d+]/g, '');
    if (!digits.startsWith('+')) digits = '+' + digits;
    if (digits.length >= 2 && digits[1] !== '7') digits = '+7' + digits.slice(1).replace(/\+/g, '');
    const raw = digits.slice(0, 12);
    const d = raw.replace(/\D/g, '');
    let formatted = '+7';
    if (d.length > 1) formatted += ' (' + d.slice(1, 4);
    if (d.length >= 4) formatted += ') ' + d.slice(4, 7);
    if (d.length >= 7) formatted += '-' + d.slice(7, 9);
    if (d.length >= 9) formatted += '-' + d.slice(9, 11);
    setPhone(formatted);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitPhone(phone);
  };

  const digits = phone.replace(/\D/g, '');
  const isValid = digits.length === 11;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-5 glow-primary rotate-3"
          >
            <Zap className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-gradient">Telleg</h1>
          <p className="text-sm text-muted-foreground mt-2">Мессенджер нового поколения</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Номер телефона
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                autoFocus
                className="w-full bg-muted/50 rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base transition-all border border-border/50 focus:border-primary/30"
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                Мы отправим SMS с кодом подтверждения
              </p>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={!isValid || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl py-3.5 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Продолжить
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-center text-muted-foreground mt-6">
          Демо-код: <span className="font-mono font-bold text-violet-400">1234</span>
        </p>
      </motion.div>
    </div>
  );
}
