import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeftRight, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";
import { Combobox, type ComboboxOption } from "@/shared/ui/combobox";
import { DatePicker } from "@/shared/ui/date-picker";
import { heroSearchSchema, type HeroSearchFormValues } from "../schema";

function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

interface HeroSearchFormProps {
  /** Danh sách điểm đi/đến hiển thị trong Combobox — B1 dùng mock, B4 gắn API thật (xem HomePage). */
  locationOptions: ComboboxOption[];
  onSearchLocations?: (query: string) => void;
  locationsLoading?: boolean;
}

export function HeroSearchForm({
  locationOptions,
  onSearchLocations,
  locationsLoading,
}: HeroSearchFormProps) {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<HeroSearchFormValues>({
    resolver: zodResolver(heroSearchSchema),
    defaultValues: { from: "", to: "", date: todayISO(), returnDate: "" },
  });

  const departureDate = watch("date");

  function handleSwap() {
    const { from, to } = getValues();
    setValue("from", to, { shouldValidate: true });
    setValue("to", from, { shouldValidate: true });
  }

  function onSubmit(values: HeroSearchFormValues) {
    const params = new URLSearchParams({ from: values.from, to: values.to, date: values.date });
    if (values.returnDate) params.set("returnDate", values.returnDate);
    navigate(`/search?${params.toString()}`);
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1fr_auto_1fr_1fr_1fr_auto]"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="from">Điểm đi</Label>
            <Controller
              control={control}
              name="from"
              render={({ field }) => (
                <Combobox
                  options={locationOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onSearch={onSearchLocations}
                  loading={locationsLoading}
                  placeholder="Chọn điểm đi"
                />
              )}
            />
            {errors.from && <p className="text-xs text-red-600">{errors.from.message}</p>}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Đổi chiều điểm đi/điểm đến"
            onClick={handleSwap}
            className="mx-auto lg:mx-0 lg:mb-3"
          >
            <ArrowLeftRight className="h-4 w-4 rotate-90 lg:rotate-0" />
          </Button>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to">Điểm đến</Label>
            <Controller
              control={control}
              name="to"
              render={({ field }) => (
                <Combobox
                  options={locationOptions}
                  value={field.value}
                  onChange={field.onChange}
                  onSearch={onSearchLocations}
                  loading={locationsLoading}
                  placeholder="Chọn điểm đến"
                />
              )}
            />
            {errors.to && <p className="text-xs text-red-600">{errors.to.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Ngày đi</Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker value={field.value} onChange={field.onChange} minDate={todayISO()} />
              )}
            />
            {errors.date && <p className="text-xs text-red-600">{errors.date.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="returnDate">Ngày về (tùy chọn)</Label>
            <Controller
              control={control}
              name="returnDate"
              render={({ field }) => (
                <DatePicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  minDate={departureDate || todayISO()}
                />
              )}
            />
          </div>

          <Button type="submit" className="h-10">
            <Search className="h-4 w-4" />
            Tìm chuyến
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
