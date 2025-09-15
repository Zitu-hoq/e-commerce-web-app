"use client";

import CategorySection from "@/components/CategorySection";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/productCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getAllCategories, searchProductAPI } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Explore() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { products, loading, error, fetched } = useSelector(
    (state) => state.products
  );
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 2;
  const calculateTotalPages = () => {
    let totalPage = Math.ceil(allProducts.length / productsPerPage);
    if (totalPage === 0) return 1;
    else return totalPage;
  };
  const [initialFilter, setInitialFilter] = useState(products);
  const [totalPages, setTotalPages] = useState(calculateTotalPages());

  const initialProducts = allProducts.slice(0, productsPerPage);
  const [currentProducts, setCurrentProducts] = useState(initialProducts);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllCategories();
      setCategories(res);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentProducts(allProducts.slice(0, productsPerPage));
    setCurrentPage(1);
    setTotalPages(calculateTotalPages());
  }, [allProducts]);

  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    setCurrentProducts(
      allProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    );
  }, [currentPage]);

  const handleCategory = (category) => {
    if (category === "all") {
      setAllProducts(products);
    } else {
      setAllProducts(
        products.filter((item) => item.categories.includes(category))
      );
      console.log(allProducts);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleSearch = async () => {
    if (query.length < 3) {
      if (query.length === 0) {
        setAllProducts(products);
        setInitialFilter(products);
        setSearching(false);
      } else toast.message("Search Query is too Short!");
      return;
    } else {
      setSearching(true);
      const searchedProducts = await searchProductAPI(query);
      setAllProducts(searchedProducts);
      setInitialFilter(searchedProducts);
    }
  };

  const handleFiltering = (value) => {
    let shortedProducts;
    if (value === 1) {
      shortedProducts = [...allProducts].sort((a, b) => b.rating - a.rating);
    } else if (value === 2)
      shortedProducts = [...allProducts].sort((a, b) => a.price - b.price);
    else if (value === 3)
      shortedProducts = [...allProducts].sort((a, b) => b.price - a.price);
    else shortedProducts = initialFilter;
    setAllProducts(shortedProducts);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">
            Explore Products
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products"
                className="pl-4 pr-4 py-2 dark:bg-gray-800 dark:text-white"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                className="absolute border-y-0 border-l-1 border-r-0 border-gray-500 right-0 top-1/2 transform -translate-y-1/2 bg-transparent rounded-l-none"
                variant="outline"
                onClick={handleSearch}
              >
                <Search className="text-gray-400" size={20} />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <SlidersHorizontal className="mr-2" size={20} />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleFiltering(1)}>
                  Rating
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Sort By Price</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => handleFiltering(2)}>
                        Ascending
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFiltering(3)}>
                        Descending
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={() => handleFiltering(0)}>
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {!searching && (
          <CategorySection
            categories={categories}
            handleCategory={handleCategory}
          />
        )}
        {searching && <h2 className="text-lg">Search Results:</h2>}
        <div className="flex">
          {currentProducts.length === 0 && (
            <h1 className="text-2xl m-auto">No Products Found!</h1>
          )}
          {currentProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <span className="dark:text-white">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
