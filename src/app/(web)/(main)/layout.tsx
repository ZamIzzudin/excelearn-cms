/** @format */

import Sidebar from "src/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 grow">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
