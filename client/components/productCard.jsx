"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import { Heart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import placeholder from "./placeholder.jpg";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export default function ProductCard(props) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const data = props.product;
  if (!data) return null;
  const [selectedSize, setSelectedSize] = useState(data.size[0]);
  const [selectedColor, setSelectedColor] = useState(data.colors[0]);
  const image = data.primaryPicture || placeholder;
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSeeMore = () => {
    router.push(`/explore/${data._id}`);
  };

  const handleAddToCart = () => {
    if (!isLoggedIn && !user) {
      toast.error("Please log in to add products to your cart.");
      router.push("/login");
      return;
    } else {
      dispatch(
        addToCart({
          product: data._id,
          quantity: 1,
          size: selectedSize,
          color: selectedColor,
        })
      );
    }
  };

  return (
    <>
      <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-gray-900 shadow-md">
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          <img
            className="w-full h-full object-center object-cover"
            src={image}
            alt="product image"
          />
          {data.discount && (
            <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
              {data.discount}% OFF
            </span>
          )}
          <span className="absolute top-0 right-0 m-2 bg-transparent p-1 rounded-md text-center text-sm font-medium text-white hover:bg-gray-400 hover:text-black">
            <Heart />
          </span>
        </div>
        <div className="mt-4 px-5 pb-5 text-slate-900 dark:text-slate-100">
          <div className="flex items-center w-full justify-between min-w-0 ">
            <h5 className="text-xl tracking-tight capitalize">{data.name}</h5>
            <div className="flex items-center text-white text-xs ml-3 rounded-lg uppercase">
              {data.stock >= 1 ? (
                <Badge className="bg-green-600">in stock</Badge>
              ) : (
                <Badge variant="destructive">out of stock</Badge>
              )}
            </div>
          </div>
          <div className="flex py-4 text-sm justify-between">
            <div className="flex-1 inline-flex items-center mb-3">
              <div className="w-full flex-none flex items-center">
                <ul className="flex flex-row justify-center items-center space-x-2">
                  {data.colors.map((colorName, index) => (
                    <li className="" key={index}>
                      <span
                        className="block p-1 border-2 border-transparent hover:border-blue-600 rounded-full transition ease-in duration-300"
                        style={{
                          borderColor:
                            selectedColor === colorName
                              ? colorName
                              : "transparent", // Default border color
                          transition: "border-color 0.3s ease-in-out",
                        }}
                        onClick={(e) => setSelectedColor(colorName)}
                      >
                        <span
                          className="block w-3 h-3 rounded-full hover:w-4 hover:h-4 transition-all duration-300"
                          style={{
                            backgroundColor: colorName,
                          }}
                        ></span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex-1 inline-flex text-gray-500 justify-end items-center mb-3">
              <span className="whitespace-nowrap mr-3">Size:</span>
              <div className="cursor-pointer uppercase">
                {data.size.map((item, index) => (
                  <span
                    onClick={() => setSelectedSize(item)}
                    key={index}
                    className="hover:text-purple-500 hover:text-base p-1 py-0"
                    style={{
                      color: selectedSize === item ? "purple" : "gray",
                      fontWeight: selectedSize === item ? "bold" : "normal",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold">
                <span className="text-lg">BDT.&nbsp;</span>
                {data.price}
              </span>
              {data.oldPrice && (
                <span className="text-sm line-through">Tk.{data.oldPrice}</span>
              )}
            </p>
            <div className="flex items-center ml-3">
              <Star fill="yellow" size={15} />
              <Star fill="yellow" size={15} />
              <Star fill="yellow" size={15} />
              <span className="mr-2 text-black ml-1 rounded bg-yellow-200 px-2 py-0.5 text-xs font-semibold">
                5.0
              </span>
            </div>
          </div>
          <div className="flex justify-between py-4 capitalize">
            <Button type="button" onClick={handleSeeMore}>
              See more
            </Button>
            <Button type="button" onClick={handleAddToCart}>
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
