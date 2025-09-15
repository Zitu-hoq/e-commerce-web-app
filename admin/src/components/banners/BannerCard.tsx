"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Banner } from "@/types";
import { EditPage } from "./EditPage";

export function BannerCard({ ...data }: Banner) {
  const { btnLink, btnText, description, imgUrl, isActive, title } = data;

  return (
    <Card className="relative overflow-hidden rounded-lg h-80 group cursor-pointer m-8">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imgUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Floating Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-black transition-opacity duration-200"
        >
          <EditPage {...data} />
        </Button>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-balance capitalize">
            {title}
          </h2>
          <p className="text-sm text-white/90 text-pretty capitalize">
            {description}
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              className="bg-white text-black hover:bg-white/90 transition-colors capitalize"
            >
              {btnText}
            </Button>
          </div>
          <div className="pt-2 font-bold">
            <span className="text-lg">{btnLink}</span>:&nbsp;
            <span className={isActive ? "bg-green-500 p-1" : "bg-red-500 p-1"}>
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
