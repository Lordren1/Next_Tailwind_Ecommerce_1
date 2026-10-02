import { assets } from "@/public/images/data";
import Image from "next/image";
import Link from "next/link";

export default function Contact() {
  return (
    <>
      <div className="max-padd-container">
        <form action="" className="flex flex-col items-center py-28">
          <p className="text-xs bg-black/80 text-white font-medium px-3 py-1 rounded-full">
            Contact Us{" "}
          </p>
          <h1 className="text-4xl font-bold py-4 text-center">
            Let's Get In Touch.
          </h1>
          <p className="max-md:text-sm text-gray-500 pb-10 text-center">
            Or just reach out manually to us at{" "}
            <Link href="#" className="text-secondary hover:underline">
              {" "}
              swiftcharge@gmail.com
            </Link>
          </p>

          <div className="max-w-96 w-full px-4">
            <label htmlFor="name" className="font-medium">
              Full Name
            </label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 bg-white rounded-full">
              <Image
                src={assets.user}
                alt=""
                width={19}
                height={19}
                className="invert-50"
              />
              <input
                type="text"
                className="h-full px-2 w-full outline-none bg-transparent"
                placeholder="Enter your name"
              />
            </div>

            <label htmlFor="email-address" className="font-medium mt-4">
              Email Address
            </label>
            <div className="flex items-center mt-2 mb-4 h-10 pl-3 border border-slate-300 bg-white rounded-full">
              <input
                type="email"
                className="h-full px-2 w-full outline-none bg-transparent"
                placeholder="Enter your Email"
              />
            </div>
            <label htmlFor="message" className="font-medium mt-4">
              Message
            </label>
            <textarea
              rows=""
              id=""
              className="w-full mt-2 p-2 border border-slate-300 bg-white rounded-lg resize-"
            />

            <button
              type="submit"
              className="flexCenter gap-1 mt-5 btn-destructive w-full font-bold!"
            >
              Submit Form
              {/* <Image src={assets.right} alt="" className="invert" /> */}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
