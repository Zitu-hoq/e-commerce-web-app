import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { CustomTrigger } from "./components/sidebar/customTrigger";
import { Toaster } from "./components/ui/sonner";
import { AppProps } from "./types";

export default function Layout({ children, pageName }: AppProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });

  // Function to handle the button click
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };
  return (
    <SidebarProvider open={isOpen} onOpenChange={setIsOpen}>
      <AppSidebar />
      <main className="flex w-full flex-col min-h-screen bg-background">
        <CustomTrigger handleToggle={handleToggle} pageName={pageName} />
        <div className="flex-1 m-4">{children}</div>
        <Toaster richColors expand={true} position="top-right" />
      </main>
    </SidebarProvider>
  );
}
