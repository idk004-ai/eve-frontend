import { useEffect, useRef, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  /** Gọi lại 300ms sau lần gõ cuối — nơi B1/B4 cắm API (fetch/filter theo query). */
  onSearch?: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;

export function Combobox({
  options,
  value,
  onChange,
  onSearch,
  loading,
  placeholder,
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  // `query` chỉ có ý nghĩa khi đang mở/gõ dở; lúc đóng luôn hiển thị lại label của `value`
  // hiện tại — tính trực tiếp trong render thay vì đồng bộ qua effect.
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";
  const displayValue = open ? query : selectedLabel;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleInputChange(next: string) {
    setQuery(next);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch?.(next), SEARCH_DEBOUNCE_MS);
  }

  function handleSelect(option: ComboboxOption) {
    onChange(option.value);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={displayValue}
          disabled={disabled}
          placeholder={placeholder}
          onFocus={() => {
            setQuery(selectedLabel);
            setOpen(true);
          }}
          onChange={(e) => handleInputChange(e.target.value)}
          className="pr-9 pl-9"
        />
        {loading && (
          <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
        )}
      </div>

      {open && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.length === 0 && !loading && (
            <li className="px-3 py-2 text-sm text-gray-400">Không có kết quả</li>
          )}
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50",
                  option.value === value && "font-medium text-brand-700",
                )}
              >
                {option.label}
                {option.value === value && <Check className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
