import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Check } from "lucide-react";

export default function FinancingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="container py-12 px-4 md:px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Flexible Financing Options</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We work with leading banks and financial institutions to offer you the best rates.
                        Get pre-approved in minutes without affecting your credit score.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Calculator */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Loan Calculator
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Vehicle Price ($)</Label>
                                <Input id="price" type="number" placeholder="50000" defaultValue="50000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="down">Down Payment ($)</Label>
                                <Input id="down" type="number" placeholder="10000" defaultValue="10000" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="term">Term (Months)</Label>
                                    <Input id="term" type="number" placeholder="60" defaultValue="60" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rate">Interest Rate (%)</Label>
                                    <Input id="rate" type="number" placeholder="2.88" defaultValue="2.88" />
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-muted-foreground">Estimated Monthly Payment</span>
                                    <span className="text-3xl font-bold text-primary">$762</span>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                    *Estimated payment for illustration purposes only.
                                </p>
                            </div>

                            <Button className="w-full" size="lg">Apply for Financing</Button>
                        </CardContent>
                    </Card>

                    {/* Benefits */}
                    <div className="space-y-8">
                        <div className="prose max-w-none">
                            <h3 className="text-2xl font-bold mb-4">Why Finance with Us?</h3>
                            <p className="text-muted-foreground mb-6">
                                Our finance team is dedicated to finding the right plan for your budget.
                                Whether you have excellent credit or are rebuilding, we have options for you.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {[
                                "Competitive interest rates starting from 2.88%",
                                "Flexible terms up to 84 months",
                                "Fast approval process",
                                "Zero down payment options available",
                                "Trade-ins accepted as down payment"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-green-100 text-green-600">
                                        <Check className="h-4 w-4" />
                                    </div>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Card className="bg-slate-50 border-none">
                            <CardContent className="pt-6">
                                <h4 className="font-semibold mb-2">Documents Required</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>NRIC / Passport</li>
                                    <li>Latest 3 months payslips</li>
                                    <li>Latest 12 months CPF contribution history</li>
                                    <li>Proof of residence (if applicable)</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
