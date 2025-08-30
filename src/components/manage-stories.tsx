
"use client";

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getActiveStories, deleteStory, type Story } from '@/lib/stories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Clapperboard, Video, Image as ImageIcon, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

export function ManageStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { toast } = useToast();

  const fetchStories = async () => {
    setLoading(true);
    const activeStories = await getActiveStories();
    setStories(activeStories);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDeleteClick = (story: Story) => {
    setSelectedStory(story);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedStory) {
      try {
        await deleteStory(selectedStory.id, selectedStory.mediaUrl);
        toast({ title: 'Story Deleted', description: `The story for "${selectedStory.businessName}" has been removed.` });
        // Refetch stories to update the list
        await fetchStories();
      } catch (error) {
        console.error('Failed to delete story:', error);
        toast({ variant: 'destructive', title: 'Delete Failed', description: 'Could not delete the story. Please try again.' });
      } finally {
        setSelectedStory(null);
        setIsDeleteDialogOpen(false);
      }
    }
  };

  const storiesByBusiness = useMemo(() => {
    return stories.reduce((acc, story) => {
      if (!acc[story.offerId]) {
        acc[story.offerId] = {
          businessName: story.businessName,
          businessImage: story.businessImage,
          stories: [],
        };
      }
      acc[story.offerId].stories.push(story);
      return acc;
    }, {} as Record<string, { businessName: string; businessImage: string; stories: Story[] }>);
  }, [stories]);

  if (loading) {
    return (
       <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
        </div>
        <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Manage Active Stories</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          View all currently active stories. Stories are automatically removed after 24 hours. You can manually delete them here.
        </p>
      </div>

      {Object.keys(storiesByBusiness).length === 0 ? (
         <Card className="text-center py-12">
          <CardHeader>
            <Clapperboard className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>No Active Stories</CardTitle>
            <CardDescription>There are no stories currently live on the site.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(storiesByBusiness).map(([offerId, data]) => (
            <Card key={offerId}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Image src={data.businessImage || 'https://placehold.co/40x40.png'} alt={data.businessName} width={40} height={40} className="rounded-full object-cover bg-muted" />
                <div>
                    <CardTitle>{data.businessName}</CardTitle>
                    <CardDescription>{data.stories.length} active stor{data.stories.length > 1 ? 'ies' : 'y'}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {data.stories.map(story => (
                        <div key={story.id} className="relative group aspect-[9/16] rounded-lg overflow-hidden border">
                            {story.mediaType === 'image' ? (
                                <Image src={story.mediaUrl} alt="Story content" fill className="object-cover" />
                            ) : (
                                <video src={story.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-2 text-white">
                                <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-md text-xs self-start">
                                   {story.mediaType === 'image' ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                                   <span>{story.mediaType}</span>
                                </div>
                                <div className="text-xs">
                                    <p>Posted {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}</p>
                                    <div className="flex items-center gap-1">
                                      <Eye className="h-3 w-3" />
                                      <span>{story.views || 0} views</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="destructive" size="icon" onClick={() => handleDeleteClick(story)}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the story from "{selectedStory?.businessName}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
