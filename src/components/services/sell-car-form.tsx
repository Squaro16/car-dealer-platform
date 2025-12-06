"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronRight, ChevronLeft, Upload, Loader2, DollarSign } from "lucide-react";
import { submitSellRequest } from "@/lib/actions/leads";

export function SellCarForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        vin: "",
        year: "",
        make: "",
        model: "",
        mileage: "",
        condition: "",
        price: "",
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitSellRequest({
                ...formData,
                year: parseInt(formData.year) || 0,
                mileage: parseInt(formData.mileage) || 0,
                price: formData.price, // Interface allows string | number
            });
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Card className="max-w-xl mx-auto border-primary/20 bg-black/40 backdrop-blur-md">
                <CardContent className="pt-10 pb-10 px-6 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Request Received!</h2>
                    <p className="text-gray-300">
                        Thank you for considering us. Our valuation team will review your vehicle details and contact you within 24 hours with an offer.
                    </p>
                    <Button onClick={() => window.location.href = '/'} className="mt-4">
                        Return Home
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8 flex justify-between items-center relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -z-10" />
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex flex-col items-center gap-2 bg-background px-2 z-10 ${s <= step ? 'text-primary' : 'text-gray-600'} `}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors ${s <= step ? 'border-primary bg-primary text-white' : 'border-gray-600 bg-black text-gray-600'
                            } `}>
                            {s < step ? <Check className="h-4 w-4" /> : s}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider hidden md:block">
                            {s === 1 ? "Vehicle Details" : s === 2 ? "Condition" : "Contact"}
                        </span>
                    </div>
                ))}
            </div>

            <Card className="border-white/10 bg-black/40 backdrop-blur-md text-white">
                <CardHeader>
                    <CardTitle className="text-2xl font-heading">
                        {step === 1 && "Tell us about your car"}
                        {step === 2 && "Condition & Price"}
                        {step === 3 && "Contact Information"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>VIN (Optional)</Label>
                                    <Input
                                        placeholder="17-digit VIN"
                                        value={formData.vin}
                                        onChange={(e) => handleChange("vin", e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input
                                        placeholder="e.g. 2020"
                                        type="number"
                                        value={formData.year}
                                        onChange={(e) => handleChange("year", e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Make</Label>
                                    <Select value={formData.make} onValueChange={(v) => handleChange("make", v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder="Select Make" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Toyota">Toyota</SelectItem>
                                            <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                                            <SelectItem value="BMW">BMW</SelectItem>
                                            <SelectItem value="Honda">Honda</SelectItem>
                                            <SelectItem value="Porsche">Porsche</SelectItem>
                                            <SelectItem value="Ferrari">Ferrari</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Model</Label>
                                    <Input
                                        placeholder="e.g. C-Class"
                                        value={formData.model}
                                        onChange={(e) => handleChange("model", e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Mileage (km)</Label>
                                <Input
                                    placeholder="e.g. 45000"
                                    type="number"
                                    value={formData.mileage}
                                    onChange={(e) => handleChange("mileage", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Condition</Label>
                                <Select value={formData.condition} onValueChange={(v) => handleChange("condition", v)}>
                                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder="Rate condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Excellent">Excellent (Like New)</SelectItem>
                                        <SelectItem value="Good">Good (Minor wear)</SelectItem>
                                        <SelectItem value="Fair">Fair (Needs work)</SelectItem>
                                        <SelectItem value="Poor">Poor (Not running/Damaged)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Expected Price ($)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        placeholder="Enter your asking price"
                                        type="number"
                                        className="pl-9 bg-white/5 border-white/10 text-white"
                                        value={formData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Photos (Optional)</Label>
                                <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:bg-white/5 transition-colors cursor-pointer">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    type="tel"
                                    placeholder="+65 9123 4567"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                    className="bg-white/5 border-white/10 text-white"
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-white/10 pt-6">
                    {step > 1 ? (
                        <Button variant="outline" onClick={prevStep} className="border-white/10 hover:bg-white/10 text-white hover:text-white">
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                            Next Step <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name || !formData.phone} className="bg-primary hover:bg-primary/90">
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Request"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
