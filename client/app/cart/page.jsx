"use client";

import Navbar from "@/components/Navbar";
import img from "@/components/placeholder.jpg";
import RelatedProduct from "@/components/RelatedProduct";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  fetchCart,
  removeFromCart,
  updateCart,
} from "@/lib/features/cart/cartSlice";
import { couponAPI } from "@/lib/paymentAPI";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function CartPage() {
  const [selectedItems, setSelectedItems] = useState({});
  const [edit, setEdit] = useState(false);
  const [editSelected, setEditSelected] = useState("");
  const [coupon, setCoupon] = useState("");
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const { items, loading, error, updated } = useSelector((state) => state.cart);
  const [cartItems, setCartItems] = useState(items || []);

  // Redirect to login if not logged in
  if (!isLoggedIn || !user) {
    return router.push("/login");
  }

  // Update cart if not already updated
  useEffect(() => {
    // Only fetch if not already loaded (optional optimization)
    if (!updated) {
      dispatch(fetchCart());
    }
    setCartItems(items);
  }, [dispatch, updated]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading cart</p>;

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleEdit = (id) => {
    if (!edit) {
      setEditSelected(id);
    } else {
      setEditSelected("");
      setCartItems(items);
    }
    setEdit(!edit);
  };

  const handleUpdate = () => {
    cartItems.forEach((item) => {
      if (item.product._id === editSelected) {
        dispatch(updateCart(item));
      }
    });
    setEdit(false);
    setEditSelected("");
  };

  const updateQuantity = (id, change) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const updateSize = (id, size) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === id ? { ...item, size: size } : item
      )
    );
  };

  const updateColor = (id, color) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === id ? { ...item, color: color } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.product._id !== id));
    setSelectedItems((prev) => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
    dispatch(removeFromCart(id));
  };

  const calculateSubtotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      if (selectedItems[item._id]) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateShippingFee = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      if (selectedItems[item._id]) {
        if (item.product.shipFrom === "China") {
          return total + 200;
        }
        return total + 60;
      }
      return total;
    }, 0);
  };
  const applyCoupon = (subtotal, voucher) => {
    if (!voucher || subtotal < voucher.minPurchase) return subtotal;

    if (voucher.discountType === "fixed") {
      return Math.max(0, subtotal - voucher.discountValue);
    }

    if (voucher.discountType === "percentage") {
      const rawDiscount = (subtotal * voucher.discountValue) / 100;
      const cappedDiscount = voucher.maxDiscount
        ? Math.min(rawDiscount, voucher.maxDiscount)
        : rawDiscount;

      return Math.max(0, subtotal - cappedDiscount);
    }

    return subtotal;
  };

  const subtotal = calculateSubtotal();
  const totalAfterCoupon = applyCoupon(subtotal, coupon);
  const shippingFee = calculateShippingFee();
  const total = totalAfterCoupon + shippingFee;
  const isCheckoutDisabled =
    subtotal === 0 || Object.values(selectedItems).every((v) => !v);

  const handleCheckOut = async () => {
    const selectedProducts = Object.keys(selectedItems).filter(
      (key) => selectedItems[key]
    );
    const matchedItems = cartItems.filter((item) =>
      selectedProducts.includes(item._id)
    );
    sessionStorage.setItem("prevRoute", "cart");
    sessionStorage.setItem("selectedProducts", JSON.stringify(matchedItems));
    sessionStorage.setItem("voucher", JSON.stringify(coupon));
    router.push("/payment");
  };

  const handleCoupon = async () => {
    const specialCharsRegex = /[[\]{}()*+?.,\\^$|#\s%]/;
    if (specialCharsRegex.test(coupon)) return toast.error("Invalid Cupon!!");
    const checkedCoupon = await couponAPI(coupon);
    setCoupon(checkedCoupon);
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      {items.length === 0 && (
        <h1 className="text-center h-[25%] text-2xl font-bold my-8">
          Cart is Empty.
        </h1>
      )}
      {items.length > 0 && (
        <div className="container mx-auto p-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Your Shopping Cart
          </h1>

          <div className="md:flex md:space-x-8">
            <div className="md:w-2/3 space-y-4">
              {cartItems.map((item) => (
                <Card
                  key={item.product._id}
                  className="overflow-hidden relative"
                  style={{ opacity: item.product.stock > 0 ? 1 : 0.8 }}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-4">
                      <Checkbox
                        checked={selectedItems[item._id] || false}
                        onCheckedChange={() => toggleItemSelection(item._id)}
                        className="mr-4"
                        disabled={item.product.stock > 0 ? false : true}
                      />
                      <img
                        src={item.product.primaryPicture || img}
                        alt={item.product.name}
                        width={120}
                        height={120}
                        className="rounded-md mr-6"
                      />
                      <div className="flex-grow md:flex md:justify-between md:items-center">
                        <div>
                          <h2 className="font-semibold text-lg mb-2 capitalize">
                            {item.product.name}
                          </h2>
                          <div className="text-sm text-gray-600 mb-1 capitalize">
                            <p
                              className={
                                edit && item.product._id === editSelected
                                  ? ""
                                  : "hidden"
                              }
                            >
                              <Popover>
                                <PopoverTrigger className="cursor-pointer">
                                  <Button variant="outline">
                                    Change color
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-row flex-wrap gap-2 w-auto">
                                  {item.product.colors.map((color) => (
                                    <Button
                                      key={color}
                                      variant={
                                        item.color === color ? "primary" : ""
                                      }
                                      className="capitalize"
                                      onClick={() =>
                                        updateColor(item.product._id, color)
                                      }
                                    >
                                      {color}
                                    </Button>
                                  ))}
                                </PopoverContent>
                              </Popover>
                              <Popover>
                                <PopoverTrigger className="cursor-pointer">
                                  <Button variant="outline" className="ml-2">
                                    Change Size
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-row flex-wrap gap-2 w-auto">
                                  {item.product.size.map((size) => (
                                    <Button
                                      key={size}
                                      variant={
                                        item.size === size ? "primary" : ""
                                      }
                                      className="uppercase"
                                      onClick={() =>
                                        updateSize(item.product._id, size)
                                      }
                                    >
                                      {size}
                                    </Button>
                                  ))}
                                </PopoverContent>
                              </Popover>
                            </p>
                            <p
                              className={
                                edit && item.product._id === editSelected
                                  ? "hidden"
                                  : ""
                              }
                            >
                              Color: {item.color} | Size:
                              <span className="uppercase">{item.size}</span>
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Estimated Delivery: {item.product.estDelivaryTime}{" "}
                            to {item.product.estDelivaryTime + 3} days
                          </p>

                          <p
                            className={`text-sm font-medium ${
                              item.product.stock > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.product.stock > 0
                              ? "In Stock"
                              : "Out Of Stock"}
                          </p>
                          <p className="flex">
                            <Button
                              className={
                                edit && item.product._id === editSelected
                                  ? "m-4"
                                  : "hidden"
                              }
                              onClick={handleUpdate}
                            >
                              update
                            </Button>
                            <Button
                              variant="destructive"
                              className="m-4"
                              onClick={() => handleEdit(item.product._id)}
                            >
                              {edit && item.product._id === editSelected
                                ? "Cancel"
                                : "Edit"}
                            </Button>
                          </p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end md:space-x-4 md:flex-col">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.product._id, -1)
                              }
                              disabled={
                                item.product.stock > 0 && item.quantity > 1
                                  ? false
                                  : true
                              }
                              className={
                                edit && item.product._id === editSelected
                                  ? ""
                                  : "hidden"
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span
                              className={
                                edit && item.product._id === editSelected
                                  ? "hidden"
                                  : ""
                              }
                            >
                              Quantity:{" "}
                            </span>
                            <span className="font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.product._id, 1)
                              }
                              disabled={item.product.stock > 0 ? false : true}
                              className={
                                edit && item.product._id === editSelected
                                  ? ""
                                  : "hidden"
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="font-semibold text-lg md:pt-2">
                            Tk {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="md:ml-4 md:static absolute top-2 right-2"
                        onClick={() => removeItem(item.product._id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="md:w-1/3 space-y-4 mt-8 md:mt-0">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Apply Coupon</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={coupon.code || coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <Button
                      onClick={handleCoupon}
                      disabled={isCheckoutDisabled}
                    >
                      Apply
                    </Button>
                  </div>
                  {coupon && (
                    <div className="text-sm font-semibold mt-2">
                      Min Purchase: TK {coupon.minPurchase}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>{shippingFee.toFixed(2)}</span>
                    </div>
                    {coupon && (
                      <div className="flex justify-between">
                        <span>Coupon(MAX {coupon.maxDiscount} TK OFF)</span>
                        <span className="text-green-500">
                          - {coupon.discountValue}
                          {coupon.discountType === "percentage" ? "%" : "TK"}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">
                          Tk {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6"
                    size="lg"
                    disabled={isCheckoutDisabled}
                    onClick={handleCheckOut}
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      <Separator className="my-4" />
      <h1 className="text-2xl font-bold my-8 text-center">Related Products</h1>
      <RelatedProduct />
    </div>
  );
}
