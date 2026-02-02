import { Timer } from './Timer';
import { ScoreBoard } from './ScoreBoard';
import { HeartDisplay } from './HeartDisplay';

interface GameHeaderProps {
  maxTime: number;
  showHearts?: boolean;
  maxHearts?: number;
  onPause?: () => void;
  onTimeUp?: () => void;
  onBack?: () => void;
}

export function GameHeader({ 
  maxTime, 
  showHearts = false, 
  maxHearts = 3,
  onPause,
  onTimeUp,
  onBack
}: GameHeaderProps) {
  return (
    <header className="w-full max-w-2xl mx-auto px-4 py-3 space-y-3">
      {/* Top row: Score and Hearts/Pause */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
              title="뒤로가기"
            >
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <ScoreBoard showCombo={true} />
        </div>
        
        <div className="flex items-center gap-3">
          {showHearts && <HeartDisplay maxHearts={maxHearts} />}
          {onPause && (
            <button
              onClick={onPause}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Timer bar */}
      <Timer maxTime={maxTime} onTimeUp={onTimeUp} />
    </header>
  );
}
