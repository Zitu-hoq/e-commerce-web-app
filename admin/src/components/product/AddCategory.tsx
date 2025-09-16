"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { API } from "@/api/server";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const formSchema = z.object({
  _id: z.string().optional(),
  category: z.string(),
  __v: z.number().optional(),
});

interface AddCategoryProps {
  preData: Category[];
}

export default function AddCategory({ preData }: AddCategoryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const category = values.category.toLowerCase();
    // Check if category already exists
    const exists = preData.some(
      (item) => item.category.toLowerCase() === category
    );

    if (exists) {
      form.setError("category", {
        type: "manual",
        message: "Category already exists",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const data = { category: category };

      const res = await API.post("/api/admin/product/category/add", data);
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/addProduct";
      }, 1000);
    } catch (error: any) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog>
      <Form {...form}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Category</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Add product category here. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>

            <div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Men" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
