import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Banner } from "@/types";
import { Edit } from "lucide-react";
import EditBanner from "./EditBanner";

export function EditPage(data: Banner) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-3/4 md:!w-1/3 !max-w-none">
        <SheetHeader>
          <SheetTitle>Edit Banner</SheetTitle>
        </SheetHeader>
        <EditBanner {...data} />
      </SheetContent>
    </Sheet>
  );
}
