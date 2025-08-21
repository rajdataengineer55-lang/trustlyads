"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleGenerateAdCopy } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }),
  offerDetails: z.string().min(10, { message: "Offer details must be at least 10 characters." }),
  targetAudience: z.string().optional(),
  tone: z.enum(['Casual', 'Professional', 'Humorous', 'Persuasive']),
});

export function AdGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [adVariations, setAdVariations] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      offerDetails: "",
      targetAudience: "",
      tone: "Casual",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAdVariations([]);
    try {
      const result = await handleGenerateAdCopy(values);
      if (result && result.adCopyVariations) {
        setAdVariations(result.adCopyVariations);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate ad copy. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Ad copy has been copied to your clipboard.",
    });
  };

  return (
    <section id="dashboard-preview" className="py-16 sm:py-24 bg-white dark:bg-gray-900/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold">Post Ads and Manage Offers Easily</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered tool helps you craft the perfect ad in seconds. Just enter your offer details and let our magic do the rest!
            </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Wand2 className="h-6 w-6 text-primary" />
                        <CardTitle className="font-headline">AI Ad Copy Generator</CardTitle>
                    </div>
                    <CardDescription>Fill out your offer details to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., The Cozy Cafe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="offerDetails"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Offer Details</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe your offer, e.g., 'Get 20% off all coffee and pastries from 8am to 11am on weekdays.'" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Target Audience (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Students, families, remote workers" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tone of Voice</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a tone" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Casual">Casual</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Humorous">Humorous</SelectItem>
                                <SelectItem value="Persuasive">Persuasive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                            </>
                        ) : (
                            <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Ad Copy
                            </>
                        )}
                        </Button>
                    </form>
                    </Form>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-2xl font-headline font-bold mb-4">Generated Suggestions</h3>
            <div className="space-y-4 min-h-[300px]">
              {isLoading && (
                Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                            <div className="h-4 bg-muted rounded w-1/3"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="h-4 bg-muted rounded w-full"></div>
                                <div className="h-4 bg-muted rounded w-5/6"></div>
                            </div>
                        </CardContent>
                    </Card>
                ))
              )}
              {!isLoading && adVariations.length > 0 && (
                adVariations.map((ad, index) => (
                  <Card key={index} className="bg-white group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-headline">Variation {index + 1}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(ad)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                      <p>{ad}</p>
                    </CardContent>
                  </Card>
                ))
              )}
              {!isLoading && adVariations.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                    <Image src="https://placehold.co/300x200.png" alt="AI illustration" width={300} height={200} data-ai-hint="abstract illustration" className="rounded-lg mb-4" />
                    <p className="text-muted-foreground">Your AI-generated ad copy will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
