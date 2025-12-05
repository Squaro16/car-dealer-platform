"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function DateRangeFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Default to first day of current month and today
    const defaultStart = new Date();
    defaultStart.setDate(1);
    const defaultEnd = new Date();

    const [startDate, setStartDate] = useState(searchParams.get("startDate") || defaultStart.toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || defaultEnd.toISOString().split("T")[0]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("startDate", startDate);
        params.set("endDate", endDate);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-end gap-4 border p-4 rounded-lg bg-card">
            <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <Button onClick={handleApply}>Apply Filter</Button>
        </div>
    );
}
