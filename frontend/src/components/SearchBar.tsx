'use client';
import { useState } from 'react';

interface Props {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [query, setQuery] = useState('');
  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search address, neighborhood, or city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
        className="w-full px-4 py-2.5 pl-10 rounded-full border border-navy-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm"
      />
      <span className="absolute left-3 top-2.5 text-navy-400">🔍</span>
    </div>
  );
}
