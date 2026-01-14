import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  className?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  className,
  options,
  placeholder = "Select...",
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpen(false);
    onChange?.(option.value);
  };

  return (
    <div ref={ref} className={`relative flex flex-row items-end justify-end sm:flex-col`}>
      <button
        type="button"
        className={`${className || ""} ${selected ? "text-black" : "text-gray-400"} cursor-pointer xs:mb-3 px-4 py-3 sm:py-4 bg-white text-lg sm:text-xl rounded-2xl border border-gray-400 focus:ring-2 focus:ring-brand outline-none flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        {selected ? selected.label : placeholder}
        <span className={`transform transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto font-heading">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer font-heading"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
