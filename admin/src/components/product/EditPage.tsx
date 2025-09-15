import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Product } from "@/types";
import { Edit } from "lucide-react";
import EditProduct from "./EditProduct";

export function EditPage(data: Product) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Edit /> Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-3/4 md:!w-1/3 !max-w-none">
        <SheetHeader>
          <SheetTitle>Edit Product</SheetTitle>
        </SheetHeader>
        <EditProduct {...data} />
      </SheetContent>
    </Sheet>
  );
}
