import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, Maximize2, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/messenger/Avatar';
import { motion } from 'framer-motion';

export type CallType = 'voice' | 'video';

interface CallScreenProps {
  contactName: string;
  callType: CallType;
  onEnd: () => void;
}

export function CallScreen({ contactName, callType, onEnd }: CallScreenProps) {
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(callType === 'voice');
  const [connected, setConnected] = useState(false);

  // Simulate connection after 2s
  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Timer
  useEffect(() => {
    if (!connected) return;
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [connected]);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-[60] flex flex-col items-center justify-between bg-gradient-to-b from-[hsl(240,18%,6%)] via-[hsl(260,20%,8%)] to-[hsl(240,18%,4%)]"
    >
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium">E2E зашифровано</span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {callType === 'video' ? 'Видеозвонок' : 'Голосовой звонок'}
        </span>
      </div>

      {/* Center: avatar + info */}
      <div className="flex flex-col items-center gap-5">
        {/* Avatar with glow ring */}
        <div className={cn('relative', connected && 'animate-none')}>
          <div className={cn(
            'absolute -inset-3 rounded-full opacity-40',
            connected ? 'bg-emerald-500/20' : 'bg-violet-500/20 animate-pulse',
          )} />
          <div className={cn(
            'relative w-28 h-28 rounded-full ring-2 ring-offset-4 ring-offset-[hsl(240,18%,6%)]',
            connected ? 'ring-emerald-500/50' : 'ring-violet-500/50',
          )}>
            <Avatar name={contactName} size="lg" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">{contactName}</h2>
          <p className={cn(
            'text-sm mt-1',
            connected ? 'text-emerald-400' : 'text-muted-foreground',
          )}>
            {connected ? `${mins}:${secs}` : 'Соединение...'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full px-6 pb-10">
        <div className="flex items-center justify-center gap-5">
          {/* Mute */}
          <CallButton
            icon={muted ? MicOff : Mic}
            label={muted ? 'Вкл. микрофон' : 'Микрофон'}
            active={!muted}
            onClick={() => setMuted(!muted)}
          />

          {/* Camera (video calls) */}
          {callType === 'video' && (
            <CallButton
              icon={cameraOff ? VideoOff : Video}
              label={cameraOff ? 'Вкл. камеру' : 'Камера'}
              active={!cameraOff}
              onClick={() => setCameraOff(!cameraOff)}
            />
          )}

          {/* Speaker */}
          <CallButton
            icon={Volume2}
            label="Динамик"
            active
            onClick={() => {}}
          />

          {/* End call */}
          <button
            onClick={onEnd}
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all active:scale-95"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CallButton({ icon: Icon, label, active, onClick }: {
  icon: typeof Mic;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
    >
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center transition-all',
        active ? 'bg-white/10 text-white' : 'bg-white/5 text-muted-foreground',
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[9px] text-muted-foreground">{label}</span>
    </button>
  );
}
