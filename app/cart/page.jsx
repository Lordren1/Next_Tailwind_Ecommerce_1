"use client";

import CartTotal from "@/components/CartTotal";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/public/images/data";
import Image from "next/image";

export default function Cart() {
  const {
    router,
    currency,
    products,
    cartItems,
    getCartCount,
    updateCartQuantity,
  } = useAppContext();

  return (
    <div className="max-padd-container py-28">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1 max-w-4xl">
          <h1 className="text-3xl font-medium mb-6">
            Shopping Cart{" "}
            <span className="text-sm text-destructive">
              {getCartCount()} Items
            </span>
          </h1>

          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium p-3 bg-white rounded">
            <p className="text-left">Product Details</p>
            <p className="text-center">Subtotal</p>
            <p className="text-center">Action</p>
          </div>

          {Object.keys(cartItems).map((itemId) => {
            const product = products.find((product) => product._id === itemId);
            if (!product || cartItems[itemId] <= 0) return null;
            return (
              <div
                key={itemId}
                className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium my-3 p-1 bg-white rounded"
              >
                <div className="flex items-center md:gap-6 gap-3">
                  <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden">
                    <Image
                      className="w-full"
                      height={33}
                      width={33}
                      src={product.images[0]}
                      alt={product.name}
                    />
                  </div>
                  <div>
                    <p className="hidden md:block font-semibold">
                      {product.name}
                    </p>
                    <div className="font-normal text-gray-500/70">
                      <p className="py-1">
                        Category: <span>{product.category}</span>
                      </p>
                      <div className="flex items-center">
                        <p>Qty:</p>
                        <select
                          value={cartItems[itemId]}
                          onChange={(e) =>
                            updateCartQuantity(
                              product._id,
                              Number(e.target.value),
                            )
                          }
                          className="outline-none"
                        >
                          {Array(10)
                            .fill("")
                            .map((_, index) => (
                              <option key={index} value={index + 1}>
                                {index + 1}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center">
                  {currency}
                  {(product.offerPrice * cartItems[itemId]).toFixed(2)}
                </p>
                <button
                  onClick={() => updateCartQuantity(product._id, 0)}
                  className="cursor-pointer mx-auto"
                >
                  <Image
                    src={assets.trash}
                    width={19}
                    height={19}
                    alt="trash-icon"
                  />
                </button>
              </div>
            );
          })}

          <button
            onClick={() => router.push("/collection")}
            className="group cursor-pointer flex items-center mt-8 gap-2 text-destructive font-medium"
          >
            <Image src={assets.back} width={19} height={19} alt="back-icon" />
            Continue Shopping
          </button>
        </div>

        <CartTotal />
      </div>
    </div>
  );
}
