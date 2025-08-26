
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clapperboard } from "lucide-react";
import Image from "next/image";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { uploadFile } from "@/lib/storage";

const formSchema = z.object({
  media: z.custom<FileList>().refine((files) => files?.length > 0, "A story image or video is required."),
});

interface AddStoryFormProps {
  offer: Offer;
  onFinished: () => void;
}

export function AddStoryForm({ offer, onFinished }: AddStoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');

  const { toast } = useToast();
  const { addStory } = useOffers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
         toast({
            variant: "destructive",
            title: "File too large",
            description: "Please upload a file smaller than 10MB.",
        });
        return;
      }
      setPreview(URL.createObjectURL(file));
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
      form.setValue('media', e.target.files as FileList);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const file = values.media[0];
      const mediaUrl = await uploadFile(file, 'stories');
      
      await addStory(offer.id, { mediaUrl, mediaType });
      
      toast({
        title: "Story Added!",
        description: "Your story has been posted and will be live for 24 hours.",
      });
      onFinished();
    } catch (error) {
       console.error("Failed to add story:", error);
       toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "Could not upload the story. Please try again.",
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Story Media</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    accept="image/*,video/mp4" 
                    onChange={handleFileChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {preview && mediaType === 'image' && (
          <div className="mt-4">
            <Image src={preview} alt="Story preview" width={400} height={711} className="rounded-md mx-auto aspect-[9/16] object-cover" />
          </div>
        )}
        {preview && mediaType === 'video' && (
            <div className="mt-4">
                <video src={preview} controls className="rounded-md mx-auto aspect-[9/16] object-cover" />
            </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Clapperboard className="mr-2 h-4 w-4" />
              Post Story
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
