import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";

function SearchBar({
  placeholder = "Search products...",
  onSearch,
  className,
  value: controlledValue,
  onChange: controlledOnChange,
}) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const debouncedValue = useDebounce(value, 300);

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      if (isControlled) {
        controlledOnChange?.(newValue);
      } else {
        setInternalValue(newValue);
      }
    },
    [isControlled, controlledOnChange]
  );

  const handleClear = useCallback(() => {
    if (isControlled) {
      controlledOnChange?.("");
    } else {
      setInternalValue("");
    }
    onSearch?.("");
  }, [isControlled, controlledOnChange, onSearch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onSearch?.(value);
      }
    },
    [value, onSearch]
  );

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "w-full h-10 pl-10 pr-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-900",
          "placeholder:text-slate-400 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        )}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export { SearchBar };
