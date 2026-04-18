import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  const { data } = useSearch(debounced);
  const suggestions = data?.results?.slice(0, 5) ?? [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function go(q: string) {
    if (!q) return;
    setOpen(false);
    setInput("");
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        go(input.trim());
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (active >= 0) {
          navigate(`/projects/${suggestions[active].id}`);
          setOpen(false);
          setInput("");
        } else {
          go(input.trim());
        }
        break;
      case "Escape":
        setOpen(false);
        setActive(-1);
        break;
    }
  }

  const showDropdown = open && debounced.length > 0 && suggestions.length > 0;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-2 text-sm text-on-surface outline-none placeholder:text-outline focus:border-primary"
        placeholder="Search projects by title or tag"
        aria-label="Search projects"
      />

      {showDropdown && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-outline-variant/20 overflow-hidden z-50">
          {suggestions.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onMouseDown={() => {
                  navigate(`/projects/${item.id}`);
                  setOpen(false);
                  setInput("");
                }}
                className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                  i === active
                    ? "bg-surface-container-low text-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                }`}
              >
                <span className="truncate">{item.title}</span>
                <span className="text-xs text-on-surface-variant ml-2 shrink-0">
                  {item.category}
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onMouseDown={() => go(debounced)}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-primary bg-surface-container-lowest hover:bg-surface-container-low border-t border-outline-variant/10"
            >
              See all results for "{debounced}"
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
