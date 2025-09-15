import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "../ui/separator";

export function UserSkeleton() {
  return (
    <div className="m-4">
      <Skeleton className="my-4 h-6 w-full" />
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
