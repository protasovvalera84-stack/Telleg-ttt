import { ArrowLeft, Shield, Lock, KeyRound, Fingerprint, ShieldCheck, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SecuritySettingsProps {
  onBack: () => void;
}

export function SecuritySettings({ onBack }: SecuritySettingsProps) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.25 }}
      className="absolute inset-0 z-50 bg-background flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border glass">
        <button onClick={onBack} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg font-bold text-gradient flex-1">Безопасность</h2>
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Status banner */}
        <div className="mx-4 mt-4 glass-card rounded-2xl p-4 flex items-center gap-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Защита активна</p>
            <p className="text-[11px] text-emerald-400/80">E2E шифрование · AES-256-GCM · Signal Protocol</p>
          </div>
        </div>

        {/* Encryption info */}
        <div className="px-4 mt-5">
          <SectionLabel icon={Lock} title="Сквозное шифрование" />
          <div className="glass-card rounded-2xl overflow-hidden">
            <InfoRow icon={KeyRound} title="Протокол" value="Signal Protocol (X3DH + Double Ratchet)" />
            <InfoRow icon={Shield} title="Шифрование" value="AES-256-GCM" border />
            <InfoRow icon={Fingerprint} title="Обмен ключами" value="X25519 (Curve25519)" border />
            <InfoRow icon={Lock} title="Хеширование" value="SHA-512 + HKDF" border />
          </div>
        </div>

        {/* Features */}
        <div className="px-4 mt-5">
          <SectionLabel icon={ShieldCheck} title="Функции защиты" />
          <div className="glass-card rounded-2xl overflow-hidden">
            <FeatureRow icon={Lock} title="E2E шифрование чатов" desc="Все сообщения зашифрованы" active />
            <FeatureRow icon={Shield} title="E2E шифрование звонков" desc="Голос и видео защищены" active border />
            <FeatureRow icon={Eye} title="Самоуничтожение сообщений" desc="Автоудаление через 24ч" active={false} border />
            <FeatureRow icon={Fingerprint} title="Верификация контактов" desc="Сравнение ключей безопасности" active border />
            <FeatureRow icon={EyeOff} title="Скрытие IP-адреса" desc="Relay-серверы для звонков" active border />
          </div>
        </div>

        {/* Key fingerprint */}
        <div className="px-4 mt-5 mb-6">
          <SectionLabel icon={Fingerprint} title="Ваш ключ безопасности" />
          <div className="glass-card rounded-2xl p-4">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['7A3F', 'B2C1', 'D4E5', '9F08', '1A2B', '3C4D', '5E6F', '7081'].map((block, i) => (
                <div key={i} className="bg-muted/50 rounded-lg py-2 text-center font-mono text-xs text-violet-300 tracking-wider">
                  {block}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center">
              Сравните этот ключ с собеседником для верификации
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionLabel({ icon: Icon, title }: { icon: typeof Lock; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-violet-400" />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
    </div>
  );
}

function InfoRow({ icon: Icon, title, value, border }: { icon: typeof Lock; title: string; value: string; border?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3.5', border && 'border-t border-border/50')}>
      <Icon className="w-4 h-4 text-violet-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function FeatureRow({ icon: Icon, title, desc, active, border }: { icon: typeof Lock; title: string; desc: string; active: boolean; border?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 px-4 py-3.5', border && 'border-t border-border/50')}>
      <Icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-emerald-400' : 'text-muted-foreground')} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      <div className={cn('w-2 h-2 rounded-full flex-shrink-0', active ? 'bg-emerald-400' : 'bg-muted-foreground/30')} />
    </div>
  );
}
