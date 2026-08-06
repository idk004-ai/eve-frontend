import { cn } from "@/shared/lib/utils";
import type { StopOptionVM } from "../utils";

interface StopSelectorProps {
  name: string;
  title: string;
  options: StopOptionVM[];
  selectedStopId: string | null;
  onChange: (stopId: string) => void;
}

export function StopSelector({ name, title, options, selectedStopId, onChange }: StopSelectorProps) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-gray-900">{title}</legend>
      <div className="mt-2 flex flex-col gap-2">
        {options.map((option) => {
          const selected = option.stopId === selectedStopId;
          return (
            <label
              key={option.stopId}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors",
                selected ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300",
              )}
            >
              <input
                type="radio"
                name={name}
                className="mt-1"
                checked={selected}
                onChange={() => onChange(option.stopId)}
              />
              <span>
                <span className="block font-medium text-gray-900">
                  {option.time} — {option.name}
                </span>
                <span className="block text-gray-500">{option.address}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
