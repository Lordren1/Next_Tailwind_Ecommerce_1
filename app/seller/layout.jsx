import Sidebar from "@/components/seller/Sidebar";

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1">{children}</main>
    </div>
  );
}
