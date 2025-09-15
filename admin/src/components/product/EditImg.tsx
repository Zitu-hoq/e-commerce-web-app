"use client";

import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ImageEditSheetProps {
  images: string[];
  id: string;
  imageNames: string[];
  mainImg?: string;
}
interface formDataType {
  images: File[];
}

export function EditImg({
  id,
  images,
  imageNames,
  mainImg,
}: ImageEditSheetProps) {
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState(mainImg);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<formDataType>();

  const changePrimaryimg = async () => {
    try {
      const data = {
        id: id,
        primaryPicture: mainImage,
      };
      const url =
        import.meta.env.VITE_API_URL + "/api/admin/product/img/primary";
      const res = await API.post(url, data);
      const message = res.data.message;

      toast.success(message);
      setTimeout(() => {
        window.location.href = "/products";
      }, 1000);
    } catch (error) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    }
  };

  const onSubmit = async (data: formDataType) => {
    const formData = new FormData();
    formData.append("id", id);
    imageNames.forEach((item, index) => {
      formData.append(`imageNames[${index}]`, String(item));
    });
    try {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
      const url = import.meta.env.VITE_API_URL + "/api/admin/product/img/edit";
      const res = await API.post(url, formData);
      const message = res.data.message;

      toast.success(message);
      setTimeout(() => {
        window.location.href = "/products";
      }, 1000);
    } catch (error) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>Edit Images</SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Edit Images</SheetTitle>
          <SheetDescription>
            Upload new images or reorder existing ones.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="w-full space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <img
                src={mainImage || "/placeholder.svg"}
                alt="main image"
                className="w-full h-full object-center object-cover"
              />
            </div>
            <p className="font-bold">Select Primary image: </p>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setMainImage(img)}
                  className="aspect-square relative overflow-hidden rounded-md"
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`secondary thumbnail ${index + 1}`}
                    className="w-full h-full object-center object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={changePrimaryimg}
          >
            {isSubmitting ? "Updating..." : "Update Primary Image"}
          </Button>
          <div className="space-y-2">
            <Label htmlFor="images">Upload New Images</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              {...register("images")}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Images"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
