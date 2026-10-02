"use client";

import { useAppContext } from "@/context/AppContext";
import { assets } from "@/public/images/data";
import { useClerk, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const { getCartCount, isSeller, router, user } = useAppContext();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { openSignIn } = useClerk();
  const isHomepage = pathname === "/";

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collection" },
    { name: "Contact", href: "/contact" },
  ];

  const BasketIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
      >
        <path
          d="M3 9H21L20.1 19.5C19.9435 21.1174 18.5748 22.5 16.9497 22.5H7.05025C5.42517 22.5 4.05649 21.1174 3.9 19.5L3 9Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 9V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 9H22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 13V17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 13V17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <nav
      className={`${
        !isHomepage && "bg-white"
      } max-padd-container absolute top-0 left-0  right-0 w-full flex items-center justify-between py-4   transition-all`}
    >
      {/* Logo */}
      <Link href={"/"} className="flex gap-1 ">
        <Image src={assets.logo} width={40} height={40} alt="logoIcon" />
        <h3 className="text-2xl hidden sm:block">
          SwiftCharge <span className="text-destructive sm:font-bold">zz</span>
        </h3>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-10 ">
        {/* Navigation */}
        <div className=" flex items-center gap-6 lg:gap-10 ">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                pathname === link.href
                  ? "border-b border-destructive text-destructive"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="h-5 px-3 text-sm bg-transparent ring-1 ring-destructive text-black rounded-full lg:ml-4 mt-0.5 cursor-pointer"
          >
            Seller
          </button>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Search */}
          <Image
            src={"/images/search.svg"}
            width={25}
            height={25}
            alt="searchIcon"
            className="hidden sm:block cursor-pointer"
          />

          {/* Cart */}
          <Link href={"/cart"} className="relative cursor-pointer">
            <Image src={assets.basket} width={25} height={25} alt="cart" />
            <span className="absolute -top-2 -right-2 text-xs text-white bg-destructive w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartCount()}
            </span>
          </Link>
        </div>

        {/* User/Auth */}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BasketIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-destructive flexCenter cursor-pointer px-8 py-2 transition text-white rounded-full"
          >
            <Image
              src={assets.user}
              width={19}
              height={19}
              alt="cart"
              className="invert-100"
            />
            Login
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 sm:hidden">
        {/* Cart */}
        <Link href="/cart" className="relative cursor-pointer">
          <Image src="/images/basket.svg" width={25} height={25} alt="cart" />
          <span className="absolute -top-2 -right-2 text-xs text-white bg-destructive w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartCount()}
          </span>
        </Link>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Orders"
                labelIcon={<BasketIcon />}
                onClick={() => router.push("/my-orders")}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-destructive flexCenter cursor-pointer px-8 py-2 transition text-white rounded-full"
          >
            <Image
              src={assets.user}
              width={19}
              height={19}
              alt="cart"
              className="invert-100"
            />
            Login
          </button>
        )}

        {/* Hamburger */}
        <button
          onClick={() => (open ? setOpen(false) : setOpen(true))}
          aria-label="Menu"
          className="sm:hidden"
        >
          <Image src={assets.menu} width={25} height={25} alt="menuIcon" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`${open ? "flex" : "hidden"} absolute top-15 left-0 w-full bg-white shadow-md py-4 flex-col items-start px-5 text-sm md:hidden`}
      >
        <div className="flex flex-col gap-4 mb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium transition-colors ${
                pathname === link.href
                  ? "border-b border-destructive text-destructive"
                  : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="h-5 px-3 text-sm bg-transparent ring-1 ring-destructive text-black rounded-full lg:ml-4 mt-0.5 cursor-pointer"
          >
            Seller
          </button>
        )}
      </div>
    </nav>
  );
}
