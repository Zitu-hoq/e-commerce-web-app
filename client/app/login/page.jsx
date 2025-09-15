"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Login, registerUser } from "@/lib/auth";
import { FacebookIcon, GoogleIcon, InstaIcon } from "@/public/Icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

// Validation schema using Zod
const schema = z
  .object({
    name: z.string().min(1, "Name is required").optional().or(z.literal("")),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional()
      .or(z.literal("")),
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(8, "Password should be at least 8 characters"),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // If confirmPassword is provided but does not match password
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }

    // If password is provided but confirmPassword is missing, make it required
    if (data.name && !data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Confirm Password is required",
      });
    }
  });

export default function AuthForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [newUser, setNewUser] = useState(false);
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (user) => {
    setloading(true);
    try {
      if (newUser) {
        const res = await registerUser(user);
        window.location.href = "/login";
      }
      const res = await dispatch(Login(user));
      console.log(res.message);
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Error stubbmitting form on server");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar isLoggedIn={isLoggedIn} />
      <div className="mx-auto my-4 md:mt-8 w-full md:w-1/3 md:border md:border-green-500 md:rounded-lg md:shadow-xl p-8">
        <div>
          <h1 className="text-2xl text-center md:text-start font-semibold">
            {newUser ? "Sign Up" : "Login"}
          </h1>

          <form
            className="mt-6 text-foreground"
            onSubmit={handleSubmit(onSubmit)}
          >
            {newUser && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", { required: newUser })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 mb-4 outline-none focus:border-green-500 transition-colors duration-300 bg-background"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}

                <input
                  type="tel"
                  placeholder="Phone Number"
                  {...register("phone", { required: newUser })}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 mb-4 outline-none focus:border-green-500 transition-colors duration-300 bg-background"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </>
            )}

            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 mb-4 outline-none focus:border-green-500 transition-colors duration-300 bg-background"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 mb-6 outline-none focus:border-green-500 transition-colors duration-300 bg-background"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            {newUser && (
              <>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-neutral-200 mb-6 outline-none focus:border-green-500 transition-colors duration-300 bg-background"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transform hover:scale-[1.02] transition-all duration-300"
            >
              {newUser ? "Sign Up" : "Login"}
              {loading ? "..." : ""}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-neutral-200" />
              <span className="px-4 text-neutral-500">or continue with</span>
              <div className="flex-1 border-t border-neutral-200" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center p-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                <GoogleIcon size="75" />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center p-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                <FacebookIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex items-center justify-center p-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                <InstaIcon />
              </Button>
            </div>

            <p className="text-center mt-6 text-neutral-500">
              {newUser
                ? "Already have an account? "
                : "Don't have an account? "}
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewUser(!newUser)}
                className="relative py-2 px-4 rounded-lg shadow-sm transition-all duration-300 dark:text-white hover:shadow-md hover:scale-105 hover:-translate-y-0.5 active:scale-95"
              >
                <span className="font-medium">
                  {newUser ? "Login" : "Sign Up"}
                </span>
              </Button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
