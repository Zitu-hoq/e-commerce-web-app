"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import placeholder from "../public/banner.jpg";

const BannerCarousel = ({ banners }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((current) => (current + 1) % banners.length);
      }, 3000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex(
      (current) => (current - 1 + banners.length) % banners.length
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % banners.length);
  };
  const handleClick = (btnRoute) => {
    router.push(btnRoute);
  };

  return (
    <div
      className="relative w-full h-[60vh]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {banners.map((banner, index) => (
        <Card
          key={banner._id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <CardContent className="p-0 h-full">
            <img
              src={banner.imgUrl || placeholder}
              alt="banner picture"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6 capitalize">
              <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
              <p className="mb-4">{banner.description}</p>
              <Button
                variant="secondary"
                onClick={() => handleClick(banner.btnLink)}
                className="capitalize"
              >
                {banner.btnText}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75"
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default BannerCarousel;
