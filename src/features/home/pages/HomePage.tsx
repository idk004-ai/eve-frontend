import { mockLocations } from "@/shared/mocks/locations";
import { HeroSearchForm } from "../components/HeroSearchForm";
import { PopularRoutes } from "../components/PopularRoutes";
import { ServiceCommitments } from "../components/ServiceCommitments";

const locationOptions = mockLocations.map((location) => ({
  value: location.id,
  label: location.name,
}));

export function HomePage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-16 text-center text-white">
        <h1 className="text-3xl font-bold sm:text-4xl">Đặt vé xe khách dễ dàng cùng Eve</h1>
        <p className="mt-3 text-brand-100">
          Tìm chuyến, chọn ghế realtime và thanh toán QR trong vài phút
        </p>
      </section>

      <HeroSearchForm locationOptions={locationOptions} />

      <PopularRoutes />

      <ServiceCommitments />
    </div>
  );
}
