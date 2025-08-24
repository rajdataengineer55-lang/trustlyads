
"use client";

import { useState } from "react";
import Image from "next/image";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
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
import { MoreHorizontal, Pencil, Trash2, Megaphone, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdGenerator } from "./ad-generator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "./ui/badge";


export function ManageOffers() {
  const { offers, deleteOffer, boostOffer, toggleOfferVisibility, loading } = useOffers();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleDeleteClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedOffer) {
      await deleteOffer(selectedOffer.id);
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
        description: `"${offer.title}" has been moved to the top of the list for this session.`,
    });
  };

  const handleEditClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsEditDialogOpen(true);
  }
  
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedOffer(null);
  }

  const handleToggleVisibility = async (offer: Offer) => {
    await toggleOfferVisibility(offer.id);
    toast({
        title: `Offer ${offer.isHidden ? 'Made Visible' : 'Hidden'}`,
        description: `"${offer.title}" is now ${offer.isHidden ? 'visible' : 'hidden from public view'}.`,
    });
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold">Manage Your Offers</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Here you can edit, delete, and boost your current offers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className={cn("flex flex-col transition-all duration-300", offer.isHidden && "bg-muted/50")}>
            <CardHeader className="p-0">
                <div className="relative aspect-[4/3]">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint={offer.hint}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                      <Badge variant={offer.isHidden ? "secondary" : "default"} className="absolute top-2 left-2">
                      {offer.isHidden ? (
                          <><EyeOff className="mr-1.5 h-3 w-3" /> Hidden</>
                      ) : (
                            <><Eye className="mr-1.5 h-3 w-3" /> Visible</>
                      )}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
                <p className="text-sm text-muted-foreground">{offer.category}</p>
                <p className="font-semibold text-lg leading-tight mt-1">{offer.title}</p>
                <p className="text-sm text-muted-foreground">{offer.business}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                          <MoreHorizontal className="mr-2 h-4 w-4" /> Manage
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleBoostClick(offer)}>
                        <Megaphone className="mr-2 h-4 w-4" />
                        Boost
                      </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleVisibility(offer)}>
                          {offer.isHidden ? (
                              <><Eye className="mr-2 h-4 w-4" /> Make Visible</>
                          ) : (
                              <><EyeOff className="mr-2 h-4 w-4" /> Hide</>
                          )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleEditClick(offer)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(offer)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => !isOpen && handleEditDialogClose()}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Edit Offer</DialogTitle>
            </DialogHeader>
              {selectedOffer && <AdGenerator 
              offerToEdit={selectedOffer} 
              onFinished={handleEditDialogClose} 
            />}
        </DialogContent>
      </Dialog>
      
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
