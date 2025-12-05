"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createLead } from "@/lib/actions/leads";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function LeadForm({ vehicleId, vehicleTitle }: { vehicleId: string, vehicleTitle: string }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        // Append vehicle ID
        formData.append("vehicleId", vehicleId);

        try {
            await createLead(formData);
            setIsSubmitted(true);
        } catch (error) {
            console.error("Failed to submit lead", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 h-full min-h-[300px]">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Inquiry Sent!</h3>
                <p className="text-muted-foreground">
                    Thanks for your interest in the {vehicleTitle}. Our sales team will contact you shortly.
                </p>
                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Send Another Inquiry
                </Button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+65 9123 4567" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="I'm interested in this car. Is it still available?"
                    defaultValue={`Hi, I'm interested in the ${vehicleTitle}.`}
                    required
                />
            </div>
            <Button className="w-full" size="lg" disabled={isPending}>
                {isPending ? "Sending..." : "Send Inquiry"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
                By submitting, you agree to be contacted by our sales team.
            </p>
        </form>
    );
}
