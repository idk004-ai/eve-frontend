import { Calendar } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

interface DatePickerProps {
  /** ISO date "YYYY-MM-DD", rỗng "" = chưa chọn. */
  value: string;
  onChange: (value: string) => void;
  /** ISO date "YYYY-MM-DD" — giới hạn ngày nhỏ nhất chọn được. */
  minDate?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  minDate,
  placeholder,
  className,
  disabled,
}: DatePickerProps) {
  return (
    <div className={cn("relative", className)}>
      <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="date"
        value={value}
        min={minDate}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
