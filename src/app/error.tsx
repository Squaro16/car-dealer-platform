"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { getErrorContext } from "@/lib/utils/error-handling";

interface ErrorPageProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Error occurred:', error);
    }, [error]);

    const errorContext = getErrorContext(error);

    const getErrorDisplay = () => {
        switch (errorContext?.code) {
            case 'AUTHENTICATION_ERROR':
                return {
                    title: "Authentication Required",
                    message: "Please log in to continue accessing this page.",
                    icon: "🔐",
                    showHomeButton: true,
                };
            case 'AUTHORIZATION_ERROR':
                return {
                    title: "Access Denied",
                    message: "You don't have permission to access this resource.",
                    icon: "🚫",
                    showHomeButton: true,
                };
            case 'NOT_FOUND_ERROR':
                return {
                    title: "Page Not Found",
                    message: "The page you're looking for doesn't exist.",
                    icon: "🔍",
                    showHomeButton: true,
                };
            case 'VALIDATION_ERROR':
                return {
                    title: "Invalid Data",
                    message: "Please check your input and try again.",
                    icon: "⚠️",
                    showHomeButton: false,
                };
            case 'DATABASE_ERROR':
                return {
                    title: "Service Temporarily Unavailable",
                    message: "We're experiencing technical difficulties. Please try again in a few moments.",
                    icon: "🔧",
                    showHomeButton: false,
                };
            default:
                return {
                    title: "Something went wrong!",
                    message: "We apologize for the inconvenience. An unexpected error has occurred.",
                    icon: "🚨",
                    showHomeButton: false,
                };
        }
    };

    const errorDisplay = getErrorDisplay();

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-center px-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
                <div className="text-2xl">{errorDisplay.icon}</div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                {errorDisplay.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-8">
                {errorDisplay.message}
            </p>

            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mb-6 max-w-2xl w-full">
                    <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        Error Details (Development Only)
                    </summary>
                    <pre className="mt-2 p-4 bg-muted rounded-md text-left text-xs overflow-auto">
                        <code>{error.message}</code>
                        {error.stack && (
                            <>
                                <br /><br />
                                <code>{error.stack}</code>
                            </>
                        )}
                    </pre>
                </details>
            )}

            <div className="flex gap-4">
                <Button onClick={() => reset()} size="lg" variant="default">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try again
                </Button>
                {errorDisplay.showHomeButton && (
                    <Button asChild size="lg" variant="outline">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
