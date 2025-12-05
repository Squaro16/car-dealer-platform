"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateLeadStatus } from "@/lib/actions/leads";
import { useState } from "react";
import { toast } from "sonner";

interface LeadStatusUpdateProps {
    leadId: string;
    currentStatus: string;
}

export function LeadStatusUpdate({ leadId, currentStatus }: LeadStatusUpdateProps) {
    const [status, setStatus] = useState(currentStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            await updateLeadStatus(leadId, newStatus);
            setStatus(newStatus);
            toast.success("Lead status updated");
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={isLoading}
        >
            <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
        </Select>
    );
}
