/** @format */

import type { Metadata } from "next";
import { Suspense } from "react";

import { TanstackProvider } from "src/lib/tanstack";
import { Middleware } from "src/lib/middleware";
import { Toaster } from "react-hot-toast";

import LoadingPage from "src/components/LoadingPage";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "CMS Excelearn",
  description: "[INTERNAL USAGE] Content Management System (CMS)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <link rel="icon" href="/Logo.png" /> */}
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
