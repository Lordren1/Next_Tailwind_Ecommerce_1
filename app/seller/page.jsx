"use client";

import Image from "next/image";
import { useState } from "react";
import { assets } from "../../public/images/data";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddProduct() {
  const { getToken } = useAppContext();
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [popular, setPopular] = useState(false);

  const categories = [{ name: "Men" }, { name: "Women" }, { name: "Kids" }];
  const subCategories = [
    { name: "Topwear" },
    { name: "Bottomwear" },
    { name: "Winterwear" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("offerPrice", offerPrice);
    formData.append("subCategory", subCategory);
    formData.append("popular", popular);

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const token = await getToken();
      const { data } = await axios.post("/api/product/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName("");
        setPrice("");
        setCategory("Men");
        setSubCategory("Topwear");
        setDescription("");
        setPopular(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="py-10 flex flex-col justify-between bg-white h-[99hv] overflow-y-scroll w-full">
        <form
          onSubmit={handleSubmit}
          className="md:p-10 p-4 space-y-5 max-w-lg"
        >
          <div>
            <p className="text-base font-medium">Product Image</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label key={index} htmlFor={`image${index}`}>
                    <input
                      onChange={(e) => {
                        const updatedFiles = [...files];
                        updatedFiles[index] = e.target.files[0];
                        setFiles(updatedFiles);
                      }}
                      accept="image/*"
                      type="file"
                      id={`image${index}`}
                      hidden
                    />
                    <Image
                      key={index}
                      className="max-w-24 cursor-pointer"
                      src={
                        files[index]
                          ? URL.createObjectURL(files[index])
                          : assets.uploadArea
                      }
                      alt="uploadArea"
                      width={100}
                      height={100}
                    />
                  </label>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label className="text-base font-medium" htmlFor="product-name">
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              id="product-name"
              type="text"
              placeholder="Type here"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              required
            />
          </div>
          <div className="flex flex-col gap-1 max-w-md">
            <label
              className="text-base font-medium"
              htmlFor="product-description"
            >
              Product Description
            </label>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              id="product-description"
              rows={4}
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
              placeholder="Type here"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <div className="w-full flex flex-col gap-1">
              <label className="text-base font-medium" htmlFor="category">
                Category
              </label>
              <select
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                id="category"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              >
                {categories.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="text-base font-medium" htmlFor="subCategory">
                Sub Category
              </label>
              <select
                onChange={(e) => setSubCategory(e.target.value)}
                value={subCategory}
                id="subCategory"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              >
                {subCategories.map((item, index) => (
                  <option key={index} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <div className="flex-1 flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="product-price">
                Product Price
              </label>
              <input
                onChange={(e) => setPrice(e.target.value)}
                defaultValue={price}
                id="product-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1 w-32">
              <label className="text-base font-medium" htmlFor="offer-price">
                Offer Price
              </label>
              <input
                onChange={(e) => setOfferPrice(e.target.value)}
                defaultValue={offerPrice}
                id="offer-price"
                type="number"
                placeholder="0"
                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <input
              onChange={(e) => setPopular(e.target.checked)}
              checked={popular}
              type="checkbox"
              id="popular"
            />
            <label htmlFor="popular" className="text-base font-medium">
              Mark as Popular
            </label>
          </div>
          <button
            type="submit"
            className="px-8 py-2.5 bg-destructive text-white font-medium rounded"
          >
            ADD
          </button>
        </form>
      </div>
    </>
  );
}
