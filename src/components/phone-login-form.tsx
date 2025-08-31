
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, KeyRound } from "lucide-react";

const phoneSchema = z.object({
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number with country code." }),
});

const codeSchema = z.object({
    code: z.string().min(6, { message: "Verification code must be 6 digits." }),
});


export function PhoneLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const { sendVerificationCode, confirmVerificationCode } = useAuth();
  const { toast } = useToast();

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "+91" },
  });
  
  const codeForm = useForm<z.infer<typeof codeSchema>>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });


  async function onSendCode(values: z.infer<typeof phoneSchema>) {
    setIsLoading(true);
    try {
      await sendVerificationCode(values.phone);
      setIsCodeSent(true);
      toast({ title: "Code Sent", description: `A verification code has been sent to ${values.phone}.` });
    } catch (error: any) {
      console.error("Phone sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send Code",
        description: error.message || "An error occurred. Please check the phone number and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onConfirmCode(values: z.infer<typeof codeSchema>) {
    setIsLoading(true);
    try {
      await confirmVerificationCode(values.code);
      toast({ title: "Signed In Successfully!", description: "Welcome to the platform." });
      // The AuthContext will handle redirecting the user upon successful login.
    } catch (error: any) {
        console.error("Code confirmation error:", error);
        toast({
          variant: "destructive",
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div>
      <div id="recaptcha-container"></div>
      {!isCodeSent ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onSendCode)} className="space-y-4">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Phone className="mr-2 h-4 w-4" />
              )}
              Send Verification Code
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onConfirmCode)} className="space-y-4">
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Verify & Sign In
            </Button>
            <Button variant="link" size="sm" className="w-full" onClick={() => setIsCodeSent(false)}>
                Use a different phone number
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
