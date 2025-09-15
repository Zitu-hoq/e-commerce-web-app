import { API } from "@/api/server";
import { UserSkeleton } from "@/components/user/UserSkeleton";
import { UserTable } from "@/components/user/UserTable";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/Layout";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createLazyFileRoute("/customers")({
  component: RouteComponent,
});
async function getData() {
  //Fetch data from your API here.
  const res = await API.get("/api/admin/analytics/user");
  const usersData = res.data.users;
  return usersData;
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
      } catch (error) {
        console.log("error fetching data", error);
        toast({
          variant: "destructive",
          title: "Error Fetching Analytics Data!!!",
          description: error.response.data.message || "reload page",
        });
        // window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <Layout pageName="Customers">
        <div>{isLoading ? <UserSkeleton /> : <UserTable users={data} />}</div>
      </Layout>
    </>
  );
}
