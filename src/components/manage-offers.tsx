
"use client";

import { useState } from "react";
import Image from "next/image";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Zap, Share2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdGenerator } from "./ad-generator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import * as htmlToImage from 'html-to-image';


export function ManageOffers() {
  const { offers, deleteOffer, boostOffer } = useOffers();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isSharing, setIsSharing] = useState<string | null>(null);

  const handleDeleteClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOffer) {
      deleteOffer(selectedOffer.id);
      toast({
        title: "Offer Deleted",
        description: `"${selectedOffer.title}" has been removed.`,
      });
      setSelectedOffer(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleBoostClick = (offer: Offer) => {
    boostOffer(offer.id);
    toast({
        title: "Offer Boosted!",
        description: `"${offer.title}" has been moved to the top.`,
    });
  };

  const handleEditClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsEditDialogOpen(true);
  }
  
  const handleShareClick = async (offer: Offer) => {
    setIsSharing(offer.id);
    const offerPageUrl = `${window.location.origin}/offer/${offer.id}`;
    const shareData = {
        title: offer.title,
        text: `${offer.business} is offering: ${offer.discount}!`,
        url: offerPageUrl,
    };

    // Fallback function for browsers that can't share files
    const shareLinkFallback = async () => {
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(offerPageUrl);
                toast({
                    title: "Link Copied!",
                    description: "The offer link has been copied to your clipboard.",
                });
            }
        } catch (err: any) {
             if (err.name !== 'AbortError') {
                console.error("Error sharing link:", err);
                toast({
                    variant: "destructive",
                    title: "Sharing Failed",
                    description: "Could not share or copy the link.",
                });
            }
        }
    };


    try {
      const shareUrl = `${window.location.origin}/share/${offer.id}`;
      const iframe = document.createElement('iframe');
      iframe.src = shareUrl;
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '400px'; 
      iframe.style.height = '300px';

      document.body.appendChild(iframe);

      iframe.onload = async () => {
        try {
          const node = iframe.contentDocument?.getElementById('share-card');
          if (!node) {
            throw new Error("Shareable card element not found");
          }

          const dataUrl = await htmlToImage.toPng(node, { 
            cacheBust: true,
            pixelRatio: 2,
            width: 380,
            height: 285,
            fetchRequestInit: {
                mode: 'cors',
                cache: 'no-cache'
            }
          });

          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], `${offer.id}.png`, { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
             await navigator.share({
                files: [file],
                ...shareData
              });
          } else {
            // If file sharing is not supported, fall back to sharing the link.
            await shareLinkFallback();
          }
        } catch (err: any) {
            // Ignore abort errors, which happen when the user cancels the share dialog
            if (err.name === 'AbortError') {
              return;
            }
            toast({
                variant: "destructive",
                title: "Sharing Failed",
                description: "There was an error generating the share image. Trying to share a link instead.",
            });
            // Attempt to share link if image generation/sharing fails
            await shareLinkFallback();
        } finally {
            document.body.removeChild(iframe);
            setIsSharing(null);
        }
      };
      
      iframe.onerror = async () => {
        document.body.removeChild(iframe);
        throw new Error("Failed to load share iframe.");
      }
    
    } catch(err: any) {
        toast({
            variant: "destructive",
            title: "Sharing Failed",
            description: "Could not initialize sharing process. Sharing link instead.",
        });
        await shareLinkFallback();
        setIsSharing(null);
    }
  };


  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold">Manage Your Offers</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Here you can edit, delete, and boost your current offers.
        </p>
      </div>

      <div className="w-full bg-white dark:bg-card rounded-lg shadow-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Discount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      width={64}
                      height={48}
                      className="rounded-md object-cover hidden sm:block"
                      data-ai-hint={offer.hint}
                    />
                    <div>
                      <p className="font-medium whitespace-nowrap">{offer.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{offer.business}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{offer.category}</TableCell>
                <TableCell className="hidden sm:table-cell">{offer.discount}</TableCell>
                <TableCell className="text-right">
                  <Dialog open={isEditDialogOpen && selectedOffer?.id === offer.id} onOpenChange={(isOpen) => {
                      if (!isOpen) setSelectedOffer(null);
                      setIsEditDialogOpen(isOpen);
                  }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isSharing === offer.id}>
                        {isSharing === offer.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <MoreHorizontal className="h-5 w-5" />}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleShareClick(offer)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBoostClick(offer)}>
                        <Zap className="mr-2 h-4 w-4" />
                        Boost
                      </DropdownMenuItem>
                      <DialogTrigger asChild>
                          <DropdownMenuItem onClick={() => handleEditClick(offer)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                          </DropdownMenuItem>
                      </DialogTrigger>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(offer)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                          <DialogTitle>Edit Offer</DialogTitle>
                      </DialogHeader>
                      <AdGenerator 
                        offerToEdit={selectedOffer!} 
                        onFinished={() => {
                          setIsEditDialogOpen(false);
                          setSelectedOffer(null);
                        }} 
                      />
                  </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer
              "{selectedOffer?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
