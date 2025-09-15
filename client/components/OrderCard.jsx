"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cancelOrder } from "@/lib/paymentAPI";
import { CalendarDays, CreditCard, MapPin, Package } from "lucide-react";
import { useState } from "react";
import OrderTracking from "./OrderTracking";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
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

const getPaymentStatusColor = (status) => {
  switch (status.toLowerCase()) {
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

export default function OrderCard({ data }) {
  const [loading, setLoading] = useState(false);
  const { addressLine1, city, state, country, zipCode } = data.shippingAddress;
  const addressLine2 = data.shippingAddress.addressLine2
    ? data.shippingAddress.addressLine2
    : "";
  const handleCancel = async () => {
    setLoading(true);
    const cancelled = await cancelOrder(data._id);
    if (cancelled)
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    else setLoading(false);
  };
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="space-y-4">
        <Card key={data._id} className="overflow-hidden">
          <CardHeader
            className={
              data.paymentMethod === "processing"
                ? "bg-orange-100 text-black"
                : "bg-muted/50"
            }
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg">
                  Order {data._id.slice(-7)}
                  {data.paymentMethod === "processing" && (
                    <span>(Please select a payment method)</span>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {data.items.length} product
                    {data.items.length > 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    Est. delivery:{" "}
                    {new Date(data.deliveryDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <div className="text-2xl font-bold">
                  BDT&nbsp;{data.totalAmount.toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(data.status)}>
                    {data.status}
                  </Badge>
                  <Badge className={getPaymentStatusColor(data.paymentStatus)}>
                    {data.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Size
                      </TableHead>
                      <TableHead className="hidden sm:table-cell">
                        Color
                      </TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            src={
                              item.product.primaryPicture || "/placeholder.svg"
                            }
                            alt={item.product.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm capitalize text-muted-foreground sm:hidden">
                            Size: {item.size} • Color: {item.color}
                          </div>
                        </TableCell>
                        <TableCell className="hidden capitalize sm:table-cell">
                          {item.size}
                        </TableCell>
                        <TableCell className="hidden uppercase sm:table-cell">
                          {item.color}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Order Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {addressLine2}, {addressLine1}, {city}, {state}-{zipCode},
                  {country}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Method:
                    </span>
                    <span>{data.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Payment Status:
                    </span>
                    <Badge
                      className={getPaymentStatusColor(data.paymentStatus)}
                      variant="outline"
                    >
                      {data.paymentStatus}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>BDT&nbsp;{data.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/*edit here */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
              <div>
                {data.paymentMethod !== "processing" && (
                  <OrderTracking order={data} />
                )}
              </div>

              {data.status === "delivered" && (
                <Button variant="outline">Leave Review</Button>
              )}
              {data.paymentStatus === "pending" && data.status === "placed" && (
                <Button
                  variant="destructive"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Cancel Order"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {data.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't placed any orders yet.
            </p>
            <Button>Start Shopping</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
