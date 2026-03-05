export function SpeechBubbleCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`speech-tail rounded-2xl bg-cream p-3 shadow-float dark:bg-slate-800 ${className}`}>
      {children}
    </div>
  );
}