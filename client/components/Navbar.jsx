"use client";

import { Button } from "@/components/ui/button";
import { Moon, ShoppingCart, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = ({ isLoggedIn }) => {
  const pathname = usePathname();
  const [theme, setTheme] = useState("light");
  const avater = process.env.NEXT_PUBLIC_AVATER;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="text-2xl font-bold dark:text-white">ZAP</div>
      <div className="flex items-center space-x-4">
        <NavLink href="/" active={pathname === "/"}>
          Home
        </NavLink>
        <NavLink href="/explore" active={pathname === "/explore"}>
          Explore
        </NavLink>
        {isLoggedIn ? (
          <>
            <NavLink href="/profile" active={pathname === "/profile"}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={avater} alt="User profile" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
            </NavLink>
            <NavLink href="/cart" active={pathname === "/cart"}>
              <ShoppingCart size={24} />
            </NavLink>
          </>
        ) : (
          <NavLink href="/login" active={pathname === "/login"}>
            Login
          </NavLink>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </div>
    </nav>
  );
};

const NavLink = ({ href, active, children }) => {
  return (
    <Link
      href={href}
      className={`${
        active
          ? "text-blue-600 font-semibold"
          : "text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
      } transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
