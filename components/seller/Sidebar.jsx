"use client";

import { assets } from "@/public/images/data";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.dashboardicon },
    {
      name: "Product List",
      path: "/seller/product-list",
      icon: assets.overviewicon,
    },
    { name: "Order List", path: "/seller/order-list", icon: assets.chaticon },
  ];

  return (
    <div className="md:w-64 w-16 border-r h-screen text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      <Link href={"/"} className="flex gap-1 mb-12">
        <Image src={assets.logo} width={40} height={40} alt="logoIcon" />
        <h3 className="text-2xl hidden sm:block">
          SwiftCharge <span className="text-destructive sm:font-bold">zz</span>
        </h3>
      </Link>

      {sidebarLinks.map((item, index) => {
        const isActive = pathname === item.path;
        return (
          <Link
            href={item.path}
            key={index}
            className={`flex items-center py-3 px-4 gap-3 ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-destructive/10 border-destructive text-destructive"
                : "hover:bg-gray-100/90 border-white text-gray-700"
            }`}
          >
            {item.icon}
            <p className="md:block hidden text-center">{item.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
