import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticSkeleton() {
  return (
    <div className="m-4 w-[350px] md:w-[300px] sm:w-full bg-slate-200 border-slate-300 dark:bg-slate-900 rounded-lg dark:border-slate-800">
      <div className="flex flex-col items-center justify-center p-2">
        <Skeleton className="m-2 h-4 w-[100px]" />
        <Skeleton className="mb-4 h-4 w-[200px]" />
        <Skeleton className="h-44 w-44 rounded-full" />
        <Skeleton className="mt-4 h-4 w-3/4" />
        <Skeleton className="m-2 h-4 w-full" />
      </div>
    </div>
  );
}
