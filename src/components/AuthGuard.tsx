/** @format */
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGlobalState } from "src/lib/middleware";
import LoadingPage from "./LoadingPage";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
  allowedRoles = [],
}: AuthGuardProps) {
  const { state, actions } = useGlobalState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.isLoading) return;

    if (requireAuth && !state.hasLogin) {
      router.push(redirectTo);
      return;
    }

    if (!requireAuth && state.hasLogin && pathname === "/login") {
      router.push("/");
      return;
    }

    if (
      requireAuth &&
      state.hasLogin &&
      allowedRoles.length > 0 &&
      state.user &&
      !allowedRoles.includes(state.user.role)
    ) {
      router.push("/unauthorized");
      return;
    }
  }, [
    state.isLoading,
    state.hasLogin,
    state.user,
    requireAuth,
    redirectTo,
    allowedRoles,
    router,
    pathname,
  ]);

  if (state.isLoading) {
    return <LoadingPage />;
  }

  if (requireAuth && !state.hasLogin) {
    return <LoadingPage />;
  }

  if (!requireAuth && state.hasLogin && pathname === "/login") {
    return <LoadingPage />;
  }

  if (
    requireAuth &&
    state.hasLogin &&
    allowedRoles.length > 0 &&
    state.user &&
    !allowedRoles.includes(state.user.role)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}