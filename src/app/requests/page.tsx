
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getAllRequests, getRequestsByUser, type Request, type RequestResponse, addResponseToRequest, updateRequestStatus } from "@/lib/requests";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Calendar, ArrowRight, User, MessageSquare, Phone, CheckCircle, Send, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOffers } from "@/contexts/OffersContext";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const responseSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters."),
  contactNumber: z.string().min(10, "Please provide a valid contact number."),
});

const RequestCard = ({ request, isAdmin, onRespondClick, onAcceptResponse }: { request: Request, isAdmin: boolean, onRespondClick: (request: Request) => void, onAcceptResponse: (requestId: string, responseId: string) => void }) => {
    const isOwner = useAuth().user?.uid === request.userId;
    const canRespond = isAdmin && request.status === 'open';

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{request.title}</CardTitle>
                        <CardDescription>Posted {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</CardDescription>
                    </div>
                    <Badge variant={request.status === 'open' ? 'default' : (request.status === 'closed' ? 'secondary' : 'outline')}>
                        {request.status}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">{request.description}</p>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-2" /> {request.location}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" /> {request.category}
                </div>
                {request.responses && request.responses.length > 0 && (
                     <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold mb-2">{request.responses.length} Response{request.responses.length > 1 ? 's' : ''}</h4>
                        <div className="space-y-3">
                        {request.responses.map(response => (
                            <div key={response.id} className="p-3 bg-muted/50 rounded-lg">
                               <p className="text-sm font-semibold">{response.message}</p>
                               <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-3 w-3" />
                                        <span>{response.contactNumber} ({response.businessName})</span>
                                    </div>
                                    {isOwner && request.status !== 'closed' && (
                                        <Button size="sm" variant="outline" onClick={() => onAcceptResponse(request.id, response.id)}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Accept
                                        </Button>
                                    )}
                               </div>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
            </CardContent>
            {canRespond && (
                <CardFooter>
                    <Button className="w-full" onClick={() => onRespondClick(request)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Offer
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

const ResponseForm = ({ request, onFinished }: { request: Request, onFinished: () => void }) => {
    const { user } = useAuth();
    const { offers } = useOffers();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof responseSchema>>({
        resolver: zodResolver(responseSchema),
        defaultValues: { message: "", contactNumber: "" },
    });
    
    // Find an offer by the admin to pre-fill business info
    const adminOffer = offers.find(o => o.business); // Just finds first offer for business name
    const businessName = adminOffer?.business || "Admin Business";

    async function onSubmit(values: z.infer<typeof responseSchema>) {
        if (!user || !request) return;
        setIsLoading(true);
        try {
            await addResponseToRequest(request.id, {
                businessId: user.uid,
                businessName: businessName,
                message: values.message,
                contactNumber: values.contactNumber,
            });
            await updateRequestStatus(request.id, 'responded');
            toast({ title: "Response Sent!", description: "The customer has been notified of your offer." });
            onFinished();
        } catch (error) {
            console.error("Failed to send response:", error);
            toast({ variant: "destructive", title: "Failed", description: "Could not send response." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Your Message / Offer</FormLabel><FormControl><Textarea placeholder="e.g., We have mangoes available at ₹120/kg. Contact us for delivery." {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name="contactNumber" render={({ field }) => (<FormItem><FormLabel>Contact Number</FormLabel><FormControl><Input placeholder="Your business phone number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit Response
                </Button>
            </form>
        </Form>
    );
};


export default function RequestsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const [allRequests, setAllRequests] = useState<Request[]>([]);
    const [myRequests, setMyRequests] = useState<Request[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
    const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
    const { toast } = useToast();

    const fetchAllData = async () => {
        if (!user) return;
        setLoadingRequests(true);
        const all = isAdmin ? await getAllRequests() : [];
        const my = await getRequestsByUser(user.uid);
        setAllRequests(all);
        setMyRequests(my);
        setLoadingRequests(false);
    }
    
    useEffect(() => {
        if (!authLoading) {
            fetchAllData();
        }
    }, [user, authLoading, isAdmin]);

    const handleRespondClick = (request: Request) => {
        setSelectedRequest(request);
        setIsRespondModalOpen(true);
    };
    
    const handleResponseFinished = () => {
        setIsRespondModalOpen(false);
        setSelectedRequest(null);
        fetchAllData(); // Refresh data
    }
    
    const handleAcceptResponse = async (requestId: string, responseId: string) => {
        try {
            await updateRequestStatus(requestId, 'closed');
            toast({ title: "Offer Accepted!", description: "You have closed this request." });
            fetchAllData(); // Refresh data
        } catch (error) {
            console.error("Failed to accept response:", error);
            toast({ variant: "destructive", title: "Failed", description: "Could not update the request status." });
        }
    }

    if (authLoading || loadingRequests) {
        return (
             <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background/50 py-12">
                    <div className="container mx-auto px-4 md:px-6">
                        <Skeleton className="h-10 w-1/3 mb-8" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <Skeleton className="h-48 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }
    
    const renderRequestList = (requests: Request[], title: string, emptyMessage: string) => {
        if (requests.length === 0) {
            return (
                 <Card className="text-center py-12">
                    <CardHeader>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{emptyMessage}</CardDescription>
                    </CardHeader>
                    {title === 'My Posted Requests' && (
                        <CardContent>
                             <Link href="/requests/new">
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Post Your First Request
                                </Button>
                            </Link>
                        </CardContent>
                    )}
                </Card>
            )
        }
        return (
            <div className="space-y-6">
                {requests.map(req => (
                   <RequestCard key={req.id} request={req} isAdmin={isAdmin} onRespondClick={handleRespondClick} onAcceptResponse={handleAcceptResponse}/>
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background/50 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <Tabs defaultValue={isAdmin ? "all-requests" : "my-requests"}>
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                            <TabsTrigger value="all-requests" disabled={!isAdmin}>Customer Requests</TabsTrigger>
                        </TabsList>
                        <TabsContent value="my-requests">
                            {renderRequestList(myRequests, "My Posted Requests", "You haven't posted any requests yet.")}
                        </TabsContent>
                         <TabsContent value="all-requests">
                             {isAdmin ? renderRequestList(allRequests, "All Customer Requests", "There are no open customer requests right now.") : null}
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
             <Footer />
             <Dialog open={isRespondModalOpen} onOpenChange={setIsRespondModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Respond to "{selectedRequest?.title}"</DialogTitle>
                        <DialogDescription>Send your offer or message to the customer.</DialogDescription>
                    </DialogHeader>
                    {selectedRequest && <ResponseForm request={selectedRequest} onFinished={handleResponseFinished} />}
                </DialogContent>
            </Dialog>
        </div>
    )
}
