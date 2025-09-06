import { useState, useEffect } from 'react';
export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('');
  useEffect(() => {
    const t = setTimeout(()=> onSearch(q), 300);
    return () => clearTimeout(t);
  }, [q, onSearch]);
  return <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search files..." className="p-2 border rounded w-full"/>;
}
