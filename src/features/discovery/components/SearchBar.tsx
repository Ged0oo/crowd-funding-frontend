import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-xl border border-amber-900/20 bg-white/90 px-4 py-2 text-sm text-stone-900 outline-none ring-0 placeholder:text-stone-500 focus:border-amber-700"
        placeholder="Search projects by title or tag"
        aria-label="Search projects"
      />
    </form>
  );
}
