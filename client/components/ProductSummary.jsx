"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Calendar, Plane } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export default function ProductSummary({ item, index }) {
  const addDays = (days) =>
    new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  const dateStr = addDays(item.product.estDelivaryTime);
  const dateStr1 = addDays(item.product.estDelivaryTime + 4);

  return (
    <Card className="bg-inherit dark:shadow-gray-800">
      <CardHeader>
        <CardTitle className="text-xl">Item: {index + 1}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={item.product.primaryPicture || img}
              alt={item.product.name}
              width={120}
              height={120}
              className="rounded-lg object-cover border"
            />
          </div>

          {/* Product Information */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-primary">
                {item.product.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-500">Size</Label>
                <p className="font-medium uppercase">{item.size}</p>
              </div>
              <div>
                <Label className="text-gray-500">Color</Label>
                <p className="font-medium uppercase">{item.color}</p>
              </div>
              <div>
                <Label className="text-gray-500">Quantity</Label>
                <p className="font-medium">{item.quantity}</p>
              </div>
              <div>
                <Label className="text-gray-500">Unit Price</Label>
                <p className="font-medium">BDT {item.product.price}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Estimated Delivery:
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {dateStr} - {dateStr1}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Plane className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-600 dark:text-gray-400">
                  Shipping From:
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {item.product.shipFrom}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Subtotal ({item.quantity} items)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shipping Cost
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="font-medium">
                  Tk {item.product.price * item.quantity}
                </p>
                <p className="font-medium text-blue-600 dark:text-blue-400">
                  {item.product.shipFrom === "Bangladesh" ? 60 : 200}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
