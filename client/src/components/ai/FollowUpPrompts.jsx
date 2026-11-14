const FollowUpPrompts = ({ suggestions = [], onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-3 pt-1 pb-1">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="text-[11px] px-2.5 py-1 rounded-md border border-zinc-800 bg-zinc-900
                     text-zinc-300 hover:bg-zinc-850 hover:border-zinc-700
                     hover:text-white transition-colors text-left"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default FollowUpPrompts;
