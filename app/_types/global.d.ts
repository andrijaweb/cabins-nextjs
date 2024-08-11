import type { Database as DB } from "@/app/_lib/database.types";

declare global {
  type Database = DB;

  type Cabin = DB["public"]["Tables"]["cabins"]["Row"];
  type Booking = DB["public"]["Tables"]["bookings"]["Row"];

  interface CabinsType {
    cabin: {
      id: number;
      name: string | null;
      maxCapacity: number | null;
      regularPrice: number | null;
      discount: number | null;
      image: string | null;
    };
  }
}
