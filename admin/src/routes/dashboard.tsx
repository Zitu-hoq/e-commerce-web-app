import { API } from "@/api/server";
import { CardBuilder } from "@/components/dashboard/CardBuilder";
import { DasboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layout";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

async function getData() {
  //Fetch data from your API here.
  const res = await API.get("/api/admin/analytics/");
  const analyticsData = res.data.analytics;
  return analyticsData;
}

function Dashboard() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        setData(response);
      } catch (error) {
        console.log("error fetching data", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Analytics Data!!!",
          description: error.response.data.message || "reload page",
        });
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Layout pageName="Dashboard">
        <div>
          <h1 className="text-2xl">Welcome to The Dashboard!!!</h1>
        </div>
        <div className="flex flex-wrap justify-between">
          {isLoading ? (
            <DasboardSkeleton />
          ) : (
            <>
              <CardBuilder
                title="Customers"
                primary={data.totalUsers}
                secondary={data.lastMonthUsers}
                paint="text-sky-500"
              />
              <CardBuilder
                title="Products"
                primary={data.totalNumberOfProducts}
                secondary={data.lastMonthAddedProducts}
                paint="text-purple-500"
              />
              <CardBuilder
                title="Orders"
                primary={data.totalCompletedOrders + data.totalCurrentOrders}
                secondary={
                  data.lastMonthIncompletedOrders +
                  data.lastMonthCompletedOrders
                }
                paint="text-indigo-500"
              />
              <CardBuilder
                title="Completed"
                primary={data.totalCompletedOrders}
                secondary={data.lastMonthCompletedOrders}
                paint="text-green-500"
              />
              <CardBuilder
                title="Categories"
                primary={data.totalNumberOfCategories}
                paint="text-rose-500"
              />
              <CardBuilder
                title="Coupons"
                primary={data.activeVouchers + data.inactiveVouchers}
                secondary={data.activeVouchers}
                paint="text-sky-500"
              />
            </>
          )}
        </div>
      </Layout>
    </>
  );
}
