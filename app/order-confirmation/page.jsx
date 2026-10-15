"use client";

import { useAppContext } from "@/context/AppContext";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";

export default function OrderConfirmation() {
  const { router, setCartItems } = useAppContext();
  const pathname = usePathname();

  const isOrderPage = pathname.includes("/order-confirmation");

  useEffect(() => {
    // Force set the cart items state array to empty immediately on arrival
    setCartItems({});

    const timeout = setTimeout(() => {
      router.replace("/my-orders");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [setCartItems, router]); //  Added dependencies to prevent component re-render skips

  return (
    <div className="flex justify-center my-20">
      <div className="flex flex-col justify-center p-20 rounded-md items-center gap-3 px-32 bg-white shadow-sm">
        <Spinner isOrderPage={isOrderPage} />
        <h2 className="text-xl font-medium">Order Successful</h2>
        <h2 className="text-gray-500">Thank you so much for your order</h2>
        <button
          onClick={() => router.push("/my-orders")}
          className="btn-destructive mt-4"
        >
          Track your order
        </button>
      </div>
    </div>
  );
}
