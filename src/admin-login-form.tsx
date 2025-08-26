
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { auth } from "@/lib/firebase";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type AdminLoginData = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const { signInWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginData) => {
    setIsLoading(true);
    try {
      // 1. Sign in the user.
      await signInWithEmail(data.email, data.password);
      
      // 2. Force a refresh of the token to get the latest custom claims.
      // This is the key step to ensure the admin claim is available immediately.
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
      }
      
      // We don't need to set loading to false, as the parent page will re-render
      // based on the updated auth state from the context.
    } catch (error) {
      // The signInWithEmail function in the context already shows a toast on failure.
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@example.com" {...field} />
              </FormControl>
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
                </>
            ) : (
                <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
                </>
            )}
        </Button>
      </form>
    </Form>
  );
}
