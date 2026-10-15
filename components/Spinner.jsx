import Image from "next/image";
import { assets } from "@/public/images/data";

export default function Spinner({ isOrderPage }) {
  return (
    <>
      <div
        className={
          !isOrderPage
            ? "flexCenter h-screen  w-full relative"
            : "relative flexCenter"
        }
      >
        {/* Rotating circle */}
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-destructive" />

        {/*  Static tick on top */}
        {isOrderPage && (
          <Image
            src={assets.tick}
            alt="tickIcon"
            height={60}
            width={60}
            className="absolute"
          />
        )}
      </div>
    </>
  );
}
