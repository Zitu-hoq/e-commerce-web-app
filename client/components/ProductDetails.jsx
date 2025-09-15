"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import { CreditCard, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import img from "./placeholder.jpg";
import { Button } from "./ui/button";

export default function ProductDetails({ data }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const rating = data.rating || 5;
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState({
    product: data._id,
    color: data.colors[0],
    size: data.size[0],
    quantity: 1,
  });
  const [activeTab, setActiveTab] = useState("description");
  const updateProduct = (key, value) => {
    if (key === "quantity") {
      setProduct((prev) => ({ ...prev, [key]: prev[key] + value }));
      return;
    } else {
      setProduct((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn && !user) {
      toast.error("Please log in to add products to your cart.");
      router.push("/login");
      return;
    } else {
      dispatch(addToCart(product));
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn && !user) {
      toast.error("Please log in to buy products.");
      router.push("/login");
      return;
    } else {
      sessionStorage.setItem(
        "selectedProducts",
        JSON.stringify([{ ...product, product: data }])
      );
      sessionStorage.setItem("prevRoute", "details");
      router.push("/payment");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Image Gallery */}
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <div className="relative aspect-square mb-4">
            <img
              src={data.pictureLinks[selectedImage] || img}
              alt={data.name}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {data.pictureLinks.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative w-20 h-20 flex-shrink-0 ${
                  selectedImage === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${data.name} thumbnail ${index + 1}`}
                  className="object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">{rating} out of 5</span>
          </div>
          <p className="text-xl font-medium mb-4">{data.description}</p>
          <p className="text-2xl font-semibold mb-4">
            Tk. {data.price.toFixed(2)}
            {data.oldPrice && (
              <span className="text-sm line-through">Tk.{data.oldPrice}</span>
            )}
          </p>

          {/* Color Selection */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Color</h2>
            <div className="flex space-x-2">
              {data.colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 transition ease-in duration-300"
                  style={{
                    backgroundColor: color.toLowerCase(),
                    borderColor:
                      product.color === color ? "blue" : "transparent",
                    transition: "border-color 0.1s ease-in-out",
                  }}
                  aria-label={`Select ${color} color`}
                  onClick={() => {
                    updateProduct("color", color);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Size</h2>
            <div className="flex space-x-2">
              {data.size.map((size) => (
                <button
                  key={size}
                  className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  onClick={() => {
                    updateProduct("size", size);
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Quantity</h2>
            {data.stock < 1 && (
              <p className="text-red-500 text-lg">Out of Stock</p>
            )}
            <div className="flex items-center space-x-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateProduct("quantity", -1)}
                disabled={data.stock > 0 && product.quantity > 1 ? false : true}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="font-medium">{product.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateProduct("quantity", 1)}
                disabled={data.stock < 1 ? true : false}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart and Buy Now buttons */}
          <div className="flex space-x-4 mb-8">
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleAddToCart}
              disabled={data.stock < 1}
            >
              <ShoppingCart className="inline-block w-5 h-5 mr-2" />
              Add to Cart
            </button>
            <button
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              onClick={handleBuyNow}
            >
              <CreditCard className="inline-block w-5 h-5 mr-2" />
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="flex border-b">
          {["description", "features", "norm"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-semibold ${
                activeTab === tab
                  ? "border-b-2 border-blue-500 text-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === "description" && <p>{data.description}</p>}
          {activeTab === "features" && <p>{data.features}</p>}
          {activeTab === "norm" && <p>{data.idealFor}</p>}
        </div>
      </div>
    </div>
  );
}
