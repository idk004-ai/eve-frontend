export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  fromPrice: number;
}

/** Data tĩnh — Phase sau thay bằng API tổng hợp tuyến phổ biến từ backend. */
export const popularRoutes: PopularRoute[] = [
  { id: "hn-dn", from: "Hà Nội", to: "Đà Nẵng", fromPrice: 350_000 },
  { id: "hcm-dl", from: "TP. Hồ Chí Minh", to: "Đà Lạt", fromPrice: 280_000 },
  { id: "hn-hp", from: "Hà Nội", to: "Hải Phòng", fromPrice: 120_000 },
  { id: "hcm-vt", from: "TP. Hồ Chí Minh", to: "Vũng Tàu", fromPrice: 150_000 },
  { id: "dn-hue", from: "Đà Nẵng", to: "Huế", fromPrice: 100_000 },
  { id: "hcm-ct", from: "TP. Hồ Chí Minh", to: "Cần Thơ", fromPrice: 130_000 },
];
