import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "../ui/separator";

export function OrderSkeleton() {
  return (
    <div className="m-4">
      <div className="flex items-center justify-between">
        <Skeleton className="m-4 h-8 w-[350px]" />
        <Skeleton className="m-4 h-8 w-[100px]" />
      </div>
      <Separator />

      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
      <Skeleton className="my-4 h-7 w-full" />
      <Separator />
    </div>
  );
}
