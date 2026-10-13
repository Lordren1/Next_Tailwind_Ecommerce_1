"use client";

import CartTotal from "@/components/CartTotal";
import Title from "@/components/Title";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AddAddress() {
  const { router, user, getToken } = useAppContext();
  const [address, setAddress] = useState({
    completeName: "",
    phone: "",
    zipcode: "",
    city: "",
    state: "",
    country: "",
    streetAddress: "",
  });

  const onChangeHandle = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setAddress((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/user/add-address",
        { address },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      toast.error("Login required");
      router.replace("/cart");
    }
  }, [user]);
  return (
    <>
      <div className="max-padd-container py-28 mt-4 min-h-screen">
        {/* Container */}
        <div className="flex flex-col xl:flex-row gap-20 xl:gap-28">
          {/* Left side - Form */}
          <form
            onSubmit={onSubmitHandler}
            action=""
            className="flex flex-2 flex-col gap-3 text-[95%] "
          >
            <Title
              title1={"Delivery"}
              title2={"Information"}
              titleStyles={"pb-5"}
            />

            <input
              onChange={onChangeHandle}
              value={address.completeName}
              type="text"
              name="completeName"
              placeholder="Full Name"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none"
              required
            />

            <input
              onChange={onChangeHandle}
              value={address.phone}
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none"
              required
            />

            <div className="flex gap-4 w-full ">
              <input
                onChange={onChangeHandle}
                value={address.zipcode}
                type="text"
                name="zipcode"
                placeholder="Zipcode"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandle}
                value={address.city}
                type="text"
                name="city"
                placeholder="City"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            <div className="flex gap-4 w-full ">
              <input
                onChange={onChangeHandle}
                value={address.state}
                type="text"
                name="state"
                placeholder="State"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
              <input
                onChange={onChangeHandle}
                value={address.country}
                type="text"
                name="country"
                placeholder="Country"
                className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none w-1/2"
                required
              />
            </div>

            <textarea
              onChange={onChangeHandle}
              value={address.streetAddress}
              type="text"
              name="streetAddress"
              placeholder="Street Address"
              className="ring-1 ring-slate-900/15 p-1 pl-3 rounded-sm bg-white outline-none"
              required
            />
            <button
              type="submit"
              className="btn-destructive sm:w-1/2 rounded-md"
            >
              Add Address
            </button>
          </form>
          {/* Right side - Cart total */}
          <CartTotal />
        </div>
      </div>
    </>
  );
}
