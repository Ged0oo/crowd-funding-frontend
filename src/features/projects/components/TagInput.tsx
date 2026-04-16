import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import useTags from "../hooks/useTags";
import type { TagInputProps } from "../../../types/projects";

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  maxTags = 10,
}) => {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: tagResults } = useTags(input.trim());

  const suggestions = useMemo(
    () =>
      tagResults?.results
        ?.map((t) => t.name)
        .filter((name) => !tags.includes(name)) ?? [],
    [tagResults?.results, tags],
  );

  const addTag = useCallback(
    (tagName: string) => {
      const cleaned = tagName.toLowerCase().trim();
      if (!cleaned) return;
      if (tags.includes(cleaned)) return;
      if (tags.length >= maxTags) return;

      onChange([...tags, cleaned]);
      setInput("");
      setShowSuggestions(false);
      setHighlightIndex(-1);
      inputRef.current?.focus();
    },
    [tags, onChange, maxTags],
  );

  const removeTag = useCallback(
    (tagName: string) => {
      onChange(tags.filter((t) => t !== tagName));
    },
    [tags, onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
          addTag(suggestions[highlightIndex]);
        } else if (input.trim()) {
          addTag(input);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setHighlightIndex(-1);
      } else if (e.key === "Backspace" && !input && tags.length > 0) {
        removeTag(tags[tags.length - 1]);
      } else if (e.key === "," || e.key === "Tab") {
        if (input.trim()) {
          e.preventDefault();
          addTag(input);
        }
      }
    },
    [input, highlightIndex, suggestions, addTag, removeTag, tags],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        Tags
      </label>

      <div
        className="flex flex-wrap items-center gap-2 rounded-lg border 
                    border-gray-300 px-3 py-2 focus-within:border-blue-500 
                    focus-within:ring-1 focus-within:ring-blue-500"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-blue-100 
                       px-3 py-1 text-sm text-blue-800"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-1 rounded-full hover:text-blue-600"
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </span>
        ))}

        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={
              tags.length === 0 ? "Type a tag and press Enter..." : ""
            }
            className="min-w-30 flex-1 border-none bg-transparent 
                       text-sm outline-none placeholder:text-gray-400"
          />
        )}
      </div>

      <p className="mt-1 text-xs text-gray-500">
        {tags.length} / {maxTags} tags · Press Enter, comma, or Tab to add
      </p>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto 
                      rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => addTag(suggestion)}
              onMouseEnter={() => setHighlightIndex(index)}
              className={`cursor-pointer px-4 py-2 text-sm transition-colors
                ${
                  index === highlightIndex
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
export type { TagInputProps };
