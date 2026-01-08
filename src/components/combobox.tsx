import React, { useState } from "react";

// Removed duplicate ComboboxOption
export function Combobox({ name, options, displayValue, defaultValue, onChange, children }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(defaultValue || null);
  const [showDropdown, setShowDropdown] = useState(false);
  const filteredOptions = query
    ? options.filter((opt) => {
        const val = displayValue && opt ? displayValue(opt) : "";
        return val && typeof val === "string" && val.toLowerCase().includes(query.toLowerCase());
      })
    : options;

  function handleSelect(opt) {
    setSelected(opt);
    setQuery("");
    setShowDropdown(false);
    if (onChange) onChange(opt);
  }

  // Show query if typing, otherwise show selected value, otherwise placeholder
  const inputValue = showDropdown && query !== "" ? query : (selected && displayValue(selected)) ? displayValue(selected) : "";

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full px-3 py-2 border rounded mb-2 bg-gray-100"
        placeholder="Search..."
        value={inputValue}
        onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        readOnly={false}
      />
      {showDropdown && (
        <div className="absolute z-10 w-full bg-white border rounded shadow max-h-60 overflow-auto">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-gray-500">No options</div>
          ) : (
            filteredOptions.map((opt, idx) => {
              const name = displayValue && opt ? displayValue(opt) : "";
              return (
                <div
                  key={opt.id || name || idx}
                  className={`cursor-pointer px-3 py-2 hover:bg-blue-100 ${selected === opt ? "bg-blue-50" : ""}`}
                  onClick={() => handleSelect(opt)}
                >
                  {name || "(No name)"}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

type ComboboxOptionProps = {
  value?: any;
  children: React.ReactNode;
};
// Only keep the typed ComboboxOption and ComboboxLabel above, remove all duplicates
export function ComboboxOption({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ComboboxLabel({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}
