"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function Provider({ children }) {
  const pathname = usePathname();
  const isSellerPage = pathname.includes("/seller");

  return (
    <>
      <div>
        {!isSellerPage && <Header />}
        {children}
        {!isSellerPage && <Footer />}
      </div>
    </>
  );
}
