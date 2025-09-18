"use client";

import BannerCarousel from "@/components/BannerCarousel";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/productCard";
import { getBanners } from "@/lib/api";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { products, loading, error, fetched } = useSelector(
    (state) => state.products
  );
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Only fetch if not already loaded (optional optimization)
    if (!fetched) {
      dispatch(fetchProducts());
    }
  }, [dispatch, fetched]);

  useEffect(() => {
    const callBannerApi = async () => {
      const res = await getBanners();
      setBanners(res);
    };
    callBannerApi();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8" style={{ height: "60vh" }}>
          {banners && <BannerCarousel banners={banners} />}
        </div>
        <div className="flex">
          {products &&
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </main>
    </div>
  );
}
