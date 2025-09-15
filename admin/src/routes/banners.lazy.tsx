import { API } from "@/api/server";
import AddBanners from "@/components/banners/AddBanners";
import { BannerCard } from "@/components/banners/BannerCard";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layout";
import { Banner } from "@/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/banners")({
  component: RouteComponent,
});

async function getData(): Promise<Banner[]> {
  //Fetch data from your API here.
  const res = await API.get("/api/admin/banner");
  const BannerData = res.data;
  return BannerData;
}

function RouteComponent() {
  const [data, setData] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: Banner[] = await getData();
        setData(res);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error Fetching Banners!!!",
          description: error.response.data.message || "reload page",
        });
        console.log(error);
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Layout pageName="Add Product">
        <div className="px-4 pt-6">
          <AddBanners />
        </div>
        <div>
          {isLoading
            ? "loading...."
            : data.map((banner) => <BannerCard key={banner._id} {...banner} />)}
        </div>
      </Layout>
    </>
  );
}
