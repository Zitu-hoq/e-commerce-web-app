import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Voucher } from "@/types";
import { format } from "date-fns";
import { Calendar, Copy, Percent, Tag } from "lucide-react";
import { EditVoucher } from "./EditVoucher";

export default function VoucherCard({ ...voucher }: Voucher) {
  const percentage = voucher.discountType === "percentage";
  const date = new Date(voucher.expiryDate);
  return (
    <div className="w-full max-w-2xl max-h-40 mx-auto p-6">
      <div className="relative">
        {/* Edit Button */}

        <EditVoucher {...voucher} />

        {/* Main Coupon */}
        <Card className="overflow-hidden bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-2 border-dashed border-orange-200">
          <CardContent className="p-0">
            <div className="flex">
              {/* Left Side - Discount Amount */}
              <div className="w-64 bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 flex flex-col items-center justify-center relative">
                <div className="text-center">
                  {percentage ? (
                    <Percent className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  ) : (
                    <h3 className="text-4xl font-bold mb-2">BDT</h3>
                  )}
                  <div className="text-4xl font-bold mb-2">
                    {voucher.discountValue}
                  </div>
                  <div className="text-xl font-semibold">OFF</div>
                  {percentage && (
                    <div className="text-sm opacity-90 mt-2">
                      Up to TK {voucher.maxDiscount}
                    </div>
                  )}
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-4 top-8 w-8 h-8 bg-white rounded-full"></div>
                <div className="absolute -right-4 bottom-8 w-8 h-8 bg-white rounded-full"></div>
              </div>

              {/* Right Side - Coupon Details */}
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-red-100 text-red-700 font-bold px-3 py-1">
                    LIMITED TIME
                  </Badge>
                </div>

                <div className="space-y-1 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Get {voucher.discountValue}&nbsp;
                    {percentage ? "%" : "TAKA"} off on{" "}
                    <span>all products.</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Valid on all items. Minimum purchase of &nbsp;
                    <span className="text-green-500">
                      TK {voucher.minPurchase}
                    </span>
                    &nbsp; required.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-700">Valid Until</p>
                      <p className="text-gray-600 text-sm">
                        {format(date, "PPP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-semibold text-gray-700">Category</p>
                      <p className="text-gray-600 text-sm">All</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                {/* Coupon Code Section */}
                <div className="bg-white rounded-lg p-4 border-2 border-dashed border-orange-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Coupon Code
                      </p>
                      <p className="text-2xl font-bold font-mono text-orange-600">
                        {voucher.code}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent dark:text-black dark:hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </Button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <p>• Cannot be combined with other offers</p>
                    <p>• Valid for online purchases only</p>
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: #{voucher._id?.slice(-11)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Perforated edges */}
          <div className="absolute left-64 top-0 bottom-0 flex flex-col justify-center">
            <div className="flex flex-col space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-white rounded-full transform -translate-x-2"
                ></div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
