"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createSourcingRequest } from "@/lib/actions/sourcing";
import { useState, useRef } from "react";
import { CheckCircle2, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export function SourcingForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const formRef = useRef<HTMLFormElement>(null);

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createSourcingRequest(formData);
            setIsSubmitted(true);
            setStep(1); // Reset step for next time
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();

        if (formRef.current) {
            // Use FormData to check values, works for native and custom inputs (if they use hidden inputs)
            const formData = new FormData(formRef.current);
            const make = formData.get("make");
            const model = formData.get("model");

            // Basic validation for required fields in Step 1
            if (!make || !model || make.toString().trim() === "" || model.toString().trim() === "") {
                // Find and focus the first empty required field
                const makeInput = formRef.current.querySelector('input[name="make"]') as HTMLInputElement;
                const modelInput = formRef.current.querySelector('input[name="model"]') as HTMLInputElement;

                if (!make || make.toString().trim() === "") {
                    makeInput?.focus();
                    makeInput?.reportValidity(); // Show native browser validation message if possible
                } else if (!model || model.toString().trim() === "") {
                    modelInput?.focus();
                    modelInput?.reportValidity();
                }
                return;
            }

            setStep(2);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-muted/30 rounded-lg border h-full">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 animate-in zoom-in spin-in-12">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Request Received!</h3>
                <p className="text-sm text-muted-foreground">
                    We&apos;ll start searching for your dream car and contact you via email or phone soon.
                </p>
                <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                    Submit Another Request
                </Button>
            </div>
        );
    }

    return (
        <form ref={formRef} action={onSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Progress Indicator */}
                <div className="flex items-center gap-2 mb-4">
                    <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
                    <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
                </div>

                {/* Step 1: Vehicle Preferences */}
                <div className={step === 1 ? "space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Vehicle Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="make">Make *</Label>
                            <Input id="make" name="make" placeholder="e.g. Toyota" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model">Model *</Label>
                            <Input id="model" name="model" placeholder="e.g. Camry" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="yearRange">Year Range</Label>
                            <Input id="yearRange" name="yearRange" placeholder="e.g. 2018-2023" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget">Max Budget ($)</Label>
                            <Input id="budget" name="budget" type="number" placeholder="50000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Preferred Color</Label>
                            <Input id="color" name="color" placeholder="e.g. White" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="transmission">Transmission</Label>
                            <Select name="transmission">
                                <SelectTrigger>
                                    <SelectValue placeholder="Any" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="automatic">Automatic</SelectItem>
                                    <SelectItem value="manual">Manual</SelectItem>
                                    <SelectItem value="cvt">CVT</SelectItem>
                                    <SelectItem value="dct">DCT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                name="notes"
                                placeholder="Any specific requirements?"
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </div>

                {/* Step 2: Contact Details */}
                <div className={step === 2 ? "space-y-4 animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" name="phone" placeholder="+65 9123 4567" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="bg-muted/50 p-3 rounded-md text-xs text-muted-foreground">
                            We will use these details only to contact you regarding your car request.
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t bg-muted/20 flex justify-between gap-3 sticky bottom-0 backdrop-blur-sm">
                {step === 2 && (
                    <Button type="button" variant="outline" onClick={() => setStep(1)}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                )}

                {step === 1 ? (
                    <Button type="button" className="w-full" onClick={handleNext}>
                        Next Step
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Request
                    </Button>
                )}
            </div>
        </form>
    );
}
