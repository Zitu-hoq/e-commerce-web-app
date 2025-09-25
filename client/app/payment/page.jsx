"use client";

import AddressCard from "@/components/AddressCard";
import { PaymentOption } from "@/components/PaymentOption";
import ProductSummary from "@/components/ProductSummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { couponAPI, paylaterAPI, placeOrderAPI } from "@/lib/paymentAPI";
import { Edit, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function PaymentPage() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [orderId, setOrderId] = useState("");
  const [productNames, setProductNames] = useState([]);
  const router = useRouter();

  const defaultAddress = user.addresses.find((address) => address.isDefault);

  if (!defaultAddress) {
    toast.error("Please add an default address First!!!");
    router.push("/profile/address");
  }

  const [products, setProducts] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [prevRoute, setRoute] = useState("");
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [popUp, setPopUP] = useState(false);

  const applyCoupon = (calSubtotal, voucher) => {
    if (!voucher || calSubtotal < voucher.minPurchase) return calSubtotal;

    if (voucher.discountType === "fixed") {
      return Math.max(0, calSubtotal - voucher.discountValue);
    }

    if (voucher.discountType === "percentage") {
      const rawDiscount = (calSubtotal * voucher.discountValue) / 100;
      const cappedDiscount = voucher.maxDiscount
        ? Math.min(rawDiscount, voucher.maxDiscount)
        : rawDiscount;

      return Math.max(0, calSubtotal - cappedDiscount);
    }

    return calSubtotal;
  };

  useEffect(() => {
    try {
      const storedProducts = sessionStorage.getItem("selectedProducts");
      const voucher = sessionStorage.getItem("voucher");
      const reqRoute = sessionStorage.getItem("prevRoute");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        setRoute(reqRoute);
        if (voucher) {
          const parsedCoupon = JSON.parse(voucher);
          setCoupon(parsedCoupon);
        }
      } else {
        toast.error("No product found in localStorage");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error parsing product from localStorage:", err);
      window.location.href = "/";
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let calSubtotal = 0;
    let calShipping = 0;
    products.map((item) => {
      calSubtotal += item.product.price * item.quantity;
      calShipping += item.product.shipFrom === "Bangladesh" ? 60 : 200;
    });
    setShipping(calShipping);
    let totalAfterCoupon = applyCoupon(calSubtotal, coupon);
    setTotal(totalAfterCoupon + calShipping);
    setSubtotal(calSubtotal);
  }, [products, coupon]);

  const handleCoupon = async () => {
    const specialCharsRegex = /[[\]{}()*+?.,\\^$|#\s%]/;
    if (specialCharsRegex.test(coupon)) return toast.error("Invalid Cupon!!");
    const checkedCoupon = await couponAPI(coupon);
    setCoupon(checkedCoupon);
  };

  const handleOrder = async () => {
    const updatedProducts = products.map((item) => ({
      ...item,
      product: item.product._id,
    }));
    const order = {
      shippingAddressId: defaultAddress._id,
      products: updatedProducts,
      voucherCode: coupon.code || "",
      totalAmount: total,
    };

    const data = await placeOrderAPI(order, prevRoute);
    if (data.orderId) {
      setOrderId(data.orderId);
      setProductNames(data.productNames);
      setPopUP(true);
    }
  };
  const handleCancel = async () => {
    await paylaterAPI(orderId, productNames);
    setPopUP(false);
    sessionStorage.setItem("reload", "true");
    router.push("/profile/messages");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Checkout</h1>
          <p className="text-gray-500 mt-2">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-inherit dark:shadow-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl">Delivery Address</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent"
                  onClick={() =>
                    toast.success(
                      "To change delivary address, please go to your addressbook and choose a default address!"
                    )
                  }
                >
                  <Edit className="h-4 w-4" />
                  Edit Address Book
                </Button>
              </CardHeader>

              <AddressCard address={defaultAddress} payment={true} />
            </Card>
            {/* Product Details Section */}
            {products.length &&
              products.map((item, index) => (
                <ProductSummary
                  key={item.product._id}
                  item={item}
                  index={index}
                />
              ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 bg-inherite dark:shadow-gray-800">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="font-medium">Tk {subtotal}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Shipping
                    </span>
                    <span className="font-medium">Tk {shipping}</span>
                  </div>
                </div>
                {coupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Coupon(max {coupon.maxDiscount} TK OFF)
                    </span>
                    <span className="font-medium text-green-500">
                      - {coupon.discountValue}
                      {coupon.discountType === "percentage" ? "%" : "TK"}
                    </span>
                  </div>
                )}

                <Separator />

                {/* Coupon Section */}
                <div className="space-y-3">
                  <Label htmlFor="coupon" className="text-sm font-medium">
                    Promo Code
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter coupon code"
                      className="flex-1"
                      value={coupon.code || coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={handleCoupon}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Apply
                    </Button>
                  </div>
                  {coupon && (
                    <div className="text-xs font-light mt-2">
                      Min Purchase: TK {coupon.minPurchase}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      BDT {total}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Including all taxes and fees
                  </p>
                </div>

                <Separator />

                {/* Payment Button */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 text-lg font-semibold"
                    onClick={handleOrder}
                  >
                    Place Order
                  </Button>
                  {popUp && (
                    <PaymentOption
                      handleCancel={handleCancel}
                      orderId={orderId}
                    />
                  )}

                  <p className="text-xs text-center text-gray-500">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy
                  </p>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Secure SSL Encrypted Payment
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
