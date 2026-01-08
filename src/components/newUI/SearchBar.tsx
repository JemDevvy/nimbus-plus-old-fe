import { SearchRounded } from '@mui/icons-material';

export default function SearchBar({ placeholder = "Search...", onChange }) {
  return (
    <div className="max-w-md relative">
      <SearchRounded className="absolute left-2 top-1.5 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
      />
    </div>
  );
}