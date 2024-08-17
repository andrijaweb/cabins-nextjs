"use client";

import { useOptimistic } from "react";
import { deleteReservation } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

const ReservationList = ({ bookings }: { bookings: any }) => {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking: any) => booking.id !== bookingId);
    }
  );

  const handleDelete = async (bookingId: string) => {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  };

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking: any) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
};

export default ReservationList;
