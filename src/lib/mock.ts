import innova from "@/assets/car-innova.jpg";
import etios from "@/assets/car-etios.jpg";
import fortuner from "@/assets/car-fortuner.jpg";

export type Vehicle = {
  id: string;
  name: string;
  category: string;
  image: string;
  seats: number;
  luggage: number;
  ac: boolean;
  pricePerHalfDay: number;
  pricePerFullDay: number;
  rating: number;
  layout: number; // seat count for layout
};

export const vehicles: Vehicle[] = [
  {
    id: "innova",
    name: "Toyota Innova Crysta",
    category: "Premium SUV",
    image: innova,
    seats: 7,
    luggage: 4,
    ac: true,
    pricePerHalfDay: 2499,
    pricePerFullDay: 4499,
    rating: 4.9,
    layout: 7,
  },
  {
    id: "fortuner",
    name: "Toyota Fortuner",
    category: "Luxury SUV",
    image: fortuner,
    seats: 7,
    luggage: 5,
    ac: true,
    pricePerHalfDay: 3999,
    pricePerFullDay: 6999,
    rating: 4.8,
    layout: 7,
  },
  {
    id: "etios",
    name: "Toyota Etios",
    category: "Sedan",
    image: etios,
    seats: 4,
    luggage: 2,
    ac: true,
    pricePerHalfDay: 1499,
    pricePerFullDay: 2699,
    rating: 4.7,
    layout: 4,
  },
];

// --- Shared shuttle: fixed routes + scheduled departures ------------------
export type ShuttleRoute = {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  durationHrs: number;
  vehicleId: string; // vehicle used on this route (defines seat layout)
  pricePerSeat: number; // shared shuttle: per-seat pricing
  departures: string[]; // HH:mm daily departure times
  scenic?: boolean;
};

// Pelling ⇄ Bagdogra Airport (IXB) — the only route PellingCab shuttles serve.
export const shuttleRoutes: ShuttleRoute[] = [
  {
    id: "pel-ixb",
    from: "Pelling",
    to: "Bagdogra Airport (IXB)",
    distanceKm: 155,
    durationHrs: 5,
    vehicleId: "innova",
    pricePerSeat: 1299,
    departures: ["03:30", "06:00", "09:00", "13:00"],
    scenic: true,
  },
  {
    id: "ixb-pel",
    from: "Bagdogra Airport (IXB)",
    to: "Pelling",
    distanceKm: 155,
    durationHrs: 5,
    vehicleId: "innova",
    pricePerSeat: 1299,
    departures: ["10:00", "13:30", "16:00", "19:30"],
    scenic: true,
  },
];

export function occupiedSeatsFor(vehicleId: string, dateISO: string): number[] {
  // deterministic pseudo-random occupied seats
  const src = vehicleId + dateISO;
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) >>> 0;
  const v = vehicles.find((v) => v.id === vehicleId)!;
  const occ = new Set<number>();
  const count = (h % Math.max(1, Math.floor(v.layout / 2))) + 1;
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    occ.add((h % v.layout) + 1);
  }
  return [...occ].sort((a, b) => a - b);
}

export type BookingStatus =
  "confirmed" | "assigned" | "on_the_way" | "arrived" | "in_trip" | "completed" | "cancelled";

export type CancellationStatus = "requested" | "approved" | "refunded" | "rejected";

export const cancellationSteps: { key: CancellationStatus; label: string; hint: string }[] = [
  { key: "requested", label: "Request received", hint: "We're reviewing your cancellation." },
  { key: "approved", label: "Cancellation approved", hint: "Refund is being processed." },
  { key: "refunded", label: "Refund credited", hint: "Amount will reflect in 3–5 business days." },
];

/** Refund tiers based on hours between cancellation time and departure. */
export function refundPolicyFor(hoursToDeparture: number): {
  percent: number;
  label: string;
  note: string;
} {
  if (hoursToDeparture >= 24)
    return { percent: 100, label: "Full refund", note: "Cancelled 24+ hours before departure." };
  if (hoursToDeparture >= 12)
    return { percent: 75, label: "75% refund", note: "Cancelled 12–24 hours before departure." };
  if (hoursToDeparture >= 4)
    return { percent: 50, label: "50% refund", note: "Cancelled 4–12 hours before departure." };
  if (hoursToDeparture >= 1)
    return { percent: 25, label: "25% refund", note: "Cancelled 1–4 hours before departure." };
  return {
    percent: 0,
    label: "No refund",
    note: "Cancelled under 1 hour before departure or after.",
  };
}

export const statusSteps: { key: BookingStatus; label: string }[] = [
  { key: "confirmed", label: "Booking confirmed" },
  { key: "assigned", label: "Driver assigned" },
  { key: "on_the_way", label: "Vehicle on the way" },
  { key: "arrived", label: "Driver arrived" },
  { key: "in_trip", label: "Trip started" },
  { key: "completed", label: "Trip completed" },
];

export const mockDriver = {
  name: "Rakesh Sharma",
  phone: "+91 98110 45231",
  rating: 4.9,
  trips: 1240,
  vehicleNumber: "DL 3C AB 4521",
  arrivalMins: 8,
};
