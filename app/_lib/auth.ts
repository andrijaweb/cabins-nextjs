import NextAuth, { type Account, type Profile, type Session } from "next-auth";
import Google from "next-auth/providers/google";
import { pages } from "next/dist/build/templates/app-page";
import { type NextRequest } from "next/server";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    authorized({
      auth,
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }) {
      return !!auth?.user;
    },
    async signIn({
      user,
      account,
      profile,
    }: {
      user: Session["user"];
      account: Account | null;
      profile?: Profile;
    }) {
      try {
        const email = user?.email;
        const fullName = user?.name ?? null;

        if (!email) {
          throw new Error("Email is required");
        }

        const existingGuest = await getGuest(email);

        if (!existingGuest) {
          await createGuest({
            email,
            fullName,
            countryFlag: null,
            created_at: new Date().toISOString(),
            id: 0,
            nationalID: null,
            nationality: null,
          });
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({
      session,
      user,
    }: {
      session: Session;
      user: Session["user"];
    }) {
      const guest = await getGuest(session.user?.email || "");

      if (session.user && guest) {
        session.user.guestId = guest.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
