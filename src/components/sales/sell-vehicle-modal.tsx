"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createSale } from "@/lib/actions/sales";
import { getCustomers } from "@/lib/actions/customers";
import { useState, useEffect } from "react";
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface SellVehicleModalProps {
    vehicleId: string;
    vehicleTitle: string;
    price: string;
}

export function SellVehicleModal({ vehicleId, vehicleTitle, price }: SellVehicleModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    useEffect(() => {
        if (open) {
            setLoadingCustomers(true);
            getCustomers({ limit: 100 }) // Fetch first 100 for now
                .then((res) => setCustomers(res.data))
                .catch((err) => console.error(err))
                .finally(() => setLoadingCustomers(false));
        }
    }, [open]);

    async function onSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            await createSale(formData);
            toast.success("Vehicle sold successfully!");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to process sale");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Sell Vehicle
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sell Vehicle</DialogTitle>
                    <DialogDescription>
                        Process sale for {vehicleTitle}.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="grid gap-4 py-4">
                    <input type="hidden" name="vehicleId" value={vehicleId} />

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="customerId" className="text-right">
                            Customer
                        </Label>
                        <div className="col-span-3">
                            <Select name="customerId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder={loadingCustomers ? "Loading..." : "Select customer"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {customers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salePrice" className="text-right">
                            Price
                        </Label>
                        <Input
                            id="salePrice"
                            name="salePrice"
                            defaultValue={price}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="saleDate" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="saleDate"
                            name="saleDate"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="paymentMethod" className="text-right">
                            Payment
                        </Label>
                        <Select name="paymentMethod" defaultValue="bank_transfer" required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="loan">Loan</SelectItem>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input
                            id="notes"
                            name="notes"
                            placeholder="Optional notes"
                            className="col-span-3"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Sale
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
