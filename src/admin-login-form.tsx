
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
    // The signInWithEmail function in the AuthContext now handles forcing a token refresh.
    // This form just needs to call it and the context will handle the rest.
    await signInWithEmail(data.email, data.password);
    
    // We don't need to set loading to false immediately, because the page will
    // navigate or re-render based on the updated auth state from the context.
    // However, if the sign-in fails, the context will show a toast, and we should
    // re-enable the button.
    setIsLoading(false);
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
