interface SuggestionProps {
  text: string;
  onClick: () => void;
}

export default function Suggestion({ text, onClick }: SuggestionProps) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="w-full px-6 py-3 text-left hover:bg-white/50 transition-colors duration-200 first:rounded-t-2xl last:rounded-b-2xl cursor-pointer"
    >
      <span className="text-gray-700">{text}</span>
    </button>
  );
}