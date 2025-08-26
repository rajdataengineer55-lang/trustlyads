
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AppUser {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'user' | 'admin';
}

export function UserManagement() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { user: currentUser } = useAuth();

    useEffect(() => {
        const usersCollection = collection(db, 'users');
        const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({ ...doc.data() } as AppUser));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users:", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not fetch user list. You may not have permission to view this.',
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleRoleChange = async (user: AppUser, newRole: 'admin' | 'user') => {
        if (user.uid === currentUser?.uid) {
            toast({
                variant: 'destructive',
                title: 'Action Denied',
                description: "You cannot change your own role.",
            });
            return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        try {
            await updateDoc(userDocRef, { role: newRole });
            toast({
                title: 'Role Updated',
                description: `${user.email}'s role has been set to ${newRole}.`,
            });
        } catch (error) {
            console.error("Error updating role:", error);
            toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: 'Could not update user role. Please try again.',
            });
        }
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
        <div>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold">User Management</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Manage user roles and permissions for the application. Changes to roles will take effect after the user signs out and signs back in.</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="pl-6">User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right pr-6">Admin Access</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell className="pl-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar>
                                                    <AvatarImage src={user.photoURL} />
                                                    <AvatarFallback>{user.displayName?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium truncate">{user.displayName || 'No Name'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="truncate">{user.email}</TableCell>
                                        <TableCell>
                                            {user.role === 'admin' ? (
                                                <div className="flex items-center gap-2 text-primary">
                                                    <ShieldCheck className="h-4 w-4" />
                                                    <span>Admin</span>
                                                </div>
                                            ) : (
                                                 <div className="flex items-center gap-2 text-muted-foreground">
                                                    <UserIcon className="h-4 w-4" />
                                                    <span>User</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Label htmlFor={`role-switch-${user.uid}`} className="text-muted-foreground">
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </Label>
                                                <Switch
                                                    id={`role-switch-${user.uid}`}
                                                    checked={user.role === 'admin'}
                                                    onCheckedChange={(isChecked) => handleRoleChange(user, isChecked ? 'admin' : 'user')}
                                                    disabled={user.uid === currentUser?.uid}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
