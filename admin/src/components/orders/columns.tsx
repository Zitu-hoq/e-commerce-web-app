"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "../ui/badge";
import EditSheetComponent from "./ShowSheet";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const name = row.original.user.name;
      return name;
    },
  },
  {
    accessorKey: "items",
    header: "Products",
    cell: ({ row }) => {
      const items = row.original.items;
      return (
        <ul className="list-disc">
          {items.map((item, idx) => (
            <li key={idx}>{item.product.name}</li>
          ))}
        </ul>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "shippingAddress",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.shippingAddress;
      // items is an array, so map over it
      return (
        <address>
          {address?.addressLine1},&nbsp;{address?.city},&nbsp;
          {address?.state.split(" ")[0]}-{address?.zipCode}
          {address?.country !== "Bangladesh" ? address?.country : ""}
        </address>
      );
    },
  },
  {
    accessorKey: "shippingAddress.phone",
    header: "Phone Number",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ordered Date
          <ArrowUpDown className="h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.deliveryDate);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    },
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusColor = (val: string) => {
        switch (val.toLowerCase()) {
          case "delivered":
            return "bg-green-100 text-green-800 hover:bg-green-100";
          case "shipped":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100";
          case "confirmed":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
          case "cancelled":
            return "bg-red-100 text-red-800 hover:bg-red-100";
          default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        }
      };
      const bgColor = getStatusColor(status);
      return <Badge className={bgColor}>{status}</Badge>;
    },
  },
  {
    accessorKey: "paidAmount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Paid Amount
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const getPaymentStatusColor = (val: string) => {
        switch (val.toLowerCase()) {
          case "paid":
            return "bg-green-100 text-green-800 hover:bg-green-100";
          case "pending":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
          case "failed":
            return "bg-red-100 text-red-800 hover:bg-red-100";
          default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        }
      };
      const bgColor = getPaymentStatusColor(status);
      return <Badge className={bgColor}>{status}</Badge>;
    },
  },

  {
    accessorKey: "deliveryDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Delivery Date
          <ArrowUpDown className="h-2 w-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.deliveryDate);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      });
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <EditSheetComponent data={order} />
        </div>
      );
    },
  },
];
