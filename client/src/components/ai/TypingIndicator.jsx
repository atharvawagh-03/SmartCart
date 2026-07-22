const TypingIndicator = () => {
  return (
    <div className="flex items-start gap-3 px-4">
      {/* AI avatar */}
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 mt-1">
        <span className="text-white text-[10px] font-bold">AI</span>
      </div>

      {/* Animated dots bubble */}
      <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '900ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
            style={{ animationDelay: '180ms', animationDuration: '900ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
            style={{ animationDelay: '360ms', animationDuration: '900ms' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
