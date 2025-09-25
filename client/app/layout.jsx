import ClientLayout from "@/components/ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ZAP E-commerce",
  description: "Your one-stop shop for all your needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white`}
      >
        <ClientLayout>{children}</ClientLayout>
        <Toaster expand={true} richColors position="top-center" />
      </body>
    </html>
  );
}
