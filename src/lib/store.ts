import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "./i18n";
import type { BookingStatus } from "./mock";

export type TripKind = "half" | "full";

export type TripForm = {
  name: string;
  email: string;
  phone: string;
  pickup: string;
  destination: string;
  date: string; // ISO date
  time: string; // HH:mm
  kind: TripKind;
};

export type Booking = {
  id: string;
  createdAt: string;
  vehicleId: string;
  seats: number[];
  fare: number;
  taxes: number;
  total: number;
  status: BookingStatus;
  form: TripForm;
  payment: { method: string; status: "paid" | "failed" | "pending" };
  rating?: number;
  review?: string;
};

type State = {
  lang: Lang;
  setLang: (l: Lang) => void;
  showedIntro: boolean;
  markIntroShown: () => void;
  form: TripForm;
  setForm: (p: Partial<TripForm>) => void;
  selectedVehicleId?: string;
  setVehicle: (id: string) => void;
  selectedSeats: number[];
  toggleSeat: (n: number) => void;
  resetSeats: () => void;
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, p: Partial<Booking>) => void;
  currentBookingId?: string;
  setCurrentBooking: (id: string) => void;
};

const emptyForm: TripForm = {
  name: "", email: "", phone: "",
  pickup: "", destination: "",
  date: new Date().toISOString().slice(0, 10),
  time: "09:00",
  kind: "half",
};

export const useApp = create<State>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      showedIntro: false,
      markIntroShown: () => set({ showedIntro: true }),
      form: emptyForm,
      setForm: (p) => set((s) => ({ form: { ...s.form, ...p } })),
      selectedVehicleId: undefined,
      setVehicle: (id) => set({ selectedVehicleId: id }),
      selectedSeats: [],
      toggleSeat: (n) => set((s) => ({
        selectedSeats: s.selectedSeats.includes(n)
          ? s.selectedSeats.filter(x => x !== n)
          : [...s.selectedSeats, n],
      })),
      resetSeats: () => set({ selectedSeats: [] }),
      bookings: [],
      addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
      updateBooking: (id, p) => set((s) => ({
        bookings: s.bookings.map(b => b.id === id ? { ...b, ...p } : b),
      })),
      currentBookingId: undefined,
      setCurrentBooking: (id) => set({ currentBookingId: id }),
    }),
    {
      name: "pellingcab",
      partialize: (s) => ({
        lang: s.lang,
        form: s.form,
        bookings: s.bookings,
      }),
    },
  ),
);
