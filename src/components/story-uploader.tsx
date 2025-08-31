
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/lib/storage";
import { addStory } from "@/lib/stories";
import type { Offer } from "@/contexts/OffersContext";

const formSchema = z.object({
  media: z.custom<FileList>().refine(files => files?.length > 0, "A story file is required."),
});

interface StoryUploaderProps {
  offer: Offer;
  onFinished: () => void;
}

export function StoryUploader({ offer, onFinished }: StoryUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("media", e.target.files as FileList);
      setPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const file = values.media[0];

    try {
      const mediaUrl = await uploadFile(file, 'stories');
      await addStory({
        offerId: offer.id,
        businessName: offer.business,
        businessImage: offer.image,
        mediaUrl: mediaUrl,
        mediaType: file.type.startsWith("video") ? "video" : "image",
      });
      toast({ title: "Story Uploaded!", description: `Your story for "${offer.title}" is now live for 24 hours.` });
      onFinished();
    } catch (error) {
      console.error("Failed to upload story:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload the story. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="media"
          render={() => (
            <FormItem>
              <FormLabel>Story Media (Image or Video)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*,video/mp4,video/quicktime"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </FormControl>
              <FormDescription>
                Recommended: 9:16 vertical format (1080x1920px), MP4, under 5 minutes & 10MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {preview && (
          <div className="w-full aspect-video rounded-lg overflow-hidden border bg-muted">
            {form.getValues("media")?.[0]?.type.startsWith("video") ? (
              <video src={preview} controls className="w-full h-full object-cover" />
            ) : (
              <Image src={preview} alt="Story preview" width={400} height={225} className="w-full h-full object-cover" />
            )}
          </div>
        )}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
          ) : (
            <><UploadCloud className="mr-2 h-4 w-4" /> Upload Story</>
          )}
        </Button>
      </form>
    </Form>
  );
}
