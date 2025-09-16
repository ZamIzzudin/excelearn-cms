/** @format */

"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="bg-white text-[#639b56] flex min-h-screen flex-col items-center justify-center max-w-[100vw] overflow-hidden">
      <button onClick={() => router.push("/play")}>Play</button>
    </main>
  );
}
