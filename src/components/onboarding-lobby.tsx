
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { addOnboardedUser, getOnboardedUsers, renewOnboardedUser, deleteOnboardedUser, updatePaymentStatus, type OnboardedUser, type OnboardedUserData, PaymentStatus } from '@/lib/onboarding';
import { Loader2, UserPlus, Trash2, RefreshCcw, Bell, CheckCircle2, AlertTriangle, XCircle, CircleDollarSign, CalendarIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  paymentAmount: z.preprocess(
    (a) => (a === '' ? undefined : a),
    z.coerce.number({ invalid_type_error: "Amount must be a number" }).positive('Amount must be positive.')
  ),
  notes: z.string().optional(),
  startDate: z.date({ required_error: "A start date is required." }),
  endDate: z.date({ required_error: "An end date is required." }),
});

export function OnboardingLobby() {
  const [users, setUsers] = useState<OnboardedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<OnboardedUser | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      businessName: '',
      phoneNumber: '',
      paymentAmount: undefined,
      notes: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    },
  });

  const fetchUsers = async () => {
    setLoading(true);
    const fetchedUsers = await getOnboardedUsers();
    setUsers(fetchedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const userData: OnboardedUserData = {
          name: values.name,
          businessName: values.businessName,
          phoneNumber: values.phoneNumber,
          paymentAmount: values.paymentAmount,
          notes: values.notes,
          onboardedDate: values.startDate,
          paymentDueDate: values.endDate,
          paymentStatus: 'Due'
      }

      await addOnboardedUser(userData);
      toast({ title: 'User Onboarded', description: `${values.name} has been added to the lobby.` });
      form.reset();
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to onboard user:', error);
      toast({ variant: 'destructive', title: 'Onboarding Failed', description: 'Could not add the user. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRenew = async (userId: string) => {
    try {
      await renewOnboardedUser(userId);
      toast({ title: 'User Renewed', description: `The user's 30-day period has been reset.` });
      await fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Failed to renew user:', error);
      toast({ variant: 'destructive', title: 'Renewal Failed', description: 'Could not renew the user. Please try again.' });
    }
  };
  
  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
        await deleteOnboardedUser(userToDelete.id);
        toast({ title: 'User Deleted', description: `${userToDelete.name} has been removed from the lobby.` });
        await fetchUsers();
    } catch (error) {
        console.error('Failed to delete user:', error);
        toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not delete user. Please try again.' });
    } finally {
        setUserToDelete(null);
    }
  }

  const handleTogglePaymentStatus = async (user: OnboardedUser) => {
    const newStatus: PaymentStatus = user.paymentStatus === 'Paid' ? 'Due' : 'Paid';
    try {
      await updatePaymentStatus(user.id, newStatus);
      toast({ title: 'Payment Status Updated', description: `${user.name}'s status is now ${newStatus}.`});
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast({ variant: 'destructive', title: 'Update Failed', description: 'Could not update payment status.' });
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => new Date(a.paymentDueDate).getTime() - new Date(b.paymentDueDate).getTime());
  }, [users]);

  const getStatus = (dueDate: Date): { text: string; variant: "default" | "secondary" | "destructive"; icon: React.ReactNode; daysLeft: number } => {
    const now = new Date();
    const daysLeft = differenceInDays(dueDate, now);

    if (daysLeft < 0) {
      return { text: "Expired", variant: "destructive", icon: <XCircle className="mr-2 h-4 w-4" />, daysLeft };
    }
    if (daysLeft <= 7) {
      return { text: "Expires Soon", variant: "secondary", icon: <Bell className="mr-2 h-4 w-4" />, daysLeft };
    }
    return { text: "Active", variant: "default", icon: <CheckCircle2 className="mr-2 h-4 w-4" />, daysLeft };
  };

  return (
    <div className="space-y-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Client Onboarding</h2>
            <p className="mt-4 text-muted-foreground">Add new business clients and track their 30-day payment cycle.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Onboard New Client</CardTitle>
            <CardDescription>Fill in the details to add a new client to the lobby.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Client Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="businessName" render={({ field }) => (<FormItem><FormLabel>Business Name</FormLabel><FormControl><Input placeholder="e.g., John's Hardware" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+91 98765 43210" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="paymentAmount" render={({ field }) => (<FormItem><FormLabel>Payment Amount (₹)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500" {...field} value={field.value ?? ''} onChange={field.onChange} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel>
                            <Popover><PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel>
                            <Popover><PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Any relevant notes about the client..." {...field} /></FormControl><FormMessage /></FormItem>)} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Onboard Client
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Onboarding Lobby</h2>
            <p className="mt-4 text-muted-foreground">View all onboarded clients and their payment status.</p>
        </div>

        <Card>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Onboarded Date</TableHead>
                            <TableHead>Payment Due Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : sortedUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No clients have been onboarded yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedUsers.map(user => {
                                const status = getStatus(user.paymentDueDate);
                                const isPaid = user.paymentStatus === 'Paid';
                                return (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-sm text-muted-foreground">{user.businessName}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div>{format(user.onboardedDate, 'PPP')}</div>
                                    </TableCell>
                                    <TableCell>
                                         <div>{format(user.paymentDueDate, 'PPP')}</div>
                                         <div className="text-sm text-muted-foreground">
                                             {status.daysLeft >= 0 ? `${status.daysLeft} days left` : `Expired ${Math.abs(status.daysLeft)} days ago`}
                                         </div>
                                    </TableCell>
                                    <TableCell>
                                        {user.paymentAmount ? `₹${user.paymentAmount.toLocaleString()}` : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={isPaid ? "default" : "destructive"} className="flex items-center w-fit">
                                          {isPaid ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                                          {user.paymentStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                         <Button size="sm" variant="outline" onClick={() => handleTogglePaymentStatus(user)}>
                                            <CircleDollarSign className="mr-2 h-4 w-4" /> Mark as {isPaid ? 'Due' : 'Paid'}
                                         </Button>
                                         <Button size="sm" variant="outline" onClick={() => handleRenew(user.id)}>
                                            <RefreshCcw className="mr-2 h-4 w-4" /> Renew
                                         </Button>
                                         <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive" onClick={() => setUserToDelete(user)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the record for {userToDelete?.name}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                         </AlertDialog>
                                    </TableCell>
                                </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                 </Table>
               </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
