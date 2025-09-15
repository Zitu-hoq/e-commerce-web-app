"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderSheetProps } from "@/types";
import { Check, Edit3, Minus, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

const formSchema = z.object({
  _id: z.string(),
  user: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  items: z.array(
    z.object({
      product: z.object({
        _id: z.string(),
        name: z.string(),
      }),
      quantity: z.number().optional(),
      unitPrice: z.number(),
      size: z.string().optional(),
      color: z.string().optional(),
      deliveryDate: z.date(),
      _id: z.string().optional(),
      userComment: z.string().optional(),
      rating: z.number().optional(),
    })
  ),
  voucher: z.string().optional(),
  shippingAddress: z
    .object({
      fullName: z.string(),
      phone: z.string(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string().optional(),
      country: z.string(),
    })
    .optional(),
  deliveryDate: z.date(),
  trackingNumber: z.string(),
  totalAmount: z.number(),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  status: z.enum([
    "placed",
    "confirmed",
    "coming from overseas",
    "waiting for custom check",
    "shipped",
    "out for delivary",
    "delivered",
    "cancelled",
  ]),
  paymentMethod: z.enum(["COD", "Card", "Mobile Banking", "processing"]),
  paidAmount: z.number().optional(),
  __v: z.number().optional(),
  createdAt: z.date(),
  adminComment: z.string().optional(),
});

export default function EditForm({ data }: OrderSheetProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        deliveryDate: item.deliveryDate
          ? new Date(item.deliveryDate)
          : undefined,
      })),
      adminComment: data.adminComment ? data.adminComment : undefined,
      deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
      voucher: data.voucher ? data.voucher : "",
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      status: [
        "placed",
        "confirmed",
        "coming from overseas",
        "waiting for custom check",
        "shipped",
        "out for delivary",
        "delivered",
        "cancelled",
      ].includes(data.status)
        ? (data.status as
            | "placed"
            | "confirmed"
            | "coming from overseas"
            | "waiting for custom check"
            | "shipped"
            | "out for delivary"
            | "delivered"
            | "cancelled")
        : "placed",
      paymentStatus: ["pending", "paid", "failed"].includes(data.paymentStatus)
        ? (data.paymentStatus as "pending" | "paid" | "failed")
        : "pending",
      paymentMethod: ["COD", "Card", "Mobile Banking", "processing"].includes(
        data.paymentMethod
      )
        ? (data.paymentMethod as
            | "COD"
            | "Card"
            | "Mobile Banking"
            | "processing")
        : "COD",
    },
  });
  const [editDeliveryDate, setEditDeliveryDate] = useState(false);
  const [track, setTrack] = useState(!!data.trackingNumber);
  const [editMethod, setEditMethod] = useState(false);
  const [paidEdit, setPaidEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [archive, setArchive] = useState(false);
  const [comment, setComment] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const orderId = data._id;
  const [date, setDate] = useState(data.deliveryDate);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await API.delete("/api/admin/order/delete", {
        data: { orderId },
      });
      const message = res.data.message;
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete orders");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1000);
    }
  };

  const handleArchive = async () => {
    form.setValue("adminComment", "");
    setArchive(false);
    setLoading(true);
    const { _id, __v, user, items, createdAt, updatedAt, ...rest } = data;
    const products = items.map(
      ({ _id, product, deliveryDate, ...otherData }) => {
        return { ...otherData, product: product._id };
      }
    );
    const orderData = {
      ...rest,
      user: user._id,
      items: products,
      adminComment: comment,
      placedOn: createdAt,
    };
    try {
      const res = await API.post("/api/admin/order/archive", {
        orderId,
        orderData,
      });
      const message = res.data.message;
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete orders");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1000);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log(orderId);
    const allowedFields = [
      "deliveryDate",
      "status",
      "paymentStatus",
      "paymentMethod",
      "paidAmount",
      "trackingNumber",
    ];
    // Compare defaultValues (original data) with current values to get changed fields
    const updates: Partial<typeof values> = {};
    allowedFields.forEach((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (JSON.stringify(values[key]) !== JSON.stringify(data[key])) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        updates[key] = values[key];
      }
    });
    try {
      const res = await API.put("/api/admin/order/edit", { orderId, updates });
      const message = res.data.message;
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    } finally {
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/orders";
      }, 1000);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormItem>
          <div className="mt-4">
            User Name:&nbsp;{form.getValues("user").name}
          </div>
        </FormItem>

        <FormItem>
          <FormLabel>Shipping Address</FormLabel>
          <div className="py-2 px-3">
            {form.getValues("shippingAddress")?.fullName}, <br />
            {form.getValues("shippingAddress")?.phone}
            <address>
              {form.getValues("shippingAddress")?.addressLine2 &&
                form.getValues("shippingAddress")?.addressLine2}
              , {form.getValues("shippingAddress")?.addressLine1},{" "}
              {form.getValues("shippingAddress")?.city},
              {form.getValues("shippingAddress")?.state},{" "}
              {form.getValues("shippingAddress")?.country}
            </address>
          </div>
        </FormItem>

        <FormItem>
          <FormLabel>Product</FormLabel>
          <div>
            {form.getValues("items").map((_) => {
              return (
                <div
                  key={_._id}
                  className="capitalize mb-4 flex justify-between"
                >
                  <ul>
                    <li>Name: {_.product.name}</li>
                    <li>Unit Price: {_.unitPrice}</li>
                    <li>Quantity: {_.quantity}</li>
                    <li>
                      Size: <span className="uppercase">{_.size}</span>
                    </li>
                    <li>color: {_.color}</li>
                    <li>
                      delivery date:{" "}
                      {new Date(_.deliveryDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </li>
                    {_.userComment && <li>User Comment: {_.userComment}</li>}
                    {_.rating && <li>Rating: {_.rating}</li>}
                  </ul>
                  <Button type="button" variant="outline">
                    Fetch Product
                  </Button>
                </div>
              );
            })}
          </div>
        </FormItem>
        {form.getValues("voucher") && (
          <FormItem>
            <div>Voucher: &nbsp;{form.getValues("voucher")}</div>
          </FormItem>
        )}
        <FormItem>
          <div>
            Total Amount:{" "}
            <span className="text-blue-500">
              BDT {form.getValues("totalAmount")}
            </span>
          </div>
        </FormItem>

        <FormItem>
          <div className="flex justify-between">
            <div>
              Payment Method:{" "}
              <Badge
                className={
                  form.getValues("paymentMethod") === "Card"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }
              >
                {form.getValues("paymentMethod")}
              </Badge>
            </div>

            <Button
              type="button"
              variant={"outline"}
              onClick={() => setEditMethod(!editMethod)}
            >
              {editMethod ? <Check /> : <Edit3 />}
            </Button>
          </div>
        </FormItem>
        {editMethod && (
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-gray-900 ">
                    <SelectItem
                      value="COD"
                      className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                      COD
                    </SelectItem>
                    <SelectItem
                      value="Card"
                      className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                      Card
                    </SelectItem>
                    <SelectItem
                      value="Mobile Banking"
                      className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                      Mobile Banking
                    </SelectItem>
                    <SelectItem
                      value="processing"
                      className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                    >
                      Processing
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormItem>
          <div className="flex justify-between">
            <div>
              Paid Amount:{" "}
              <span className="text-green-500">
                BDT {form.getValues("paidAmount")}
              </span>
            </div>

            <Button
              type="button"
              variant={"outline"}
              onClick={() => setPaidEdit(!paidEdit)}
            >
              {paidEdit ? <Check /> : <Edit3 />}
            </Button>
          </div>
        </FormItem>
        {paidEdit && (
          <FormField
            control={form.control}
            name="paidAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green-500">
                  Change Paid Amount
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-gray-900">
                  <SelectItem
                    value="pending"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Pending
                  </SelectItem>
                  <SelectItem
                    value="paid"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Paid
                  </SelectItem>
                  <SelectItem
                    value="faild"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Faild
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <div>
            Order Placed On: &nbsp;
            <span className="text-blue-500">
              {new Date(form.getValues("createdAt")).toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
          </div>
        </FormItem>
        <FormItem>
          <div className="flex justify-between">
            <div>
              Delivery Date: &nbsp;
              <span className="text-red-500 mr-2">
                {new Date(date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditDeliveryDate(!editDeliveryDate)}
            >
              {!editDeliveryDate ? <Edit3 /> : <Check />}
            </Button>
          </div>
          {editDeliveryDate && (
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentDate = form.getValues("deliveryDate");
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() - 1);
                  form.setValue("deliveryDate", newDate);
                  setDate(newDate);
                }}
              >
                <Minus />
                Decrease
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const currentDate = form.getValues("deliveryDate");
                  const newDate = new Date(currentDate);
                  newDate.setDate(newDate.getDate() + 1);
                  form.setValue("deliveryDate", newDate);
                  setDate(newDate);
                }}
              >
                <Plus />
                Increase
              </Button>
            </div>
          )}
        </FormItem>
        {!track ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setTrack(true)}
          >
            Enter Tracking Number
          </Button>
        ) : (
          <FormField
            control={form.control}
            name="trackingNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex">
                  Tracking Number&nbsp;
                  <Truck />
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:bg-gray-900">
                  <SelectItem
                    value="placed"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Placed
                  </SelectItem>
                  <SelectItem
                    value="confirmed"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Confirmed
                  </SelectItem>
                  <SelectItem
                    value="coming from overseas"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Coming from Overseas
                  </SelectItem>
                  <SelectItem
                    value="waiting for custom check"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Waiting for Custom Check
                  </SelectItem>
                  <SelectItem
                    value="shipped"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Shipped
                  </SelectItem>
                  <SelectItem
                    value="out for delivary"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Out for Delivery
                  </SelectItem>
                  <SelectItem
                    value="delivered"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Delivered
                  </SelectItem>
                  <SelectItem
                    value="cancelled"
                    className="dark:hover:bg-gray-800 hover:bg-gray-200 cursor-pointer"
                  >
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {archive && (
          <FormField
            control={form.control}
            name="adminComment"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex">Comment&nbsp;:</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please write your opinion about this order..."
                    {...field}
                    autoFocus
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setComment(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-between">
          {archive && (
            <div>
              <Button type="button" variant="default" onClick={handleArchive}>
                Add to Archive
              </Button>
              <Button
                type="button"
                variant="outline"
                className="ml-8"
                onClick={() => {
                  form.setValue("adminComment", "");
                  setComment("");
                  setArchive(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          <Button
            type="submit"
            variant="default"
            className={archive ? "hidden" : ""}
            disabled={archive || loading}
          >
            Submit
          </Button>

          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setArchive(true);
            }}
            className={archive ? "hidden" : ""}
          >
            Archive
          </Button>

          <Button
            type="button"
            onClick={() => setShowDeleteAlert(true)}
            variant={"destructive"}
            className={archive ? "hidden" : ""}
            disabled={archive || loading}
          >
            Delete
          </Button>
        </div>
      </form>
      {showDeleteAlert && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-gray-300 dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col items-center">
            <div className="text-red-600 font-bold text-lg mb-4">
              Attention!!
            </div>
            <div className="mb-6 text-center">
              Order will be deleted permanently!
            </div>
            <div className="flex gap-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setShowDeleteAlert(false);
                  handleDelete();
                }}
              >
                OK
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteAlert(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}
