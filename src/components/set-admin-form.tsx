
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck } from 'lucide-react';
import app from '@/lib/firebase';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

// Initialize Cloud Functions
const functions = getFunctions(app);
const setAdminClaim = httpsCallable(functions, 'setAdminClaim');

export function SetAdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResultMessage(null);
    setErrorMessage(null);

    try {
      const result = await setAdminClaim({ email: values.email });
      const data = result.data as { result?: string; error?: string };

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Success!',
        description: data.result,
      });
      setResultMessage(data.result || 'User has been made an admin.');
      form.reset();
    } catch (error: any) {
      console.error('Error setting admin claim:', error);
      const message = error.message || 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: message,
      });
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Admin Management</h2>
            <p className="mt-4 text-muted-foreground">Grant admin privileges to another user account.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Set Admin Role</CardTitle>
                <CardDescription>
                    Enter the email address of a registered user to grant them admin permissions.
                    The user must have an existing account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User's Email</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="user@example.com"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    Make Admin
                    </Button>
                </form>
                </Form>
                 {resultMessage && (
                    <Alert className="mt-4">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{resultMessage}</AlertDescription>
                    </Alert>
                )}
                {errorMessage && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
