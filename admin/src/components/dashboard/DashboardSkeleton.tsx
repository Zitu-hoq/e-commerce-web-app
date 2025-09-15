import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "../ui/separator";

export function DasboardSkeleton() {
  return (
    <div className="m-4 w-[350px] md:w-[300px] sm:w-full bg-slate-200 border-slate-300 dark:bg-slate-900 rounded-lg dark:border-slate-800">
      <div>
        <div className="flex items-center justify-center p-2">
          <Skeleton className="m-4 h-8 w-[150px]" />
        </div>
      </div>
      <Separator />
      <div className="flex flex-row justify-between p-4">
        <Skeleton className="h-7 w-[150px]" />
        <Skeleton className="h-8 w-[50px]" />
      </div>
      <div className="flex justify-between p-4">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-7 w-[50px]" />
      </div>
    </div>
  );
}
