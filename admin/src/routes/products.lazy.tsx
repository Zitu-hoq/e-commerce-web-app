import { API } from "@/api/server";
import ProductCard from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layout";
import { Product } from "@/types";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/products")({
  component: RouteComponent,
});

async function getData(): Promise<Product[]> {
  //Fetch data from your API here.
  const Products = await API.get("/api/admin/product/all");
  const ProductsData = Products.data.products;
  return ProductsData;
}

function RouteComponent() {
  const { toast } = useToast();
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Product[] = await getData();
        setData(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log("error fetching data", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Products!!!",
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
      <Layout pageName="Products">
        <div className="flex flex-wrap justify-between">
          {isLoading ? (
            <ProductSkeleton />
          ) : (
            data.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))
          )}
        </div>
      </Layout>
    </>
  );
}
