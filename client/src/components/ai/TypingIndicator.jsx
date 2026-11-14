const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-2.5 px-3">
      <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-zinc-400 text-[10px] font-semibold">SC</span>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg rounded-tl-xs px-3 py-2">
        <div className="flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
