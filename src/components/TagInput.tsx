"use client";

import React, { useEffect, useState, useRef } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function TagInput({
  value,
  onChange,
  label = "Tags",
  className = "",
  disabled = false,
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch all tags from /api/tags
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch tags");
        const data = await res.json();
        // Accept both [{name: string}] and [string] formats
        if (Array.isArray(data) && typeof data[0] === "string") {
          setAllTags(data);
        } else if (Array.isArray(data) && typeof data[0] === "object" && 'name' in data[0]) {
          setAllTags((data as { name: string }[]).map((t) => t.name));
        } else {
          setAllTags([]);
        }
      } catch {
        setAllTags([]);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    // Filter suggestions based on input and already selected tags
    const filtered = allTags.filter(
      (tag) =>
        !value.includes(tag) &&
        (!input || tag.toLowerCase().includes(input.trim().toLowerCase()))
    );
    setSuggestions(filtered);
  }, [allTags, value, input]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(true);
  };

  const addTag = (tag: string) => {
    const clean = tag.trim().toLowerCase();
    if (clean && !value.includes(clean)) {
      onChange([...value, clean]);
    }
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && value.length > 0) {
      // Remove last tag
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className={`TagInput ${className}`}>
      {label && (
        <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative mt-1">
        <input
          id="tag-input"
          data-testid="tag-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600"
          disabled={disabled}
          autoComplete="off"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            {suggestions.map((tag) => (
              <li
                key={tag}
                className="cursor-pointer px-3 py-2 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-sm"
                onMouseDown={() => handleSuggestionClick(tag)}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
      {value.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                aria-label={`Remove tag ${tag}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
