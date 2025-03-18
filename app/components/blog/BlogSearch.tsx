'use client';

import { useState, FormEvent } from 'react';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export default function BlogSearch({ onSearch, initialValue = '' }: BlogSearchProps) {
  const [query, setQuery] = useState(initialValue);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Buscar artículos..."
          className="input input-bordered w-full pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          aria-label="Buscar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
