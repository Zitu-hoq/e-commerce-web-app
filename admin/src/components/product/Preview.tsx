import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Product } from "@/types";
import { Eye } from "lucide-react";
import ProductDetails from "./ProductDetails";

export function Preview(data: Product) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Eye /> Preview
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-3/4 md:!w-1/2 !max-w-none">
        <SheetHeader>
          <SheetTitle className="text-center">Preview</SheetTitle>
        </SheetHeader>
        <ProductDetails {...data} />
      </SheetContent>
    </Sheet>
  );
}
