
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/lib/storage";
import { useStories, type Story } from "@/contexts/StoriesContext";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { locations } from "@/lib/locations";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import Link from "next/link";

const formSchema = z.object({
  location: z.string({ required_error: "Please select a location." }),
  businessName: z.string({ required_error: "Please select a business." }),
  storyText: z.string().min(1, "Please enter some text for the story."),
  image: z.custom<FileList>().refine((files) => files?.length > 0, "An image is required."),
});

export function StoryGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { addStory, deleteStory, stories } = useStories();
  const { offers } = useOffers();

  const [businessesInLocation, setBusinessesInLocation] = useState<string[]>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { location: "", businessName: "", storyText: "" },
  });

  const selectedLocation = form.watch("location");
  
  useEffect(() => {
    if (selectedLocation) {
        const offersInLoc = offers.filter(offer => offer.location === selectedLocation);
        const uniqueBusinesses = [...new Set(offersInLoc.map(offer => offer.business))];
        setBusinessesInLocation(uniqueBusinesses);
        form.resetField("businessName");
        form.resetField("storyText");
    } else {
        setBusinessesInLocation([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation, offers]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', e.target.files as FileList);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const businessOffers = offers
      .filter(o => o.business === values.businessName && o.location === values.location)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (businessOffers.length === 0) {
        toast({ variant: "destructive", title: "Post Failed", description: "No offers found for this business to link to." });
        setIsLoading(false);
        return;
    }
    
    const latestOfferId = businessOffers[0].id;

    try {
      const imageUrl = await uploadFile(values.image[0], 'stories');
      await addStory({
        offerId: latestOfferId,
        businessName: values.businessName,
        location: values.location,
        storyText: values.storyText,
        imageUrl,
      });

      toast({ title: "Story Posted!", description: "The new story has been added successfully." });
      form.reset();
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to post story:", error);
      toast({ variant: "destructive", title: "Post Failed", description: "Could not post the story." });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (story: Story) => {
    if (confirm(`Are you sure you want to delete the story for "${story.businessName}"?`)) {
      try {
        await deleteStory(story.id);
        toast({ title: "Story Deleted", description: "The story has been removed." });
      } catch (error) {
        console.error("Failed to delete story:", error);
        toast({ variant: "destructive", title: "Delete Failed", description: "Could not delete the story." });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Post a New Story</CardTitle>
                <CardDescription>Upload an image and link it to a business.</CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Story Image</FormLabel>
                                <FormControl>
                                <Input type="file" accept="image/*" onChange={handleImageChange} />
                                </FormControl>
                                {imagePreview && (
                                <div className="mt-4 relative w-32 h-48 rounded-lg overflow-hidden mx-auto">
                                    <Image src={imagePreview} alt="Image preview" fill className="object-cover" />
                                </div>
                                )}
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
                                                <SelectValue placeholder="Step 1: Select a location" />
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
                            name="businessName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedLocation || businessesInLocation.length === 0}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={!selectedLocation ? "First select a location" : "Step 2: Select a business"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {businessesInLocation.length > 0 ? (
                                            businessesInLocation.map(business => (
                                                <SelectItem key={business} value={business}>{business}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="no-business" disabled>No businesses found</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="storyText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Story Text</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Today's Special" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting Story</>) : (<><PlusCircle className="mr-2 h-4 w-4" /> Post Story</>)}
                        </Button>
                    </form>
                </Form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Manage Current Stories</CardTitle>
                    <CardDescription>Review and delete active stories.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                    {stories.length === 0 && <p className="text-muted-foreground text-center">No stories posted yet.</p>}
                    {stories.map(story => (
                        <div key={story.id} className="flex items-center gap-4 p-2 rounded-md border">
                            <Image src={story.imageUrl} alt={story.businessName} width={40} height={60} className="rounded-md object-cover" />
                            <div className="flex-grow">
                                <p className="font-semibold">{story.businessName}</p>
                                <p className="text-xs text-muted-foreground">{story.location}</p>
                                <p className="text-xs text-foreground italic">"{story.storyText}"</p>
                                <Link href={`/offer/${story.offerId}`} className="text-xs text-muted-foreground truncate hover:underline block w-full">
                                  Links to offer ID: ...{story.offerId.slice(-6)}
                                </Link>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(story)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete story</span>
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    