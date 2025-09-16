"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Voucher } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Portal } from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon, Edit3 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { DestructiveAlert } from "../DestructiveAleart";

const formSchema = z.object({
  _id: z.string(),
  __v: z.number().optional(),
  code: z.string().min(1, "Code is required"),
  discountType: z.string(),
  discountValue: z.number().min(0, "Discount value must be positive"),
  minPurchase: z.number().min(0, "Minimum purchase must be positive"),
  maxDiscount: z.number().min(0, "Maximum discount must be positive"),
  expiryDate: z.date(),
  isActive: z.boolean(),
});
type FormData = z.infer<typeof formSchema>;

export function EditVoucher({ ...data }: Voucher) {
  const { expiryDate, ...rest } = data;

  const [loading, setLoading] = useState(false);
  const date = new Date(expiryDate);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { expiryDate: date, ...rest },
  });
  const {
    formState: { dirtyFields },
  } = form;
  const handleSubmit = async (values: FormData) => {
    setLoading(true);
    const dirtyFieldsKeys = Object.keys(dirtyFields);
    const changedValues = dirtyFieldsKeys.reduce((acc, key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc[key as keyof FormData] = values[key as keyof FormData];
      return acc;
    }, {} as Partial<FormData>);
    console.log("Changed values only:", changedValues);
    const url = `/api/admin/voucher/edit/${data.code}`;
    try {
      const res = await API.put(url, changedValues);
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.href = "/vouchers";
      }, 1000);
    } catch (error: any) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    const deleteUrl = `/api/admin/voucher/delete/${data.code}`;
    try {
      const res = await API.delete(deleteUrl);
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.href = "/vouchers";
      }, 1000);
    } catch (error: any) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="absolute -top-2 -right-2 dark:text-secondary z-10 bg-white shadow-md hover:bg-gray-50 dark:hover:bg-gray-400"
        >
          <Edit3 className="w-4 h-4 mr-1 " /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-3/4 md:!w-1/3 !max-w-none">
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voucher Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., G25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>
                    Discount Value{" "}
                    {form.watch("discountType") === "percentage"
                      ? "(%)"
                      : "(TK)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="25"
                      value={value.toString()}
                      onChange={(e) =>
                        onChange(Number.parseFloat(e.target.value) || 0)
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minPurchase"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase (TK)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        value={value.toString()}
                        onChange={(e) =>
                          onChange(Number.parseFloat(e.target.value) || 0)
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxDiscount"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Maximum Discount (TK)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100"
                        value={value.toString()}
                        onChange={(e) =>
                          onChange(Number.parseFloat(e.target.value) || 0)
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent
                        className="w-auto p-0 z-[9999] pointer-events-auto"
                        align="end"
                        sideOffset={4}
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </PopoverContent>
                    </Portal>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Make this voucher active immediately
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="submit" className="w-[100%]" disabled={loading}>
                Update
              </Button>

              <DestructiveAlert
                trigger="Delete"
                description="This action cannot be undone. This will permanently delete this Voucher."
                btn="Yes, Delete this Voucher"
                onConfirm={handleDelete}
              />
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
