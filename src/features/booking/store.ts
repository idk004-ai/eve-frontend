import { create } from "zustand";
import type { SeatMapSeatVM } from "./utils";

/** Giới hạn số ghế tối đa mỗi đơn (mock — chưa có quy tắc chính thức từ backend). */
export const MAX_SEATS_PER_BOOKING = 4;

export interface SelectedSeat {
  seatId: string;
  seatNumber: string;
  floor: number;
}

interface BookingFlowState {
  tripId: string | null;
  selectedSeats: SelectedSeat[];
  seatLimitError: string | null;

  /** Gắn trip mới vào flow — reset toàn bộ state cũ nếu đổi sang trip khác. */
  setTrip: (tripId: string) => void;
  toggleSeat: (seat: SeatMapSeatVM) => void;
  reset: () => void;
}

const initialFlowState = {
  tripId: null as string | null,
  selectedSeats: [] as SelectedSeat[],
  seatLimitError: null as string | null,
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
    });
  },

  reset: () => set({ ...initialFlowState }),
}));
