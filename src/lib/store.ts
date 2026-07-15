import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "./i18n";
import type { BookingStatus, CancellationStatus } from "./mock";

export type TripKind = "half" | "full";
export type BookingMode = "shuttle" | "rental";

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

export type ShuttleForm = {
  routeId?: string;
  date: string;
  departure: string; // HH:mm
};

export type Booking = {
  id: string;
  createdAt: string;
  mode: BookingMode;
  vehicleId: string;
  routeId?: string;
  seats: number[];
  fare: number;
  taxes: number;
  total: number;
  status: BookingStatus;
  form: TripForm;
  shuttle?: ShuttleForm;
  payment: { method: string; status: "paid" | "failed" | "pending" };
  rating?: number;
  review?: string;
  cancellation?: {
    status: CancellationStatus;
    reason: string;
    notes?: string;
    requestedAt: string;
    refundAmount: number;
    refundPercent: number;
    policyLabel: string;
  };
};

export type PaymentMethod = {
  id: string;
  type: "card" | "upi" | "wallet" | "netbanking" | "cash";
  label: string;    // e.g. "HDFC •••• 4521" or "rakesh@okhdfc"
  detail?: string;  // secondary line (expiry, provider)
  isDefault?: boolean;
};

type State = {
  lang: Lang;
  setLang: (l: Lang) => void;
  showedIntro: boolean;
  markIntroShown: () => void;
  mode: BookingMode;
  setMode: (m: BookingMode) => void;
  form: TripForm;
  setForm: (p: Partial<TripForm>) => void;
  shuttle: ShuttleForm;
  setShuttle: (p: Partial<ShuttleForm>) => void;
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
  avatar?: string;
  setAvatar: (dataUrl?: string) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (m: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
};


const today = new Date().toISOString().slice(0, 10);

const emptyForm: TripForm = {
  name: "", email: "", phone: "",
  pickup: "", destination: "",
  date: today,
  time: "09:00",
  kind: "half",
};

const emptyShuttle: ShuttleForm = {
  routeId: undefined,
  date: today,
  departure: "",
};

export const useApp = create<State>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
      showedIntro: false,
      markIntroShown: () => set({ showedIntro: true }),
      mode: "shuttle",
      setMode: (mode) => set({ mode }),
      form: emptyForm,
      setForm: (p) => set((s) => ({ form: { ...s.form, ...p } })),
      shuttle: emptyShuttle,
      setShuttle: (p) => set((s) => ({ shuttle: { ...s.shuttle, ...p } })),
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
      avatar: undefined,
      setAvatar: (dataUrl) => set({ avatar: dataUrl }),
      paymentMethods: [
        { id: "pm_upi_default", type: "upi", label: "traveller@okhdfc", detail: "UPI · HDFC Bank", isDefault: true },
      ],
      addPaymentMethod: (m) => set((s) => ({
        paymentMethods: [
          ...s.paymentMethods.map(x => m.isDefault ? { ...x, isDefault: false } : x),
          m,
        ],
      })),
      removePaymentMethod: (id) => set((s) => {
        const next = s.paymentMethods.filter(m => m.id !== id);
        if (next.length && !next.some(m => m.isDefault)) next[0].isDefault = true;
        return { paymentMethods: next };
      }),
      setDefaultPaymentMethod: (id) => set((s) => ({
        paymentMethods: s.paymentMethods.map(m => ({ ...m, isDefault: m.id === id })),
      })),
    }),
    {
      name: "pellingcab",
      partialize: (s) => ({
        lang: s.lang,
        form: s.form,
        shuttle: s.shuttle,
        mode: s.mode,
        bookings: s.bookings,
        avatar: s.avatar,
        paymentMethods: s.paymentMethods,
      }),
    },
  ),
);

