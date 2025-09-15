import { Button } from "@/components/ui/button";

import { CustomTriggerProps } from "@/types";
import { PanelLeftClose } from "lucide-react";
import { ModeToggle } from "../theme/mode-toggle";
import { Separator } from "../ui/separator";
import { useSidebar } from "../ui/sidebar";

export function CustomTrigger({ handleToggle, pageName }: CustomTriggerProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="w-full">
      <div className="flex pt-4 py-8 justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => {
            toggleSidebar();
            handleToggle();
          }}
        >
          <PanelLeftClose />
          <span className="hidden md:inline">Toggle Sidebar</span>
        </Button>
        <h1 className="text-center text-4xl flex-grow font-bold">{pageName}</h1>
        <div className="pr-4">
          <ModeToggle />
        </div>
      </div>
      <Separator />
    </div>
  );
}
