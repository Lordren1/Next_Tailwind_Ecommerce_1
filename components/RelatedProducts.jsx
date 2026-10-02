
'use client';

/* import { dummyProducts } from "@/public/images/data"; */
import Title from "./Title";
import Item from "./Item";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";



export default function RelatedProducts({product}) {
  const { products } = useAppContext();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const data = products.filter((item) => item.category === product.category)
    setRelated(data)
  }, [products])

  return (
    <>
      <section className="max-padd-container py-16 xl:py-28">
        <Title title1={"Related"} title2={"Products"} titleStyles={'pb-10'} />
        
        <div className="grid grid-cols sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6 gap-y-12!">
          
          {related.slice(0, 5).map((product, index) => (
            <div key={index} className="w-40 sm:w-48 md:w-56 mx-2 sm:mx-3 md:mx-5 relative">
              <Item key={index} product={product}/>
            </div>
          ))}
        </div>
          
      </section>
    </>
  );
}