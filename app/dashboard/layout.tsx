'use client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
    </div>
  );
}
