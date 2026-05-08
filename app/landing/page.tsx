import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Receipt, Users } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-900 tracking-tight">Klee</span>
                </div>
                <div className="flex items-center gap-4">
                    <SignInButton mode="modal">
                        <Button variant="ghost" className="text-sm font-medium">
                            Log In
                        </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <Button className="bg-blue-900 hover:bg-blue-800 text-sm font-medium px-4">
                            Get Started
                        </Button>
                    </SignUpButton>
                </div>
            </div>
        </header>
        {/* Hero Section */}
        <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center justify-center text-center px-4">
            <div className="space-y-6 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-blue-900">
                Simplify Your Apartment Life
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Track chores, split expenses, and manage roommates all in one place. 
                The ultimate tool for a harmonious household.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <SignUpButton mode="modal">
                    <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-lg px-8 py-6">
                    Get Started for Free
                    </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    Sign In
                    </Button>
                </SignInButton>
                </div>
            </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-12 md:py-24 bg-slate-50 border-y">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl text-blue-900 mb-4">
                    Why Klee?
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Everything you need to live together peacefully
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="border shadow-md hover:border-blue-900 transition-colors">
                    <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-4">
                        <CheckCircle2 size={24} />
                    </div>
                    <CardTitle>Chore Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <CardDescription className="text-base">
                        Never argue about whose turn it is to take out the trash. 
                        Assign tasks and track completions easily.
                    </CardDescription>
                    </CardContent>
                </Card>

                <Card className="border shadow-md hover:border-blue-900 transition-colors">
                    <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-4">
                        <Receipt size={24} />
                    </div>
                    <CardTitle>Split Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <CardDescription className="text-base">
                        Transparently manage shared costs for rent, groceries, and utilities. 
                        Know exactly who owes what.
                    </CardDescription>
                    </CardContent>
                </Card>

                <Card className="border shadow-md hover:border-blue-900 transition-colors">
                    <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-900 mb-4">
                        <Users size={24} />
                    </div>
                    <CardTitle>Roommate Harmony</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <CardDescription className="text-base">
                        Shared organizations keep everyone on the same page. 
                        Manage your apartment ecosystem together.
                    </CardDescription>
                    </CardContent>
                </Card>
                </div>
            </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 border-t flex flex-col sm:flex-row items-center justify-center px-4 md:px-6 text-sm text-muted-foreground">
            <p>© 2026 Klee. All rights reserved.</p>
            <div className="flex gap-4 mt-4 sm:mt-0">
            {/* <button className="hover:underline">Privacy Policy</button>
            <button className="hover:underline">Terms of Service</button> */}
            </div>
        </footer>
        </div>
    );
}