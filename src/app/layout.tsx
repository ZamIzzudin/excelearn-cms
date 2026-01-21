/** @format */

import type { Metadata } from "next";
import { Suspense } from "react";

import { TanstackProvider } from "@/lib/tanstack";
import { Middleware } from "@/lib/middleware";
import { Toaster } from "react-hot-toast";

import LoadingPage from "@/components/LoadingPage";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CMS Excelearn",
  description: "[INTERNAL USAGE] Content Management System (CMS)",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<LoadingPage />}>
          <Middleware>
            <TanstackProvider>
              <Toaster />
              {children}
            </TanstackProvider>
          </Middleware>
        </Suspense>
      </body>
    </html>
  );
}
