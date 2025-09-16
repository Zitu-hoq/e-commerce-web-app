import { Admin } from "@/models/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { API } from "@/api/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "./theme/mode-toggle";

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof Admin>>({
    resolver: zodResolver(Admin),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof Admin>) {
    try {
      setIsSubmitting(true);
      const res = await API.post("/api/auth/admin", values);
      const message = res.data.message;
      toast.success(message);
      navigate({ to: "/products" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Form submission error", error);
      toast.error(
        error.response?.data?.message || "Error!! Details in Console"
      );
      navigate({ to: "/" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="flex w-full justify-between items-center">
            <CardTitle className="text-2xl">Login</CardTitle>
            <ModeToggle />
          </div>
          <CardDescription className="w-full mt-2">
            Welcome to the ZAP warehouse!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
