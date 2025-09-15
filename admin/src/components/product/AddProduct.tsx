"use client";
import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
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
import { Category } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { CloudUpload, Paperclip, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Checkbox } from "../ui/checkbox";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const formSchema = z.object({
  sku: z.string(),
  name: z.string(),
  price: z.number(),
  pictures: z.array(z.any()).max(4, "You can upload a maximum of 4 files."),
  description: z.string(),
  features: z.string(),
  idealFor: z.string(),
  shipFrom: z.string(),
  stock: z.number(),
  estDelivaryTime: z.number(),
  categories: z.array(z.string()).nonempty("Please at least one item"),
  colors: z.array(z.string()).nonempty("Please at least one item"),
  size: z.array(z.string()).nonempty("Please at least one item"),
});

export default function AddProduct({ baseCategories }: Category[]) {
  const [files, setFiles] = useState<File[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categories: [],
      colors: [],
      size: [],
      pictures: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Dynamically append all fields in the form
      for (const key in values) {
        if (key === "pictures") {
          // Append files under the "images" field (same as Postman)
          values[key].forEach((file: File) => {
            formData.append("images", file); // Use "images" as the key
          });
        } else {
          // Append other fields (convert objects/arrays to JSON strings)
          const value = values[key as keyof typeof values];
          if (Array.isArray(value)) {
            // If the value is an array, append each element individually
            value.forEach((item, index) => {
              formData.append(`${key}[${index}]`, String(item));
            });
          } else {
            // If the value is not an array, append it as before
            formData.append(
              key,
              typeof value === "object" && value !== null
                ? JSON.stringify(value)
                : String(value)
            );
          }
        }
      }
      const url = import.meta.env.VITE_API_URL + "/api/admin/product/add";
      const res = await API.post(url, formData);
      const message = res.data.message;
      toast.success(message);
      navigate({ to: "/products" });
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
    <div className="flex items-center w-full mx-auto px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-500">
                      Product in Stock
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many product in stock?"
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
            <div className="md:col-span-3 xs:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="ZAP-010406" type="" {...field} />
                    </FormControl>
                    <FormDescription>
                      A Unique Identifier for every Product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-3 xs:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" type="" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-3 xs:col-span-6 col-span-12">
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
            <div className="md:col-span-3 xs:col-span-6 col-span-12">
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
                        placeholder="Enter your tags"
                      />
                    </FormControl>
                    <FormDescription>Add colors</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="md:col-span-3 xs:col-span-6 col-span-12">
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

            <div className="md:col-span-3 xs:col-span-6 col-span-12">
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
                    <FormDescription>
                      Enter maximum time to deliver the product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-3 xs:col-span-6 col-span-12">
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categories</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          {field.value?.length
                            ? field.value.join(", ")
                            : "Select categories"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandGroup>
                            {baseCategories.map((item: Category) => (
                              <CommandItem
                                key={item.category}
                                onSelect={() => {
                                  const current = field.value || [];
                                  if (current.includes(item.category)) {
                                    field.onChange(
                                      current.filter((c) => c !== item.category)
                                    );
                                  } else {
                                    field.onChange([...current, item.category]);
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={field.value?.includes(item.category)}
                                  className="mr-2"
                                />
                                {item.category.charAt(0).toUpperCase() +
                                  item.category.slice(1)}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Add Categories</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-3 xs:col-span-6 col-span-12">
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
                        placeholder="M"
                      />
                    </FormControl>
                    <FormDescription>Enter Sizes</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="xs:col-span-6 col-span-12 space-y-2 xs:order-2 order-1">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description ..."
                        className="h-8"
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
                    <FormControl>
                      <Textarea
                        placeholder="Features & Benifites ..."
                        className="h-8"
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
                    <FormControl>
                      <Textarea
                        placeholder="Ideal For ..."
                        className="h-8"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="xs:col-span-6 col-span-12 xs:order-1 order-2">
              <FormField
                control={form.control}
                name="pictures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pictures</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={(updatedFiles) => {
                          setFiles(updatedFiles); // Update local state
                          field.onChange(updatedFiles); // Sync with form state
                        }}
                        dropzoneOptions={dropZoneConfig}
                        className="relative bg-background rounded-lg p-2"
                      >
                        <FileInput
                          id="fileInput"
                          className="outline-dashed outline-1 outline-slate-500"
                          {...field}
                        >
                          <div className="flex items-center justify-center flex-col p-7 w-full ">
                            <CloudUpload className="text-gray-500 w-10 h-10" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                              &nbsp; or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              SVG, PNG, JPG or GIF
                            </p>
                          </div>
                        </FileInput>
                        <FileUploaderContent>
                          {files &&
                            files.length > 0 &&
                            files.map((file, i) => (
                              <FileUploaderItem key={i} index={i}>
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                              </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormDescription>
                      Select maximum 4 Picture ( first picture will be the
                      primary picture).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-[33%] md:p-6 text-lg"
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Adding....
              </>
            ) : (
              <>
                <Plus /> Add Product
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
