import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent } from "@/shared/ui/card";

const searchSchema = z.object({
  departure: z.string().min(1, "Chọn điểm đi"),
  arrival: z.string().min(1, "Chọn điểm đến"),
  date: z.string().min(1, "Chọn ngày đi"),
});

type SearchForm = z.infer<typeof searchSchema>;

export function HomePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchForm>({ resolver: zodResolver(searchSchema) });

  const onSubmit = (values: SearchForm) => {
    // Feature 3 (route/trip search) sẽ điều hướng sang trang kết quả:
    // navigate(`/trips?departure=${values.departure}&arrival=${values.arrival}&date=${values.date}`)
    console.log("search", values);
  };

  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-16 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Đặt vé xe khách dễ dàng cùng Eve</h1>
        <p className="mt-3 text-brand-100">
          Tìm chuyến, chọn ghế realtime và thanh toán QR trong vài phút
        </p>
      </section>

      <Card className="mx-auto w-full max-w-4xl">
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 items-end gap-4 sm:grid-cols-[1fr_auto_1fr_1fr_auto]"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="departure">Điểm đi</Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="departure"
                  className="pl-9"
                  placeholder="TP. Hồ Chí Minh"
                  {...register("departure")}
                />
              </div>
              {errors.departure && (
                <p className="text-xs text-red-600">{errors.departure.message}</p>
              )}
            </div>
            <ArrowRight className="mb-3 hidden h-4 w-4 text-gray-400 sm:block" />
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="arrival">Điểm đến</Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="arrival"
                  className="pl-9"
                  placeholder="Đà Lạt"
                  {...register("arrival")}
                />
              </div>
              {errors.arrival && <p className="text-xs text-red-600">{errors.arrival.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Ngày đi</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-red-600">{errors.date.message}</p>}
            </div>
            <Button type="submit" className="h-10">
              <Search className="h-4 w-4" />
              Tìm chuyến
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
