"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

const product = {
  rating: 4.5,
  reviews: 128,
};

export default function ProductDetails(data: Product) {
  const [mainImage, setMainImage] = useState(data.primaryPicture);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const formatFeatures = (text: string): JSX.Element[] => {
    return text
      .split(".")
      .map((sentence, index) => {
        if (!sentence.trim()) return null; // Skip empty strings

        const parts = sentence.split(":"); // Check for ":"
        if (parts.length > 1) {
          return (
            <p key={index}>
              <strong>{parts[0].trim()}</strong>:{" "}
              {parts.slice(1).join(":").trim()}
            </p>
          );
        } else if (index === 0) {
          return (
            <p key={index}>
              <strong>{sentence.trim()}</strong>
            </p>
          ); // First sentence bold
        } else {
          return <p key={index}>{sentence.trim()}</p>; // Normal sentence
        }
      })
      .filter((el): el is JSX.Element => el !== null); // Ensure TypeScript recognizes JSX.Element[]
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Image Gallery */}
        <div className="lg:w-1/2 space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={mainImage || "/placeholder.svg"}
              alt={data.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {data.pictureLinks.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img)}
                className="aspect-square relative overflow-hidden rounded-md"
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${data.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-center object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-6 mt-6 lg:mt-0">
          <h1 className="text-3xl font-bold capitalize">{data.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({product.reviews} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold">
            BDT.{data.price.toFixed(2)}
            {data.oldPrice && (
              <span className="text-sm line-through">Tk.{data.oldPrice}</span>
            )}
          </p>
          <p className="text-gray-600">{data.description}</p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-medium text-gray-700"
              >
                Color
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {data.colors.map((color) => (
                    <SelectItem key={color} value={color.toLowerCase()}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full" disabled>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="flex border-b">
          {["Description", "Features & Benefits", "Ideal For"].map(
            (tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`py-2 px-4 font-semibold ${
                  activeTab === index
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>
        <div className="mt-4">
          {activeTab === 0 && <p>{formatFeatures(data.description)}</p>}
          {activeTab === 1 && <p>{formatFeatures(data.features)}</p>}
          {activeTab === 2 && <p>{formatFeatures(data.idealFor)}</p>}
        </div>
      </div>
    </div>
  );
}
