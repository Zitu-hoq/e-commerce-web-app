"use client";
import Navbar from "@/components/Navbar";
import ProductDetails from "@/components/ProductDetails";
import RelatedProduct from "@/components/RelatedProduct";
import { Separator } from "@/components/ui/separator";
import { getProductById } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SingleProduct = () => {
  const { id } = useParams();
  getProductById(id);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  // Check if product is already in Redux store
  const productFromStore = useSelector((state) =>
    state.products.products.find((p) => p._id === id)
  );
  const [product, setProduct] = useState(productFromStore || null);
  const [loading, setLoading] = useState(!productFromStore);

  useEffect(() => {
    // 📡 Fetch only if product not found in Redux
    if (!productFromStore) {
      setLoading(true);
      getProductById(id)
        .then((res) => setProduct(res))
        .catch((err) => console.error("API Error:", err))
        .finally(() => setLoading(false));
    }
  }, [id, productFromStore]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="p-4">
        <h1 className="text-center text-2xl font-bold">Product Details</h1>
        <ProductDetails data={product} />
        <Separator className="my-8" />
        <h1 className="text-center text-2xl font-bold">Related Products</h1>
        <RelatedProduct />
      </div>
    </div>
  );
};

export default SingleProduct;
