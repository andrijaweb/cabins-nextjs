"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export const updateGuest = async (formData: any) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const guestId = session.user?.guestId;
  if (typeof guestId !== "number")
    throw new Error("Guest ID is missing or invalid");

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
};

export const updateReservation = async (formData: any) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const reservationId = formData.get("reservationId");
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations").slice(0, 1000);

  const guestBookings = await getBookings(String(session.user?.guestId));
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(+reservationId))
    throw new Error("You are not allowed to update this booking/reservation");

  const updateData = {
    numGuests,
    observations,
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", reservationId);

  if (error) throw new Error("Reservation/Booking could not be updated");

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/${reservationId}`);

  redirect("/account/reservations");
};

export const deleteReservation = async (bookingId: string) => {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(String(session.user?.guestId));
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(+bookingId))
    throw new Error("You are not allowed to delete this booking/reservation");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/profile");
};

export const signInAction = async () => {
  await signIn("google", { redirectTo: "/account" });
};

export const signOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
