"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Clock,
  Package,
  Plane,
  Shield,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const orderStatuses = [
  {
    key: "placed",
    label: "Order Placed",
    icon: <Package className="w-4 h-4" />,
    description: "Your order has been received and is being processed",
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Your order has been confirmed and payment processed",
  },
  {
    key: "coming from overseas",
    label: "Coming from Overseas",
    icon: <Plane className="w-4 h-4" />,
    description: "Your order is being shipped from our international warehouse",
  },
  {
    key: "waiting for custom check",
    label: "Customs Check",
    icon: <Shield className="w-4 h-4" />,
    description: "Your package is undergoing customs inspection",
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: <Truck className="w-4 h-4" />,
    description: "Your order is on its way to you",
  },
  {
    key: "out for delivary",
    label: "Out for Delivery",
    icon: <Truck className="w-4 h-4" />,
    description: "Your package is out for delivery and will arrive today",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Your order has been successfully delivered",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    icon: <XCircle className="w-4 h-4" />,
    description: "Your order has been cancelled",
  },
];

function getStatusBadgeVariant(status) {
  switch (status) {
    case "delivered":
      return "default";
    case "cancelled":
      return "destructive";
    case "out for delivary":
      return "default";
    default:
      return "secondary";
  }
}

function getCurrentStatusIndex(status) {
  return orderStatuses.findIndex((s) => s.key === status);
}

function getRelevantStatuses(shippedFrom) {
  if (shippedFrom === "Bangladesh") {
    return orderStatuses.filter(
      (status) =>
        status.key !== "coming from overseas" &&
        status.key !== "waiting for custom check"
    );
  }
  return orderStatuses;
}

export default function OrderTracking({ order }) {
  const [isOpen, setIsOpen] = useState(false);
  const currentStatusIndex = getCurrentStatusIndex(order.status);
  const currentStatus = orderStatuses[currentStatusIndex];
  const maxDeliveryDate = order.items.reduce((max, obj) => {
    return new Date(obj.delivaryDate) > max ? new Date(obj.delivaryDate) : max;
  }, new Date(order.items[0].delivaryDate));
  const shippedFrom =
    order.items.find((item) => item.product.shipFrom !== "Bangladesh")?.product
      .shipFrom || "Bangladesh";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Track Order Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Truck className="h-4 w-4" />
            Track Order
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Tracking</DialogTitle>
            <DialogDescription>
              Track your order #{order._id.slice(-7)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentStatus.icon}
                <div>
                  <h3 className="font-semibold">{currentStatus.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentStatus.description}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusBadgeVariant(order.status)}>
                {currentStatus.label}
              </Badge>
            </div>

            <Separator />

            {/* Order Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium">
                  {new Date(order.deliveryDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Shipped From</p>
                <p className="font-medium">Bangladesh</p>
              </div>
              {true && (
                <div>
                  <p className="text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">
                    {order.trackingNumber
                      ? order.trackingNumber
                      : "Not available"}
                  </p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">Total Items</p>
                <p className="font-medium">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Order Type</p>
                <p className="font-medium">
                  {shippedFrom === "Bangladesh" ? "Domestic" : "International"}
                </p>
              </div>
            </div>

            <Separator />

            {/* Progress Timeline */}
            <div>
              <h4 className="font-semibold mb-4">Tracking Progress</h4>
              <div className="space-y-4">
                {(() => {
                  const relevantStatuses = getRelevantStatuses(shippedFrom);
                  const currentStatusIndex = relevantStatuses.findIndex(
                    (s) => s.key === order.status
                  );

                  // For normal flow, show current status first, then completed ones in reverse order
                  const completedStatuses = relevantStatuses
                    .slice(0, currentStatusIndex)
                    .reverse();
                  const currentStatus = relevantStatuses[currentStatusIndex];
                  const statusesToShow = [currentStatus, ...completedStatuses];

                  return statusesToShow.map((status, index) => {
                    const isCurrent = index === 0;
                    const isCompleted = index > 0;

                    return (
                      <div key={status.key} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                            isCurrent
                              ? "border-primary bg-primary/10 text-primary"
                              : "bg-primary border-primary text-primary-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div
                            className={`font-medium ${
                              isCurrent ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {status.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {status.description}
                          </div>
                          {isCurrent && order.status !== "delivered" && (
                            <div className="text-xs text-primary mt-1 font-medium">
                              Current Status
                            </div>
                          )}
                          {isCompleted && (
                            <div className="text-xs text-green-600 mt-1 font-medium">
                              Completed
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            <Separator />

            {/* Additional Information based on status */}
            {order.status === "delivered" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">
                    Order Delivered Successfully!
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Thank you for your purchase. We hope you enjoy your items!
                </p>
              </div>
            )}

            {order.status === "cancelled" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircle className="w-4 h-4" />
                  <span className="font-medium">Order Cancelled</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Your order has been cancelled. If you have any questions,
                  please contact our support team.
                </p>
              </div>
            )}

            {order.status === "out for delivary" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Truck className="w-4 h-4" />
                  <span className="font-medium">Out for Delivery</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Your package is out for delivery and should arrive today.
                  Please ensure someone is available to receive it.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
