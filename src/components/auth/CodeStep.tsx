import { useState, useEffect, useRef, type FormEvent } from 'react';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

/** Cooldown in seconds before the user can request a new code. */
const RESEND_COOLDOWN = 60;

export function CodeStep() {
  const { phone, verifyCode, resendCode, loading, error } = useAuth();
  const [code, setCode] = useState(['', '', '', '']);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend button.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first input on mount.
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigit = (index: number, value: string) => {
    // Accept only single digit.
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);

    // Auto-advance to next input.
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits are filled.
    if (digit && index === 3 && next.every((d) => d !== '')) {
      verifyCode(next.join(''));
    }
  };

  const handleKeyDown = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!pasted) return;
    const next = [...code];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setCode(next);
    // Focus last filled or the next empty.
    const focusIdx = Math.min(pasted.length, 3);
    inputRefs.current[focusIdx]?.focus();
    // Auto-submit if complete.
    if (next.every((d) => d !== '')) {
      verifyCode(next.join(''));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const full = code.join('');
    if (full.length === 4) verifyCode(full);
  };

  const handleResend = async () => {
    setCode(['', '', '', '']);
    setCooldown(RESEND_COOLDOWN);
    await resendCode();
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {/* Back button */}
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground">Введите код</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Код отправлен на <span className="text-foreground font-medium">{phone}</span>
          </p>
        </div>

        {/* Code inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e.key)}
                className="w-14 h-14 text-center text-2xl font-bold bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-destructive text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={code.some((d) => !d) || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Подтвердить'
            )}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Отправить код повторно через{' '}
              <span className="font-mono text-foreground">{cooldown}с</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="flex items-center gap-1.5 mx-auto text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Отправить код повторно
            </button>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Демо-код: <span className="font-mono font-bold text-foreground">1234</span>
        </p>
      </motion.div>
    </div>
  );
}
