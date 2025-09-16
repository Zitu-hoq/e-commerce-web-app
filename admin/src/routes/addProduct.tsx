import { API } from "@/api/server";
import AddCategory from "@/components/product/AddCategory";
import AddProuct from "@/components/product/AddProduct";
import Layout from "@/Layout";
import { Category } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/addProduct")({
  component: RouteComponent,
});
async function getData(): Promise<Category[]> {
  //Fetch data from your API here.
  const res = await API.get("/api/public/category");

  return res.data;
}

function RouteComponent() {
  const [data, setData] = useState<Category[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Category[] = await getData();
        setData(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("error fetching data", error);
        toast.error(error.response?.data?.message || "reload Page");
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Layout pageName="Add Product">
        <div className="px-4 pt-6">
          <AddCategory preData={data} />
        </div>
        <div>
          <AddProuct baseCategories={data} />
        </div>
      </Layout>
    </>
  );
}
