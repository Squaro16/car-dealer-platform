"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
    data: Record<string, unknown>[];
    filename: string;
    label?: string;
}

export function ExportButton({ data, filename, label = "Export CSV" }: ExportButtonProps) {
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert("No data to export");
            return;
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);

        // Convert to CSV string
        const csvContent = [
            headers.join(","),
            ...data.map(row => headers.map(header => {
                const value = row[header];
                // Handle strings with commas, nulls, dates
                if (value === null || value === undefined) return "";
                if (value instanceof Date) return value.toISOString();
                if (typeof value === "string" && value.includes(",")) return `"${value}"`;
                return value;
            }).join(","))
        ].join("\n");

        // Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${filename}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
