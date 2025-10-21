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
  const {
    products = [],
    loading,
    error,
    fetched,
    lastFetched,
  } = useSelector((state) => state.products || {});
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    console.log("use effct triggerd");
    const now = Date.now();
    const refreshAfter = 5 * 60 * 1000;
    const refreshAt = lastFetched && now - lastFetched > refreshAfter;
    if (!fetched || products.length === 0 || refreshAt) {
      dispatch(fetchProducts());
    }
  }, [dispatch, fetched, products.length, lastFetched]);

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
          {products ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <h1>No products found</h1>
          )}
        </div>
      </main>
    </div>
  );
}
