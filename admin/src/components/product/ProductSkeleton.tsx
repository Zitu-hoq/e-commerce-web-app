import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <>
      <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-slate-200 dark:border-gray-800 bg-slate-100 dark:bg-gray-900 shadow-md">
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          <Skeleton className="h-60 w-full" />
        </div>
        <div className="mt-4 px-5 pb-5 text-slate-900 dark:text-slate-100">
          <div className="flex items-center w-full justify-between min-w-0 ">
            <Skeleton className="h-8 w-full" />
          </div>

          <div className="flex py-4 text-sm justify-between">
            <Skeleton className="h-7 w-full" />
          </div>

          <div className="mt-2 mb-5 flex items-center justify-between">
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex justify-between py-4 capitalize">
            <Skeleton className="h-8 w-2/4" />
            <Skeleton className="h-8 w-1/4" />
          </div>
        </div>
      </div>
    </>
  );
}
