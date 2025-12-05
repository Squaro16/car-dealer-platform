"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Something went wrong!
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-md mx-auto px-4">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <div className="mt-8">
                <Button onClick={() => reset()} size="lg">
                    Try again
                </Button>
            </div>
        </div>
    );
}
