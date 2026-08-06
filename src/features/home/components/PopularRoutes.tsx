import { ArrowRight, Bus } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { popularRoutes } from "../data/popular-routes";

const priceFormatter = new Intl.NumberFormat("vi-VN");

export function PopularRoutes() {
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">Tuyến phổ biến</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {popularRoutes.map((route) => (
          <Card key={route.id} className="w-64 flex-none overflow-hidden">
            <div className="flex h-28 items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white">
              <Bus className="h-10 w-10" />
            </div>
            <CardContent className="flex flex-col gap-1 pt-4">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-900">
                <span>{route.from}</span>
                <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                <span>{route.to}</span>
              </div>
              <p className="text-sm text-gray-500">
                Từ <span className="font-semibold text-brand-700">
                  {priceFormatter.format(route.fromPrice)}đ
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
