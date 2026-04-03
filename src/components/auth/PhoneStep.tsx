import { useState, type FormEvent } from 'react';
import { MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export function PhoneStep() {
  const { submitPhone, loading, error } = useAuth();
  const [phone, setPhone] = useState('+7 ');

  /** Format input as the user types: +7 (999) 123-45-67 */
  const handleChange = (value: string) => {
    // Keep only digits and leading +.
    let digits = value.replace(/[^\d+]/g, '');

    // Ensure it starts with +7.
    if (!digits.startsWith('+')) digits = '+' + digits;
    if (digits.length >= 2 && digits[1] !== '7') digits = '+7' + digits.slice(1).replace(/\+/g, '');

    // Limit to +7 + 10 digits.
    const raw = digits.slice(0, 12); // +7XXXXXXXXXX

    // Format for display.
    const d = raw.replace(/\D/g, ''); // pure digits: 7XXXXXXXXXX
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Telleg</h1>
          <p className="text-sm text-muted-foreground mt-1">Войдите, чтобы продолжить</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Номер телефона
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              autoFocus
              className="w-full bg-muted rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Мы отправим SMS с кодом подтверждения
            </p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          Для демо: код подтверждения — <span className="font-mono font-bold text-foreground">1234</span>
        </p>
      </motion.div>
    </div>
  );
}
