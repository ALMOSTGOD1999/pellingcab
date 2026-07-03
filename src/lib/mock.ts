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
  { id: "innova", name: "Toyota Innova Crysta", category: "Premium SUV", image: innova, seats: 7, luggage: 4, ac: true, pricePerHalfDay: 2499, pricePerFullDay: 4499, rating: 4.9, layout: 7 },
  { id: "fortuner", name: "Toyota Fortuner", category: "Luxury SUV", image: fortuner, seats: 7, luggage: 5, ac: true, pricePerHalfDay: 3999, pricePerFullDay: 6999, rating: 4.8, layout: 7 },
  { id: "etios", name: "Toyota Etios", category: "Sedan", image: etios, seats: 4, luggage: 2, ac: true, pricePerHalfDay: 1499, pricePerFullDay: 2699, rating: 4.7, layout: 4 },
];

export function occupiedSeatsFor(vehicleId: string, dateISO: string): number[] {
  // deterministic pseudo-random occupied seats
  const src = vehicleId + dateISO;
  let h = 0;
  for (let i = 0; i < src.length; i++) h = (h * 31 + src.charCodeAt(i)) >>> 0;
  const v = vehicles.find(v => v.id === vehicleId)!;
  const occ = new Set<number>();
  const count = (h % Math.max(1, Math.floor(v.layout / 2))) + 1;
  for (let i = 0; i < count; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    occ.add((h % v.layout) + 1);
  }
  return [...occ].sort((a, b) => a - b);
}

export type BookingStatus =
  | "confirmed" | "assigned" | "on_the_way" | "arrived" | "in_trip" | "completed" | "cancelled";

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
