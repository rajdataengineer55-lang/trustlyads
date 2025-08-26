
"use client";

import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdGenerator } from "@/components/ad-generator";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { ManageOffers } from "@/components/manage-offers";
import { UserManagement } from "@/components/user-management"; // Import new component
import { Separator } from "@/components/ui/separator";
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type AdminLoginData = z.infer<typeof loginSchema>;

function AdminLoginForm() {
  const { signInWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AdminLoginData) => {
    setIsLoading(true);
    try {
      await signInWithEmail(data.email, data.password);
    } catch (error) {
      // Error is handled by the context's toast
    } finally {
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


export default function AdminPage() {
    const { user, loading, signOut } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        if (!loading && user) {
            user.getIdTokenResult().then(idTokenResult => {
                const isAdminUser = !!idTokenResult.claims.admin;
                setIsAdmin(isAdminUser);
            });
        } else if (!loading && !user) {
            setIsAdmin(false);
        }
    }, [user, loading]);

    // Show a loading skeleton if the auth state is still loading.
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                          <Skeleton className="h-10 w-1/2 mx-auto" />
                          <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                        </div>
                        <div className="max-w-3xl mx-auto">
                           <Skeleton className="h-[600px] w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    
    // After loading, if there's no user, show the login form.
    if (!user) {
         return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShieldAlert className="h-6 w-6" /> Admin Login
                            </CardTitle>
                            <CardDescription>
                                Please sign in to manage the website.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <AdminLoginForm />
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    // If a user is logged in but is not the admin, show the unauthorized message.
    if (!isAdmin) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 flex flex-col items-center justify-center text-center p-4">
                    <Card className="max-w-md w-full">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                <ShieldAlert className="h-6 w-6" /> Unauthorized Access
                            </CardTitle>
                            <CardDescription>
                                This account does not have admin privileges. Please contact the site owner if you believe this is an error.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-destructive">
                                Signed in as {user.email}.
                            </p>
                            <div className="flex justify-center items-center gap-4">
                                <Button variant="outline" onClick={signOut}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                                <Link href="/" passHref>
                                    <Button>
                                        Go to Homepage
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </main>
                <Footer />
            </div>
        )
    }

    // If all checks pass, render the admin dashboard.
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50">
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 md:px-6">
                        <AdGenerator />
                    </div>
                </section>
                <Separator className="my-8 sm:my-12" />
                <section className="pb-12 sm:pb-16">
                     <div className="container mx-auto px-4 md:px-6">
                        <ManageOffers />
                    </div>
                </section>
                <Separator className="my-8 sm:my-12" />
                <section className="pb-12 sm:pb-16">
                     <div className="container mx-auto px-4 md:px-6">
                        <UserManagement />
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
