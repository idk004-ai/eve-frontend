import type { Location } from "@/shared/api/types";

export const LOC_HA_NOI: Location = {
  id: "loc-ha-noi",
  name: "Hà Nội",
  city: "Hà Nội",
  province: "Hà Nội",
  region: "Miền Bắc",
};

export const LOC_DA_NANG: Location = {
  id: "loc-da-nang",
  name: "Đà Nẵng",
  city: "Đà Nẵng",
  province: "Đà Nẵng",
  region: "Miền Trung",
};

export const LOC_HO_CHI_MINH: Location = {
  id: "loc-ho-chi-minh",
  name: "TP. Hồ Chí Minh",
  city: "TP. Hồ Chí Minh",
  province: "TP. Hồ Chí Minh",
  region: "Miền Nam",
};

export const LOC_DA_LAT: Location = {
  id: "loc-da-lat",
  name: "Đà Lạt",
  city: "Đà Lạt",
  province: "Lâm Đồng",
  region: "Miền Nam",
};

export const mockLocations: Location[] = [LOC_HA_NOI, LOC_DA_NANG, LOC_HO_CHI_MINH, LOC_DA_LAT];
