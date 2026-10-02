"use client";

import { useAppContext } from "@/context/AppContext";
import { assets } from "@/public/images/data";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Item({ product }) {
    const [count, setCount] = useState(0);
    const { router, updateCartQuantity, cartItems } = useAppContext();

    console.log(product);

    /* Set initial qantity from cart if exists */
    useEffect(() => {
        const existing = cartItems[product._id];
        if (existing) {
            setCount(existing);
        }
    }, [cartItems, product._id]);

    const handleUpdate = (newCount) => {
        setCount(newCount);
        updateCartQuantity(product._id, newCount);
    };

    return (
        <div
            onClick={() => {
                router.push("/product/" + product._id);
            }}
            className="rounded-2xl pb-2 overflow-hidden"
        >
            <div className="group cursor-pointer flex items-center justify-center overflow-hidden h-40 sm:h-52 md:h-58.25">
                <Image
                    height={233}
                    width={233}
                    className=" group-hover:scale-105 transition w-full h-full object-cover"
                    src={product.images[0]}
                    alt={product.name}
                />
            </div>
            <div className="bg-white">
                <p>{product.category}</p>

                <h4 className="truncate">{product.name}</h4>
                <div className="flex items-center gap-0.5">
                    {Array(5)
                        .fill("")
                        .map((_, i) => (
                            <Image
                                src={assets.star}
                                height={22}
                                width={16}
                                alt="StarIcon"
                                key={i}
                            />
                        ))}
                    <p>({5.0})</p>
                </div>
                <div className="flex items-end justify-between mt-3">
                    <p className="md:text-xl text-base font-medium text-red/500">
                        ${product.offerPrice}.00{" "}
                        <span className="text-gray-500/60 md:text-sm text-xs line-through">
                            ${product.price}
                        </span>
                    </p>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="text-white"
                    >
                        {count === 0 ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-destructive 
                                md:w-20 w-16 h-8.5 rounded text-white font-medium"
                                onClick={() => handleUpdate(1)}
                            >
                                <Image
                                    src={assets.basketAdd}
                                    height={22}
                                    width={16}
                                    alt="basket-add"
                                    className="invert-100 transition"
                                />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-8.5 bg-destructive/50 rounded select-none">
                                <button
                                    onClick={() =>
                                        handleUpdate(Math.max(count - 1, 0))
                                    }
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    -
                                </button>
                                <span className="w-5 text-center">{count}</span>
                                <button
                                    onClick={() => handleUpdate(count + 1)}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
