import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}
