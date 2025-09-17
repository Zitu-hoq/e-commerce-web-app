import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API } from "./api/server";
import { WaveformLoader } from "./components/Loader";
import { CustomTrigger } from "./components/sidebar/customTrigger";
import { Toaster } from "./components/ui/sonner";
import { AppProps } from "./types";

export default function Layout({ children, pageName }: AppProps) {
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState<boolean | null>(() => {
    const cached = sessionStorage.getItem("loggedIn");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(loggedIn === null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/api/auth/me");
        setLoggedIn(res.data.success);
        sessionStorage.setItem("loggedIn", JSON.stringify(res.data.success));
      } catch {
        setLoggedIn(false);
        sessionStorage.setItem("loggedIn", "false");
      } finally {
        setLoading(false);
      }
    };

    if (loggedIn === null) fetchUser();
    else setLoading(false);
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn === false && !loading) {
      toast.error("You must log in");
      navigate({ to: "/" });
    }
  }, [loggedIn, loading, navigate]);

  if (loading) return <WaveformLoader size="lg" barCount={7} />;

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
