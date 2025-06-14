import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchOrder() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/order/${query}`);
    setQuery('');
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search Order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="transit focus:ring-opacity-50 w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm duration-300 placeholder:text-stone-400 sm:focus:w-72 focus:ring focus:ring-yellow-500 focus:outline-none sm:w-64"
      />
    </form>
  );
}
