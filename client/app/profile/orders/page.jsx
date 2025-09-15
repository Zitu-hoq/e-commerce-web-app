"use client";
import OrderCard from "@/components/OrderCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";

export default function OrdersPage() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const orders = user.order || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length !== 0 ? (
          orders.map((order) => {
            return (
              <div
                key={order._id}
                className="flex flex-col items-center justify-center py-2"
              >
                <OrderCard data={order} />
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Orders</h3>
            <p className="text-sm text-muted-foreground">
              You have no orders at this time.
            </p>
          </div>
        )}
        {/* <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Placed On</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3">650679126172889</td>
                <td className="px-4 py-3">16/11/2023</td>
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3">$124.00</td>
                <td className="px-4 py-3">
                  <Button variant="link" className="text-blue-600">
                    MANAGE
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </CardContent>
    </Card>
  );
}
