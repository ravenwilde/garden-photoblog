"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { getCsrfToken } from "@/lib/csrf-client";
import { debounce } from "lodash";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAddButton?: boolean;
}

export default function TagInput({
  value,
  onChange,
  label = "Tags",
  placeholder = "Add a tag",
  className = "",
  disabled = false,
  showAddButton = true, // Default to showing the add button for mobile users
}: TagInputProps) {
  const [input, setInput] = useState("");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch all tags from /api/tags
    const fetchTags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = await getCsrfToken();
        const res = await fetch("/api/tags", { 
          credentials: "include",
          headers: {
            "x-csrf-token": token
          }
        });
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch tags: ${res.status}`);
        }
        
        const data = await res.json();
        // Accept both [{name: string}] and [string] formats
        if (Array.isArray(data) && typeof data[0] === "string") {
          setAllTags(data);
        } else if (Array.isArray(data) && typeof data[0] === "object" && 'name' in data[0]) {
          setAllTags((data as { name: string }[]).map((t) => t.name));
        } else {
          setAllTags([]);
        }
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError(err instanceof Error ? err.message : "Failed to load tags");
        setAllTags([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTags();
  }, []);

  // Debounced filter function for suggestions
  const debouncedFilterSuggestions = useCallback(
    debounce((inputValue: string, currentTags: string[], availableTags: string[]) => {
      const filtered = availableTags.filter(
        (tag) =>
          !currentTags.includes(tag) &&
          (!inputValue || tag.toLowerCase().includes(inputValue.trim().toLowerCase()))
      );
      setSuggestions(filtered);
      setActiveSuggestionIndex(-1);
    }, 150),
    [setSuggestions, setActiveSuggestionIndex] // Include state setters as dependencies for clarity
  );

  useEffect(() => {
    // Filter suggestions based on input and already selected tags
    debouncedFilterSuggestions(input, value, allTags);
    
    // Clean up debounce on unmount
    return () => {
      debouncedFilterSuggestions.cancel();
    };
  }, [allTags, value, input, debouncedFilterSuggestions]);

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
    // Handle suggestion navigation with keyboard
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        return;
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
        return;
      } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
        e.preventDefault();
        addTag(suggestions[activeSuggestionIndex]);
        return;
      }
    }
    
    // Normal tag addition behavior
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
      
      {error && (
        <div role="alert" className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="relative mt-1">
        <div className="flex">
          <div className="relative flex-grow">
            {isLoading && (
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10"
                role="status"
                aria-live="polite"
                aria-label="Loading"
              >
                <div className="animate-spin h-4 w-4 border-2 border-emerald-500 rounded-full border-t-transparent"></div>
              </div>
            )}
            <input
              id="tag-input"
              data-testid="tag-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-800 dark:border-gray-600"
              disabled={disabled}
              autoComplete="off"
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              onFocus={() => setShowSuggestions(true)}
              aria-autocomplete="list"
              aria-controls="tag-suggestions"
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-activedescendant={activeSuggestionIndex >= 0 ? `suggestion-${suggestions[activeSuggestionIndex]}` : undefined}
            />
          </div>
          {showAddButton && (
            <button
              type="button"
              onClick={() => input.trim() && addTag(input)}
              disabled={!input.trim() || disabled}
              className="px-3 py-2 bg-emerald-500 text-white rounded-r-md hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add tag"
            >
              Add
            </button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul 
            id="tag-suggestions"
            className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg"
            role="listbox"
            aria-label="Tag suggestions">
            {suggestions.map((tag, index) => (
              <li
                id={`suggestion-${tag}`}
                key={tag}
                className={`cursor-pointer px-3 py-2 text-sm ${index === activeSuggestionIndex ? 'bg-emerald-100 dark:bg-emerald-900' : 'hover:bg-emerald-100 dark:hover:bg-emerald-900'}`}
                onMouseDown={() => handleSuggestionClick(tag)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
                role="option"
                aria-selected={index === activeSuggestionIndex ? "true" : "false"}
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
