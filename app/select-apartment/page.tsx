import { OrganizationList, SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SelectApartmentPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        Klee
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Join an existing apartment or create a new one to get started.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                    <OrganizationList
                        hidePersonal
                        afterCreateOrganizationUrl="/dashboard"
                        afterSelectOrganizationUrl="/dashboard"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-none p-0",
                                organizationSwitcherTrigger: "w-full justify-between",
                            }
                        }}
                    />
                </div>

                <div className="flex justify-center mt-6">
                    <SignOutButton redirectUrl="/">
                        <Button variant="ghost" className="text-slate-500 hover:text-red-600 transition-colors gap-2">
                            <LogOut size={16} />
                            Log Out
                        </Button>
                    </SignOutButton>
                </div>
            </div>
        </div>
    )
}