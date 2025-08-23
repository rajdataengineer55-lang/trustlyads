
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAdCopy } from '@/ai/flows/generate-ad-flow';
import { Separator } from './ui/separator';

const adCopySchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  offerDetails: z.string().min(10, "Offer details must be at least 10 characters."),
  targetAudience: z.string().min(2, "Target audience is required."),
});

export function AdCopyGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof adCopySchema>>({
    resolver: zodResolver(adCopySchema),
    defaultValues: {
      businessName: "",
      offerDetails: "",
      targetAudience: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof adCopySchema>) => {
    setIsLoading(true);
    setGeneratedCopy([]);
    try {
      const result = await generateAdCopy(values);
      setGeneratedCopy(result.variations);
    } catch (error) {
      console.error("Failed to generate ad copy:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate ad copy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section id="ad-generator" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold">AI-Powered Ad Copy Generator</h2>
                <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                    Struggling with words? Describe your offer and let our AI create compelling ad copy for you.
                </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                <Card>
                    <CardHeader>
                        <CardTitle>Enter Offer Details</CardTitle>
                        <CardDescription>Provide the details for your ad below.</CardDescription>
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
                                    <Input placeholder="e.g., Priya's Boutique" {...field} />
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
                                    <Textarea placeholder="e.g., Flat 50% off on all summer dresses for our weekend sale." {...field} />
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
                                <FormLabel>Target Audience</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., college students, young women" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                            ) : (
                                <><Wand2 className="mr-2 h-4 w-4" /> Generate Ad Copy</>
                            )}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
                <div className="space-y-4">
                    <h3 className="text-xl font-headline font-bold">Generated Variations</h3>
                    {isLoading && (
                        <div className="space-y-4">
                            <Card className="p-4 animate-pulse"><div className="h-16 bg-muted rounded"></div></Card>
                            <Card className="p-4 animate-pulse"><div className="h-16 bg-muted rounded"></div></Card>
                            <Card className="p-4 animate-pulse"><div className="h-16 bg-muted rounded"></div></Card>
                        </div>
                    )}
                    {generatedCopy.length > 0 && (
                         <div className="space-y-4">
                            {generatedCopy.map((copy, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4 flex items-center justify-between gap-4">
                                        <p className="text-sm text-muted-foreground flex-1">{copy}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleCopy(copy, index)}
                                        >
                                            {copiedIndex === index ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    {!isLoading && generatedCopy.length === 0 && (
                        <div className="text-center text-muted-foreground border-2 border-dashed rounded-lg p-12">
                            <Wand2 className="mx-auto h-12 w-12 mb-4" />
                            <p>Your generated ad copy variations will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
  );
}
