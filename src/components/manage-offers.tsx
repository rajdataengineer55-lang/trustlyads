
"use client";

import { useState } from "react";
import Image from "next/image";
import { useOffers, type Offer } from "@/contexts/OffersContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Pencil, Trash2, Megaphone, Eye, EyeOff, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdGenerator } from "./ad-generator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

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
      toast({ title: "Offer Deleted", description: `"${selectedOffer.title}" has been removed.` });
      setSelectedOffer(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleBoostClick = (offer: Offer) => {
    boostOffer(offer.id);
    toast({ title: "Offer Boosted!", description: `"${offer.title}" has been moved to the top of the list for this session.` });
  };

  const handleEditClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsEditDialogOpen(true);
  }
  
  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
    setSelectedOffer(null);
  }

  const handleToggleVisibility = async (offer: Offer) => {
    await toggleOfferVisibility(offer.id);
    toast({ title: `Offer ${offer.isHidden ? 'Made Visible' : 'Hidden'}`, description: `"${offer.title}" is now ${offer.isHidden ? 'visible' : 'hidden from public view'}.` });
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center mb-12"> <Skeleton className="h-10 w-1/2 mx-auto" /> <Skeleton className="h-6 w-3/4 mx-auto mt-4" /> </div>
        <Card><CardContent className="p-4"><Skeleton className="h-80 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-headline font-bold">Manage Your Offers</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto"> Edit, delete, and manage all current offers. Use the actions menu to manage stories and visibility.</p>
      </div>

       <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px] pl-6">Offer</TableHead>
                        <TableHead>Business</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead className="text-right pr-6">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {offers.map((offer) => (
                        <TableRow key={offer.id}>
                            <TableCell className="pl-6">
                                <div className="flex items-center gap-4">
                                    <Image src={offer.image || 'https://placehold.co/64x48.png'} alt={offer.title} width={64} height={48} className="rounded-md object-cover" data-ai-hint={offer.hint} />
                                    <span className="font-medium truncate">{offer.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="truncate">{offer.business}</TableCell>
                            <TableCell>
                                <Badge variant={offer.isHidden ? "secondary" : "default"}>
                                    {offer.isHidden ? ( <><EyeOff className="mr-1.5 h-3 w-3" /> Hidden</> ) : ( <><Eye className="mr-1.5 h-3 w-3" /> Visible</> )}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2"> <Eye className="h-4 w-4 text-muted-foreground" /> <span>{offer.views || 0}</span> </div>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Total times the offer page has been viewed.</p></TooltipContent>
                                </Tooltip>
                            </TableCell>
                            <TableCell>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-2"> <BarChart2 className="h-4 w-4 text-muted-foreground" /> <span>{offer.clicks || 0}</span> </div>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Total clicks on contact buttons (Call, Chat, etc.).</p></TooltipContent>
                                </Tooltip>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Manage Offer</span></Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => handleBoostClick(offer)}><Megaphone className="mr-2 h-4 w-4" /> Boost</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleToggleVisibility(offer)}>{offer.isHidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}{offer.isHidden ? 'Make Visible' : 'Hide'}</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleEditClick(offer)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => handleDeleteClick(offer)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => !isOpen && handleDialogClose()}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit Offer</DialogTitle></DialogHeader>{selectedOffer && <AdGenerator offerToEdit={selectedOffer} onFinished={handleDialogClose} />}</DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. This will permanently delete the offer "{selectedOffer?.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
