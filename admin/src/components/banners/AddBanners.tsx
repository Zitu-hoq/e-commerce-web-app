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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  btnText: z.string(),
  btnLink: z.string(),
  image: z.any(),
  isActive: z.string(),
});

export default function AddBanners() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("btnText", values.btnText);
      formData.append("btnLink", values.btnLink);
      formData.append("isActive", String(values.isActive));
      if (values.description)
        formData.append("description", values.description);
      if (values.image) formData.append("image", values.image);

      const res = await API.post("/api/admin/banner/add", formData);
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/banners";
      }, 1000);
    } catch (error) {
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
          <Button variant="outline">Add Banner</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Enter Banner Details</DialogTitle>
              <DialogDescription>
                Add Banners for home page here. Click submit when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>

            <div>
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
                    <Select onValueChange={field.onChange}>
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

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Banner Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
