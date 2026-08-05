import type { Route, RouteVariant, Schedule, Stop } from "@/shared/api/types";
import { LOC_DA_LAT, LOC_DA_NANG, LOC_HA_NOI, LOC_HO_CHI_MINH } from "./locations";
import { BUS_51B_12345, BUS_51B_67890 } from "./fleet";

export const ROUTE_HN_DN: Route = {
  id: "route-hn-dn",
  departureLocationId: LOC_HA_NOI.id,
  arrivalLocationId: LOC_DA_NANG.id,
  duration: 780, // 13 giờ
  distance: 763.5,
  isActive: true,
};

export const ROUTE_HCM_DL: Route = {
  id: "route-hcm-dl",
  departureLocationId: LOC_HO_CHI_MINH.id,
  arrivalLocationId: LOC_DA_LAT.id,
  duration: 420, // 7 giờ
  distance: 308,
  isActive: true,
};

export const mockRoutes: Route[] = [ROUTE_HN_DN, ROUTE_HCM_DL];

export const RV_HN_DN_MAIN: RouteVariant = {
  id: "rv-hn-dn-main",
  routeId: ROUTE_HN_DN.id,
  name: "Hà Nội - Đà Nẵng (qua QL1A)",
};

export const RV_HCM_DL_MAIN: RouteVariant = {
  id: "rv-hcm-dl-main",
  routeId: ROUTE_HCM_DL.id,
  name: "TP.HCM - Đà Lạt (qua đèo Bảo Lộc)",
};

export const mockRouteVariants: RouteVariant[] = [RV_HN_DN_MAIN, RV_HCM_DL_MAIN];

// Hà Nội - Đà Nẵng: 2 điểm đón ở Hà Nội, 2 điểm trả ở Đà Nẵng
export const STOP_HN_MY_DINH: Stop = {
  id: "stop-hn-my-dinh",
  locationId: LOC_HA_NOI.id,
  name: "Bến xe Mỹ Đình",
  address: "20 Phạm Hùng, Nam Từ Liêm, Hà Nội",
  lat: 21.0286,
  lng: 105.7772,
  isActive: true,
};

export const STOP_HN_GIAP_BAT: Stop = {
  id: "stop-hn-giap-bat",
  locationId: LOC_HA_NOI.id,
  name: "Bến xe Giáp Bát",
  address: "Giải Phóng, Hoàng Mai, Hà Nội",
  lat: 20.9764,
  lng: 105.8412,
  isActive: true,
};

export const STOP_DN_TRUNG_TAM: Stop = {
  id: "stop-dn-trung-tam",
  locationId: LOC_DA_NANG.id,
  name: "Bến xe Trung tâm Đà Nẵng",
  address: "273 Tôn Đức Thắng, Liên Chiểu, Đà Nẵng",
  lat: 16.0873,
  lng: 108.1897,
  isActive: true,
};

export const STOP_DN_HAI_CHAU: Stop = {
  id: "stop-dn-hai-chau",
  locationId: LOC_DA_NANG.id,
  name: "Văn phòng Hải Châu",
  address: "10 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
  lat: 16.0602,
  lng: 108.2211,
  isActive: true,
};

// TP.HCM - Đà Lạt: 2 điểm đón ở TP.HCM, 2 điểm trả ở Đà Lạt
export const STOP_HCM_MIEN_DONG: Stop = {
  id: "stop-hcm-mien-dong",
  locationId: LOC_HO_CHI_MINH.id,
  name: "Bến xe Miền Đông",
  address: "292 Đinh Bộ Lĩnh, Bình Thạnh, TP. Hồ Chí Minh",
  lat: 10.815,
  lng: 106.7128,
  isActive: true,
};

export const STOP_HCM_AN_SUONG: Stop = {
  id: "stop-hcm-an-suong",
  locationId: LOC_HO_CHI_MINH.id,
  name: "Bến xe An Sương",
  address: "QL22, Hóc Môn, TP. Hồ Chí Minh",
  lat: 10.8547,
  lng: 106.6198,
  isActive: true,
};

export const STOP_DL_TRUNG_TAM: Stop = {
  id: "stop-dl-trung-tam",
  locationId: LOC_DA_LAT.id,
  name: "Bến xe Đà Lạt",
  address: "01 Tô Hiến Thành, Đà Lạt, Lâm Đồng",
  lat: 11.9404,
  lng: 108.4419,
  isActive: true,
};

export const STOP_DL_HOA_BINH: Stop = {
  id: "stop-dl-hoa-binh",
  locationId: LOC_DA_LAT.id,
  name: "Khu Hoà Bình",
  address: "Khu Hoà Bình, Phường 1, Đà Lạt",
  lat: 11.9434,
  lng: 108.4383,
  isActive: true,
};

export const mockStops: Stop[] = [
  STOP_HN_MY_DINH,
  STOP_HN_GIAP_BAT,
  STOP_DN_TRUNG_TAM,
  STOP_DN_HAI_CHAU,
  STOP_HCM_MIEN_DONG,
  STOP_HCM_AN_SUONG,
  STOP_DL_TRUNG_TAM,
  STOP_DL_HOA_BINH,
];

export const SCHEDULE_HN_DN_DAILY: Schedule = {
  id: "sched-hn-dn-daily",
  busId: BUS_51B_12345.id,
  startDate: "2026-08-01T00:00:00+07:00",
  endDate: "2026-12-31T23:59:59+07:00",
  mon: true,
  tue: true,
  wed: true,
  thu: true,
  fri: true,
  sat: true,
  sun: true,
};

export const SCHEDULE_HCM_DL_DAILY: Schedule = {
  id: "sched-hcm-dl-daily",
  busId: BUS_51B_67890.id,
  startDate: "2026-08-01T00:00:00+07:00",
  endDate: "2026-12-31T23:59:59+07:00",
  mon: true,
  tue: true,
  wed: true,
  thu: true,
  fri: true,
  sat: true,
  sun: true,
};

export const mockSchedules: Schedule[] = [SCHEDULE_HN_DN_DAILY, SCHEDULE_HCM_DL_DAILY];
