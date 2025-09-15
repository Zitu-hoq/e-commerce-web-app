import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function VoucherSkeleton() {
  return (
    <div className="w-full max-w-2xl max-h-40 mx-auto p-6">
      <div className="relative">
        <Skeleton />

        {/* Main Coupon */}
        <Card className="overflow-hidden bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-800">
          <CardContent className="p-0">
            <div className="flex">
              {/* Left Side - Discount Amount */}
              <div className="w-64 bg-transparent p-8 flex flex-col items-center justify-center relative">
                <div className="text-center">
                  <Skeleton className="h-8 w-8 ml-2 mb-2" />
                  <Skeleton className="h-8 w-8 ml-2 mb-2" />
                  <Skeleton className="h-4 w-8 ml-2" />
                  <Skeleton className="h-4 w-16 mt-2" />
                </div>

                {/* Decorative circles */}
                <Skeleton className="absolute -right-4 top-8 w-8 h-8 rounded-full" />

                <Skeleton className="absolute -right-4 bottom-8 w-8 h-8 rounded-full" />
              </div>

              {/* Right Side - Coupon Details */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="w-20 h-6 font-bold mx-3 my-1" />
                </div>

                <div className="space-y-2 mb-2">
                  <Skeleton className="w-40 h-4" />
                  <Skeleton className="w-60 h-4" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <Skeleton className="w-16 h-4 mb-1" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <Skeleton className="w-16 h-4 mb-1" />
                      <Skeleton className="w-20 h-4" />
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Coupon Code Section */}
                <div className="rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-800">
                  <Skeleton className="w-full h-20" />
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <Skeleton className="w-48 h-4 mb-1" />
                    <Skeleton className="w-48 h-4" />
                  </div>
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
            </div>
          </CardContent>

          {/* Perforated edges */}
          <div className="absolute left-64 top-0 bottom-0 flex flex-col justify-center">
            <div className="flex flex-col space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-4 h-4 rounded-full transform -translate-x-2"
                ></Skeleton>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
