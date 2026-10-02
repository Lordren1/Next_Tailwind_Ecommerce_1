'use client';

/* import { dummyProducts } from "@/public/images/data"; */
import Title from "./Title";
import Item from "./Item";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";





export default function NewArrivals() {
  const { products } = useAppContext();
  const [stopScroll, setStopScroll] = useState(false);

  return (
    <>
      <style>
        {`
          .marquee-inner {
            animation: marqueeScroll linear infinite;
          }
          @keyframes marqueeScroll {
            0%{
              transform: translateX(0%)
            }
            100%{
              transform: translateX(-50%)
            }
          }
        `}
      </style>
      <section className="max-padd-container py-16 xl:py-28">
        <Title title1={"New"} title2={"Arrivals"} titleStyles={'pb-10'} />
        <div 
          className="overflow-hidden relative" 
          onMouseEnter={() => setStopScroll(true)} 
          onMouseLeave={() => setStopScroll(false)}
        >
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-r from-background to-transparent"/>
          <div className='marquee-inr flex w-fit' style={{animationPlayState: stopScroll ? 'paused' : 'running', animationDuration: 22000 + 'ms'}}>
            <div className="flex">
              
              {products.slice(0, 8).map((product, index) => (
                <div key={index} className="w-40 sm:w-48 md:w-56 mx-2 sm:mx-3 md:mx-5 relative">
                  <Item key={index} product={product}/>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-linear-to-l from-background to-transparent"/>
        </div>
      </section>
    </>
  );
}