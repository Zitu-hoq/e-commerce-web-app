import { API } from "@/api/server";
import { OrderSkeleton } from "@/components/orders/OrderSkeleton";
import Layout from "@/Layout";
import { Order } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns } from "../components/orders/columns";
import { DataTable } from "../components/orders/data-table";

export const Route = createFileRoute("/orders")({
  component: RouteComponent,
});

async function getData(): Promise<Order[]> {
  const res = await API.get("/api/admin/order");
  const OrderData = res.data.orders;
  return OrderData;
}

function RouteComponent() {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Order[] = await getData();
        setData(response);
      } catch (error) {
        console.log(error);
        toast.error("Error fetching orders");
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout pageName="Orders">
      <div className="container mx-auto">
        {isLoading ? (
          <OrderSkeleton />
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
    </Layout>
  );
}
