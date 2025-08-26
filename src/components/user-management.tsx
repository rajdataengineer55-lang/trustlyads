
"use client";

import { useState, useEffect } from "react";
import { AppUser, getUsersStream, updateUserRole } from "@/lib/users";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

export function UserManagement() {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = getUsersStream((usersData) => {
            setUsers(usersData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleRoleChange = async (uid: string, newRole: 'admin' | 'user') => {
        if (uid === currentUser?.uid) {
            toast({
                variant: "destructive",
                title: "Action Forbidden",
                description: "You cannot change your own role.",
            });
            return;
        }

        try {
            await updateUserRole(uid, newRole);
            toast({
                title: "Role Updated",
                description: `User role has been successfully changed to ${newRole}.`,
            });
        } catch (error) {
            console.error("Failed to update role:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update the user's role.",
            });
        }
    };

    if (loading) {
        return (
             <div className="w-full">
                <div className="text-center mb-12"> <Skeleton className="h-10 w-1/2 mx-auto" /> <Skeleton className="h-6 w-3/4 mx-auto mt-4" /> </div>
                <Card><CardContent className="p-4"><Skeleton className="h-80 w-full" /></CardContent></Card>
            </div>
        )
    }

    return (
        <>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-headline font-bold">User Management</h2>
                <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Manage user roles and permissions for the application.</p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users who have signed into the application.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.photoURL} alt={user.displayName} />
                                                <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.displayName || 'No Name'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onValueChange={(value: 'admin' | 'user') => handleRoleChange(user.id, value)}
                                            disabled={user.id === currentUser?.uid}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="user">User</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>
        </>
    );
}
