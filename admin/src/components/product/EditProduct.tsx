"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TagsInput } from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { DestructiveAlert } from "../DestructiveAleart";

const formSchema = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  oldPrice: z.number().optional(),
  discount: z.number().optional(),
  pictures: z.string().array(),
  pictureLinks: z.string().array(),
  description: z.string(),
  features: z.string(),
  idealFor: z.string(),
  shipFrom: z.string(),
  estDelivaryTime: z.number(),
  categories: z.array(z.string()).nonempty("Please at least one item"),
  colors: z.array(z.string()).nonempty("Please at least one item"),
  size: z.array(z.string()).nonempty("Please at least one item"),
});

export default function EditProduct(data: Product) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...data },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = "/api/admin/product/edit";
      const res = await API.post(url, values);
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/products";
      }, 1000);
    } catch (error: any) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    }
  }

  const onDelete = async () => {
    try {
      const url = import.meta.env.VITE_API_URL + "/api/admin/product/delete";
      const res = await API.post(url, {
        id: data._id,
      });
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/products";
      }, 1000);
    } catch (err: any) {
      console.log("Error during delete operation:", err);
      toast.error(err.response?.data?.message || "Error!! Details in Console");
    }
  };

  return (
    <div className="flex items-center w-full mx-auto px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input disabled {...field} />
                </FormControl>
                <FormDescription>
                  A Unique Identifier for every Product
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="499"
                    type="number"
                    {...field}
                    onChange={(e) => {
                      const numericValue = Number(e.target.value);
                      field.onChange(numericValue);

                      // Get the old price from the form
                      const oldPrice = form.getValues("oldPrice");

                      // Calculate discount percentage
                      if (
                        typeof oldPrice === "number" &&
                        oldPrice > 0 &&
                        numericValue > 0
                      ) {
                        const discount =
                          ((oldPrice - numericValue) / oldPrice) * 100;
                        form.setValue("discount", Number(Math.ceil(discount))); // Set discount with 2 decimal places
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="oldPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="499"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          const numericValue = Number(e.target.value);
                          field.onChange(numericValue);

                          // Get the current price from the form
                          const currentPrice = form.getValues("price");

                          // Calculate discount percentage
                          if (numericValue > 0 && currentPrice > 0) {
                            const discount =
                              ((numericValue - currentPrice) / numericValue) *
                              100;
                            form.setValue(
                              "discount",
                              Number(Math.ceil(discount))
                            ); // Set discount with 2 decimal places
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount(%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10"
                        type="number"
                        {...field}
                        disabled // Disable the discount input field
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <TagsInput
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="shipFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ship From</FormLabel>
                    <FormControl>
                      <Input placeholder="China" type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="estDelivaryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivary Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          // Convert the value to a number
                          const numericValue = Number(e.target.value);
                          field.onChange(numericValue); // Update the form field value as a number
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-12">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sizes</FormLabel>
                    <FormControl>
                      <TagsInput
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description ..."
                    className="h-[3rem] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="features ..."
                    className="h-[3rem] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="idealFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ideal For</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="ideal for ..."
                    className="h-[3rem] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Changes
          </Button>
          <DestructiveAlert
            trigger="Delete Product"
            description="This action cannot be undone. This will permanently delete this Product."
            btn="Yes, Delete this Product"
            onConfirm={onDelete}
          />
        </form>
      </Form>
    </div>
  );
}
