"use client";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";
import { orderDummyData } from "@/public/images/data";

export default function OrderList() {
  const { user, currency } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const fetchSellerOrders = () => {
    setOrders(orderDummyData);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="max-padd-container py-28 h-[99vh] overflow-y-scroll w-full">
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 p-5 w-full rounded-md border-gray-200 text-gray-800 bg-background"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-5 ">
                    <Image
                      src={item.product.images[0]}
                      height={111}
                      width={111}
                      alt="orderItem"
                      className="h-14 w-14 object-cover rounded-md"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-medium">
                        {item.product.name}{" "}
                        <span
                          className={`${item.quantity < 2 ? "hidden" : " text-destructive font-bold"}`}
                        >
                          x {item.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-slate-900/10 pt-2">
                <div className="flex flex-col text-sm">
                  <p>Method: {order.paymentType}</p>
                  <p>Method: {new Date(order.date).toLocaleDateString()}</p>
                  <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
                </div>

                <p className="my-auto">
                  SubTotal: {currency}
                  {order.amount.toFixed(2)}
                </p>

                <div className="text-sm">
                  <p className="font-medium mb-1">
                    {order.address.completeName}
                  </p>
                  <p>
                    {order.address.streetAddress}, {order.address.city},{" "}
                    {order.address.state}, {order.address.country}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
