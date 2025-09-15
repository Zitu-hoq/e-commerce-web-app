"use client";

import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  LogOut,
  MapPin,
  MessageSquare,
  RotateCcw,
  ShoppingBag,
  Star,
  Ticket,
  User,
  XCircle,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const navigation = [
  { name: "Messages", href: "/profile/messages", icon: MessageSquare },
  { name: "My Orders", href: "/profile/orders", icon: ShoppingBag },
  { name: "My Returns", href: "/profile/returns", icon: RotateCcw },
  { name: "My Cancellations", href: "/profile/cancellations", icon: XCircle },
  { name: "Vouchers", href: "/profile/vouchers", icon: Ticket },
  { name: "My Reviews", href: "/profile/reviews", icon: Star },
  { name: "Address Book", href: "/profile/address", icon: MapPin },
  { name: "Account Information", href: "/profile/account", icon: User },
  { name: "Logout", href: "/profile/logout", icon: LogOut },
];

function MobileBackButton({ title, onClick }) {
  return (
    <Button variant="ghost" className="mb-4 p-0" onClick={onClick}>
      <ChevronLeft className="h-4 w-4 mr-2" />
      {title}
    </Button>
  );
}

export default function ProfileLayout({ children }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [showChildren, setShowChildren] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(true);
  const [activePageTitle, setActivePageTitle] = useState("");

  useEffect(() => {
    const activeNavItem = navigation.find((item) => item.href === pathname);
    if (activeNavItem) {
      setActivePageTitle(activeNavItem.name);
      setIsMobileNavOpen(false);
      setShowChildren(true);
    } else {
      setIsMobileNavOpen(true);
    }
  }, [pathname]);

  if (!user) window.location.href = "/";

  const handleBackClick = () => {
    setIsMobileNavOpen(true);
    setShowChildren(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Navigation */}
          <div className="md:hidden">
            {isMobileNavOpen ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold">My Account</h1>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800"
                  >
                    Verified Account
                  </Badge>
                </div>
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <div key={item.href}>
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-accent ${
                            isActive ? "text-green-600 font-medium" : ""
                          }`}
                        >
                          <Icon className="h-7 w-7" />
                          <span className="text-lg">{item.name}</span>
                        </Link>
                        <Separator />
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <MobileBackButton
                title={activePageTitle}
                onClick={handleBackClick}
              />
            )}
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden md:flex flex-col w-64 shrink-0">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Hello, {user.name}</h2>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Verified Account
              </Badge>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-accent ${
                      isActive ? "text-green-600 font-medium" : ""
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{showChildren && children}</div>
        </div>
      </div>
    </div>
  );
}
