const FollowUpPrompts = ({ suggestions = [], onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pt-1 pb-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          className="text-xs px-3 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10
                     text-purple-300 hover:bg-purple-500/25 hover:border-purple-400/60
                     hover:text-purple-200 transition-all duration-200 text-left"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default FollowUpPrompts;
