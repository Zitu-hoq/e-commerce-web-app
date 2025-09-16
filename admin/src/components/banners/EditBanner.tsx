"use client";
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
import { Banner } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { DestructiveAlert } from "../DestructiveAleart";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  btnText: z.string(),
  btnLink: z.string(),
  imgName: z.string(),
  imgUrl: z.string(),
  isActive: z.string(),
});

export default function EditBanner(data: Banner) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...data, isActive: String(data.isActive) },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      console.log(values);
      const distinct = Object.fromEntries(
        Object.entries(values).filter(([key, val]) => val !== data[key])
      );
      const formData = { ...distinct, _id: data._id };

      const res = await API.post("/api/admin/banner/edit", formData);
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/banners";
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  const onDelete = async () => {
    try {
      const url =
        import.meta.env.VITE_API_URL + "/api/admin/product/banner/delete";
      const res = await API.post(url, {
        id: data._id,
      });
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/banners";
      }, 1000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Title</FormLabel>
                <FormControl>
                  <Input placeholder="New arrival" type="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="new arrival banner description"
                    type=""
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="btnText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input placeholder="see more" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="btnLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route</FormLabel>
                  <FormControl>
                    <Input placeholder="/explore" type="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Banner?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-gray-900 ">
                    <SelectItem
                      value="true"
                      className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                      Activate
                    </SelectItem>
                    <SelectItem
                      value="false"
                      className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                      Deactivate
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" className="w-[100%]" disabled={isSubmitting}>
              Submit
            </Button>

            <DestructiveAlert
              trigger="Delete Banner"
              description="This action cannot be undone. This will permanently delete this Banner."
              btn="Yes, Delete this Banner"
              onConfirm={onDelete}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
