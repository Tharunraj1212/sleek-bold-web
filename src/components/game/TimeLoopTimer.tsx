import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock, RotateCcw } from 'lucide-react';

interface TimeLoopTimerProps {
  timeRemaining: number;
  currentLoop: number;
  onLoopComplete: () => void;
}

export const TimeLoopTimer = ({ timeRemaining, currentLoop, onLoopComplete }: TimeLoopTimerProps) => {
  const [time, setTime] = useState(timeRemaining);

  useEffect(() => {
    if (time <= 0) {
      onLoopComplete();
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [time, onLoopComplete]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const isCritical = time < 300; // Last 5 minutes

  return (
    <Card className={`p-4 border-2 transition-all ${isCritical ? 'border-time-critical shadow-glow-accent animate-pulse' : 'border-primary shadow-glow-primary'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Loop #{currentLoop}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isCritical ? 'text-time-critical' : 'text-secondary'}`} />
          <span className={`text-2xl font-bold tabular-nums ${isCritical ? 'text-time-critical' : 'text-secondary'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      {isCritical && (
        <div className="mt-2 text-xs text-time-critical font-semibold">
          TIME CRITICAL - Loop ending soon!
        </div>
      )}
    </Card>
  );
};
