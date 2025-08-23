
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
import { MoreHorizontal, Pencil, Trash2, Megaphone, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdGenerator } from "./ad-generator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";


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
        <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
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

      <div className="w-full bg-card rounded-lg shadow-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Offer</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer) => (
              <TableRow key={offer.id} className={cn(offer.isHidden && "opacity-50")}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Image
                      src={offer.image}
                      alt={offer.title}
                      width={64}
                      height={48}
                      className="rounded-md object-cover hidden sm:block"
                      style={{ width: "auto", height: "auto" }}
                      data-ai-hint={offer.hint}
                    />
                    <div>
                      <p className="font-medium whitespace-nowrap">{offer.title}</p>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">{offer.business}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{offer.category}</TableCell>
                <TableCell className="hidden sm:table-cell">
                    {offer.isHidden ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <EyeOff className="h-4 w-4" />
                            <span>Hidden</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600">
                            <Eye className="h-4 w-4" />
                            <span>Visible</span>
                        </div>
                    )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={isEditDialogOpen && selectedOffer?.id === offer.id} onOpenChange={(isOpen) => !isOpen && handleEditDialogClose()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBoostClick(offer)}>
                        <Megaphone className="mr-2 h-4 w-4" />
                        Boost
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleToggleVisibility(offer)}>
                          {offer.isHidden ? (
                              <><Eye className="mr-2 h-4 w-4" /> Unhide</>
                          ) : (
                              <><EyeOff className="mr-2 h-4 w-4" /> Hide</>
                          )}
                      </DropdownMenuItem>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => handleEditClick(offer)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
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
                  
                    <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                            <DialogTitle>Edit Offer</DialogTitle>
                        </DialogHeader>
                         {selectedOffer && <AdGenerator 
                          offerToEdit={selectedOffer} 
                          onFinished={handleEditDialogClose} 
                        />}
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
