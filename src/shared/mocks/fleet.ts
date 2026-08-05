import type { Bus, BusOperator, BusSeat, BusType } from "@/shared/api/types";

export const OP_EVE_EXPRESS: BusOperator = {
  id: "op-eve-express",
  code: "EVE-EXP",
  legalName: "Công ty TNHH Vận tải EVE Express",
  displayName: "EVE Express",
  status: "ACTIVE",
  contactEmail: "hotro@eveexpress.vn",
  contactPhone: "1900 6789",
  address: "123 Giải Phóng, Hà Nội",
  taxId: "0102345678",
  logoUrl: null,
};

export const OP_PHUONG_NAM: BusOperator = {
  id: "op-phuong-nam",
  code: "PHUONG-NAM",
  legalName: "Công ty CP Xe khách Phương Nam",
  displayName: "Phương Nam Limousine",
  status: "ACTIVE",
  contactEmail: "cskh@phuongnam.vn",
  contactPhone: "1900 1234",
  address: "45 Điện Biên Phủ, TP. Hồ Chí Minh",
  taxId: "0309876543",
  logoUrl: null,
};

export const mockBusOperators: BusOperator[] = [OP_EVE_EXPRESS, OP_PHUONG_NAM];

export const BT_GIUONG_NAM: BusType = {
  id: "bt-giuong-nam-34",
  name: "Giường nằm 34 chỗ",
  description: "Xe giường nằm 2 tầng, điều hoà, wifi, nước uống miễn phí",
};

export const BT_LIMOUSINE: BusType = {
  id: "bt-limousine-22",
  name: "Limousine 22 chỗ",
  description: "Ghế massage, rèm riêng tư, sạc USB mỗi ghế",
};

export const mockBusTypes: BusType[] = [BT_GIUONG_NAM, BT_LIMOUSINE];

export const BUS_51B_12345: Bus = {
  id: "bus-51b-12345",
  busOperatorId: OP_EVE_EXPRESS.id,
  busTypeId: BT_GIUONG_NAM.id,
  licensePlate: "51B-123.45",
  totalSeats: 34,
  seatLayout: {}, // backend chưa định nghĩa schema — FE dựng sơ đồ từ BusSeat bên dưới
  amenities: { wifi: true, water: true, blanket: true, toilet: false },
  status: "ACTIVE",
};

export const BUS_51B_67890: Bus = {
  id: "bus-51b-67890",
  busOperatorId: OP_PHUONG_NAM.id,
  busTypeId: BT_LIMOUSINE.id,
  licensePlate: "51B-678.90",
  totalSeats: 22,
  seatLayout: {},
  amenities: { wifi: true, water: true, massageSeat: true, usbCharger: true },
  status: "ACTIVE",
};

export const mockBuses: Bus[] = [BUS_51B_12345, BUS_51B_67890];

/** Sinh danh sách BusSeat cho xe giường nằm 2 tầng, mỗi tầng đánh số A/B theo hàng. */
function buildSleeperSeats(busId: string, seatType: string): BusSeat[] {
  const seats: BusSeat[] = [];
  const floors: { floor: number; prefix: string }[] = [
    { floor: 1, prefix: "A" },
    { floor: 2, prefix: "B" },
  ];
  for (const { floor, prefix } of floors) {
    for (let row = 1; row <= 17; row++) {
      seats.push({
        id: `${busId}__${prefix}${row}`,
        busId,
        seatNumber: `${prefix}${row}`,
        seatType,
        floor,
        isActive: true,
      });
    }
  }
  return seats;
}

function buildLimousineSeats(busId: string, seatType: string): BusSeat[] {
  const seats: BusSeat[] = [];
  const floors: { floor: number; prefix: string }[] = [
    { floor: 1, prefix: "A" },
    { floor: 2, prefix: "B" },
  ];
  for (const { floor, prefix } of floors) {
    for (let row = 1; row <= 11; row++) {
      seats.push({
        id: `${busId}__${prefix}${row}`,
        busId,
        seatNumber: `${prefix}${row}`,
        seatType,
        floor,
        isActive: true,
      });
    }
  }
  return seats;
}

export const busSeatsByBusId: Record<string, BusSeat[]> = {
  [BUS_51B_12345.id]: buildSleeperSeats(BUS_51B_12345.id, "Giường nằm"),
  [BUS_51B_67890.id]: buildLimousineSeats(BUS_51B_67890.id, "Limousine"),
};

export const mockBusSeats: BusSeat[] = Object.values(busSeatsByBusId).flat();
