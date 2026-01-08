import { useState, useRef, useEffect } from "react";
import PopUpAddContact from "../modals/PopUpAddContact";

interface Option {
  value: string;
  label: string;
}
interface CustomSelectProps {
  className?: string;
  options: Option[];
  placeholder?: string;
  isMulti?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;

  extraActionLabel?: string;
  onExtraAction?: () => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  className,
  options,
  placeholder = "Select...",
  isMulti = false,
  value,
  onChange,

  extraActionLabel,
  onExtraAction,
}) => {
  const [open, setOpen] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // For single select, value is string; for multi, value is string[]
  const selectedValues = isMulti
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? value : "");

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
    if (isMulti) {
      let newValues = Array.isArray(selectedValues) ? [...selectedValues] : [];
      if (newValues.includes(option.value)) {
        newValues = newValues.filter((v) => v !== option.value);
      } else {
        newValues.push(option.value);
      }
      onChange?.(newValues);
    } else {
      onChange?.(option.value);
      setOpen(false);
    }
  };

  const isSelected = (option: Option) => {
    if (isMulti) {
      return Array.isArray(selectedValues) && selectedValues.includes(option.value);
    } else {
      return selectedValues === option.value;
    }
  };

  return (
    <div ref={ref} className={`relative flex flex-row sm:flex-col`}>
      <button
        type="button"
        className={`${className || ""} cursor-pointer flex justify-between items-center`}
        onClick={() => setOpen(!open)}
      >
        {isMulti
          ? (Array.isArray(selectedValues) && selectedValues.length > 0
              ? options.filter(o => selectedValues.includes(o.value)).map(o => o.label).join(", ")
              : placeholder)
          : (options.find(o => o.value === selectedValues)?.label || placeholder)}
        <span className={`transform transition-transform ${open ? "" : "rotate-90"}`}>
          ▼
        </span>
      </button>

      {open && (
        <ul className="absolute z-10 w-full  bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer ${isSelected(option) ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {isMulti && (
                <input
                  type="checkbox"
                  checked={isSelected(option)}
                  readOnly
                  className="mr-2"
                />
              )}
              {option.label}
            </li>
          ))}
          {extraActionLabel && onExtraAction && (
            <li className="px-4 py-2 bg-gray-50 hover:bg-blue-500 hover:text-white">
              <button
                className="w-full text-left cursor-pointer"
                onClick={() => {
                  if (onExtraAction) onExtraAction();
                }}
              >
                {extraActionLabel}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
