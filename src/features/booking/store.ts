import { create } from "zustand";
import type { SeatHold } from "@/shared/api/types";
import type { SeatMapSeatVM } from "./utils";

/** Giới hạn số ghế tối đa mỗi đơn (mock — chưa có quy tắc chính thức từ backend). */
export const MAX_SEATS_PER_BOOKING = 4;

export interface SelectedSeat {
  seatId: string;
  seatNumber: string;
  floor: number;
}

export interface PassengerContact {
  fullName: string;
  phone: string;
  email: string;
}

interface BookingFlowState {
  tripId: string | null;
  selectedSeats: SelectedSeat[];
  seatLimitError: string | null;
  hold: SeatHold | null;
  /** Thông báo lỗi liên quan tới hold: tranh chấp ghế lúc tạo, hoặc đã hết hạn giữ. */
  holdMessage: string | null;
  pickupStopId: string | null;
  dropoffStopId: string | null;
  contact: PassengerContact | null;

  /** Gắn trip mới vào flow — reset toàn bộ state cũ nếu đổi sang trip khác. */
  setTrip: (tripId: string) => void;
  toggleSeat: (seat: SeatMapSeatVM) => void;
  setHold: (hold: SeatHold) => void;
  /** Bỏ chọn hết ghế (vd trước khi tạo hold mới) — không kèm thông báo lỗi. */
  clearHold: () => void;
  /** Hold thất bại (tranh chấp) hoặc hết hạn: bỏ chọn ghế, xoá hold, hiện thông báo. */
  releaseHold: (message: string) => void;
  setPickupStop: (stopId: string) => void;
  setDropoffStop: (stopId: string) => void;
  setContact: (contact: PassengerContact) => void;
  reset: () => void;
}

const initialFlowState = {
  tripId: null as string | null,
  selectedSeats: [] as SelectedSeat[],
  seatLimitError: null as string | null,
  hold: null as SeatHold | null,
  holdMessage: null as string | null,
  pickupStopId: null as string | null,
  dropoffStopId: null as string | null,
  contact: null as PassengerContact | null,
};

export const useBookingStore = create<BookingFlowState>()((set, get) => ({
  ...initialFlowState,

  setTrip: (tripId) => {
    if (get().tripId !== tripId) {
      set({ ...initialFlowState, tripId });
    }
  },

  toggleSeat: (seat) => {
    const { selectedSeats } = get();
    const alreadySelected = selectedSeats.some((s) => s.seatId === seat.seatId);

    if (alreadySelected) {
      set({
        selectedSeats: selectedSeats.filter((s) => s.seatId !== seat.seatId),
        seatLimitError: null,
        holdMessage: null,
      });
      return;
    }

    if (selectedSeats.length >= MAX_SEATS_PER_BOOKING) {
      set({ seatLimitError: `Chỉ được chọn tối đa ${MAX_SEATS_PER_BOOKING} ghế mỗi đơn` });
      return;
    }

    set({
      selectedSeats: [
        ...selectedSeats,
        { seatId: seat.seatId, seatNumber: seat.seatNumber, floor: seat.floor },
      ],
      seatLimitError: null,
      holdMessage: null,
    });
  },

  setHold: (hold) => set({ hold, holdMessage: null }),

  clearHold: () => set({ hold: null }),

  releaseHold: (message) => set({ hold: null, selectedSeats: [], holdMessage: message }),

  setPickupStop: (stopId) => set({ pickupStopId: stopId }),

  setDropoffStop: (stopId) => set({ dropoffStopId: stopId }),

  setContact: (contact) => set({ contact }),

  reset: () => set({ ...initialFlowState }),
}));
