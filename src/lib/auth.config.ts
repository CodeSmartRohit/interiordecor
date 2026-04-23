import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { role?: string })?.role === "ADMIN";
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnDesignRequest = nextUrl.pathname.startsWith("/design-request");
      const isOnCart = nextUrl.pathname.startsWith("/cart");

      if (isOnAdmin) {
        if (isAdmin) return true;
        return false;
      }

      if (isOnDashboard || isOnDesignRequest || isOnCart) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
  providers: [],
};
