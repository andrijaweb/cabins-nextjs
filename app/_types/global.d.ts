import type { Database as DB } from "./database.types";

declare global {
  type Database = DB;

  type Cabin = DB["public"]["Tables"]["cabins"]["Row"];
  type Booking = DB["public"]["Tables"]["bookings"]["Row"];
}
