import Link from "next/link";





export default function Hero() {

  return (
    <>
      <section >
        <div 
          className="max-padd-container bg-[url('/images/bg.png')]
        bg-cover bg-center bg-no-repeat h-[85vh] sm:h-screen w-full ">
          <div className="flex  items-center h-full" >
            <div>
              <h4 className="uppercase medium-18 tracking-wider ">TRENDY TREASURES</h4>
              <h1 className="capitalize max-w-full sm:max-w-120 lg:max-w-160">Elevate Your Look <span className="text-destructive">With Every Click.</span>Shop Today!</h1>
              <p className="my-5 max-w-full sm:max-w-100 lg:max-w-132">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt eius voluptatibus voluptatem ipsam minus aliquid?</p>
              {/* Button */}
              <div className="inline-flex items-center justify-center gap-2 sm:gap-4 bg-white rounded-xl">
                <div className="text-center regular-14 leading-tight pl-6 sm:pl-6">
                  <h5 className="uppercase font-bold">30% off </h5>
                  <p className="regular-14 ">On All Items</p>
                </div>
                <Link 
                  href={`/collection`}
                  className="btn-destructive rounded-xl flexCenter py-6 "  
                >Shop Now</Link>
              </div>
            </div>
        </div>
        </div>
      </section>
    </>
  );
}