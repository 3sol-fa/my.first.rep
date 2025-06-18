"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Validate passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) throw signUpError;

            if (data?.user) {
                // Create initial profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            email: data.user.email,
                            username: data.user.email?.split('@')[0] || null,
                            updated_at: new Date().toISOString(),
                        },
                    ]);

                if (profileError) {
                    console.error('Error creating profile:', profileError);
                    throw new Error('Failed to create profile');
                }

                // Show success message and redirect to login
                alert('Please check your email for verification link. After verifying, you can log in.');
                router.replace('/login');
            }
        } catch (error: any) {
            console.error('Error during signup:', error);
            setError(error.message || 'An error occurred during signup');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError("");
        setIsLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${location.origin}/auth/callback`,
                },
            });

            if (error) throw error;
        } catch (error: any) {
            console.error("Error signing up with Google:", error);
            setError("Failed to sign up with Google. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-yellow-900">Create Account</CardTitle>
                    <CardDescription className="text-center text-yellow-800">
                        Join us to start exploring dog breeds
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <p className="text-xs text-gray-500">
                                Password must be at least 6 characters long
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your password"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-yellow-500 text-yellow-900 hover:bg-yellow-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : "Sign Up"}
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-yellow-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-yellow-800">Or continue with</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full text-yellow-800 border-yellow-800 hover:bg-yellow-200"
                            onClick={handleGoogleSignUp}
                            disabled={isLoading}
                        >
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign up with Google
                        </Button>

                        <p className="text-center text-sm text-yellow-800">
                            Already have an account?{" "}
                            <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
