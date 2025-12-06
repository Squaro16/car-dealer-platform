"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, Car, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (error: unknown) {
            toast.error("Invalid credentials");
            setError((error as Error).message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-950 relative overflow-hidden font-body text-white">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-full h-[500px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4">
                <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 rounded-xl bg-primary/20 text-primary mb-4 ring-1 ring-white/10 backdrop-blur-md">
                        <Car className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight text-center">
                        Prestige Motors
                    </h1>
                    <p className="text-gray-400 mt-2 text-center text-sm">
                        Dealer Management Portal
                    </p>
                </div>

                <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl font-bold tracking-tight text-white text-center">
                            Admin Access
                        </CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Secure login for authorized personnel only
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-6 pt-6 pb-8">
                            {error && (
                                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-500">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@prestigemotors.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all font-light"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 focus:ring-primary/20 transition-all font-light pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium text-lg transition-all hover:scale-[1.02] shadow-lg shadow-primary/20" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </CardContent>
                    </form>
                </Card>
                <p className="mt-8 text-center text-xs text-gray-500 font-light">
                    Protected by reCAPTCHA and subject to the Privacy Policy and Terms of Service.
                </p>
            </div>
        </div>
    );
}
