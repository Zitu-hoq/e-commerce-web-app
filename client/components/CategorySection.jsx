import { Button } from "@/components/ui/button";
import { useState } from "react";

const CategorySection = ({ categories, handleCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Button
            key={category._id}
            variant={
              selectedCategory === category.category ? "secondary" : "outline"
            }
            className="w-full dark:text-gray-300 capitalize dark:hover:text-white"
            onClick={() => {
              setSelectedCategory(category.category);
              handleCategory(category.category);
            }}
          >
            {category.category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
