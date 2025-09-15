import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddVoucher } from "@/components/voucher/AddVoucher";
import VoucherCard from "@/components/voucher/VoucherCard";
import VoucherSkeleton from "@/components/voucher/VoucherSkeleton";
import Layout from "@/Layout";
import { Voucher } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/vouchers")({
  component: RouteComponent,
});

async function getData(): Promise<Voucher[]> {
  //Fetch data from your API here.
  const res = await API.get("/api/admin/voucher");
  const Vouchers = res.data.vouchers;
  return Vouchers;
}

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: Voucher[] = await getData();
        setVouchers(response);
      } catch (error) {
        console.log("error fetching data", error);
        toast.error(
          error.response.data.message || "Error Fetching Products!!!"
        );
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVoucherSubmit = async (data: Voucher) => {
    setIsSubmitting(true);
    try {
      const url = import.meta.env.VITE_API_URL + "/api/admin/voucher/add";
      const res = await API.post(url, data);
      const message = res.data.message;
      toast.success(message);
      setTimeout(() => {
        window.location.href = "/vouchers";
      }, 1000);
    } catch (error) {
      console.log("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Layout pageName="Vouchers">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Voucher
              </Button>
            </DialogTrigger>

            <DialogContent
              className={`sm:max-w-[500px] transition-opacity duration-200 ${
                isSubmitting ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <DialogHeader>
                <DialogTitle>Create New Voucher</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new discount voucher.
                </DialogDescription>
              </DialogHeader>

              <AddVoucher
                onSubmit={handleVoucherSubmit}
                onCancel={handleCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-row">
          {isLoading ? (
            <VoucherSkeleton />
          ) : (
            vouchers.map((voucher) => (
              <VoucherCard key={voucher._id} {...voucher} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
