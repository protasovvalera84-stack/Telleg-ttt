import { Zap } from 'lucide-react';

export function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center mb-5 border border-violet-500/10">
          <Zap className="w-10 h-10 text-violet-400/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground/80 mb-1">Выберите чат</h3>
        <p className="text-sm text-muted-foreground">Выберите чат из списка для начала общения</p>
      </div>
    </div>
  );
}
