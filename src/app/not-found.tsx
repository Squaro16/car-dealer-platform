import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-slate-50 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 mb-6">
                <Car className="h-10 w-10 text-slate-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                404
            </h1>
            <p className="mt-4 text-lg text-slate-600">
                <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
            </p>
            <div className="mt-8">
                <Link href="/">
                    <Button size="lg">Go back home</Button>
                </Link>
            </div>
        </div>
    );
}
