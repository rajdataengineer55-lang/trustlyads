
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { locations } from "@/lib/locations";
import { categories } from "@/lib/categories";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { addRequest } from "@/lib/requests";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  location: z.string({ required_error: "Please select a location." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});

export default function NewRequestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Signed In",
        description: "You must be signed in to post a request.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await addRequest({
        ...values,
        userId: user.uid,
        status: "open",
      });
      toast({
        title: "Request Posted!",
        description: "Businesses will now be able to see your request.",
      });
      router.push("/requests");
    } catch (error) {
      console.error("Failed to post request:", error);
      toast({
        variant: "destructive",
        title: "Post Failed",
        description: "Could not post your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (authLoading) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (!user) {
    // Or a more dedicated component
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
            <main className="flex-1 flex items-center justify-center bg-background/50">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Sign In Required</CardTitle>
                        <CardDescription>Please sign in to post a new request.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => router.push("/")}>Go to Homepage</Button>
                    </CardContent>
                </Card>
            </main>
        <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-background/50 py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Post a New Request</CardTitle>
              <CardDescription>Let local businesses know what you're looking for. Fill out the details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Need 2kg fresh mangoes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a relevant category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.name} value={cat.name}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {locations.map((location) =>
                              location.subLocations ? (
                                <SelectGroup key={location.name}>
                                  <SelectLabel>{location.name}</SelectLabel>
                                  {location.subLocations.map((sub) => (
                                    <SelectItem key={`${location.name}-${sub}`} value={sub}>
                                      {sub}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ) : (
                                <SelectItem key={location.name} value={location.name}>
                                  {location.name}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Please deliver fresh, ripe mangoes near RTC cross. Budget is around 150/kg." {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Post Request
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
