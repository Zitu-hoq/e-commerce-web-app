import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OrderSheetProps } from "@/types";
import { MoreHorizontal } from "lucide-react";
import EditForm from "./EditOrder";

// EditSheetComponent.jsx
const EditSheetComponent = ({ data }: OrderSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger>
        <MoreHorizontal className="h-4 w-4" />
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-3/4 md:!w-1/3 !max-w-none">
        <SheetHeader>
          <SheetTitle>Edit Order</SheetTitle>
        </SheetHeader>
        <EditForm data={data} />
      </SheetContent>
    </Sheet>
  );
};

export default EditSheetComponent;
