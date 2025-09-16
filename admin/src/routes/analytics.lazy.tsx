import { API } from "@/api/server";
import { AnalyticSkeleton } from "@/components/analytics/AnalyticSkeleton";
import { OrderAnalysis } from "@/components/analytics/OrderAnalysis";
import { ReviewAnalysis } from "@/components/analytics/ReviewAnalysis";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layout";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductAnalysis } from "./../components/analytics/ProductAnalysis";
import { UserAnalysis } from "./../components/analytics/UserAnalysis";

export const Route = createLazyFileRoute("/analytics")({
  component: RouteComponent,
});

async function getData() {
  //Fetch data from your API here.
  const res = await API.get("/api/admin/analytics/");
  const analyticsData = res.data.analytics;
  return analyticsData;
}

function RouteComponent() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData();
        setData(response);
        console.log(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
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
      <Layout pageName="Analytics">
        <div className="flex flex-wrap justify-between">
          {isLoading ? <AnalyticSkeleton /> : <UserAnalysis />}
          <OrderAnalysis />
          <ReviewAnalysis />
          <ProductAnalysis />
        </div>
      </Layout>
    </>
  );
}
