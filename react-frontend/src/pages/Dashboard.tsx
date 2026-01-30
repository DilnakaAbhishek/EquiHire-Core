import { useState } from 'react';
import { useAuthContext } from "@asgardeo/auth-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquiHireLogo, DashboardIcon, SessionIcon, IntegrationIcon, EmptyStateIllustration } from "@/components/ui/Icons";
import { LogOut, Bell, Settings, Search, Plus } from "lucide-react";

export default function Dashboard() {
    const { state, signOut } = useAuthContext();
    const [jobRole, setJobRole] = useState("");
    const [candidateEmail, setCandidateEmail] = useState("");
    const [dateTime, setDateTime] = useState("");

    const handleInvite = async () => {
        if (!jobRole || !candidateEmail || !dateTime) {
            alert("Please fill in all fields.");
            return;
        }
        console.log("Inviting:", { jobRole, candidateEmail, dateTime });
        alert(`Invitation sent to ${candidateEmail}`);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#1D1D1D] font-sans flex text-sm">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <EquiHireLogo className="mr-3 w-8 h-8" />
                    <span className="font-semibold text-lg tracking-tight">EquiHire</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-[#FF7300] bg-orange-50 hover:bg-orange-50 hover:text-[#FF7300]">
                        <DashboardIcon className="mr-3 h-5 w-5" />
                        Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                        <SessionIcon className="mr-3 h-5 w-5" />
                        Interviews
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                        <IntegrationIcon className="mr-3 h-5 w-5" />
                        Integrations
                    </Button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center p-2 rounded-lg bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                            {state.displayName ? state.displayName[0] : "R"}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{state.displayName || "Recruiter"}</p>
                            <p className="text-xs text-gray-500 truncate">{state.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex items-center text-gray-400 focus-within:text-gray-600">
                        <Search className="h-5 w-5 absolute ml-3 pointer-events-none" />
                        <Input
                            placeholder="Search sessions..."
                            className="pl-10 w-96 border-gray-200 bg-gray-50 focus:bg-white transition-all rounded-full h-9"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" className="text-gray-500">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => signOut()}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="p-8 overflow-auto flex-1">
                    <div className="max-w-6xl mx-auto space-y-8">

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                                <p className="text-gray-500 mt-1">Manage your blind interviews and hiring pipelines.</p>
                            </div>
                            <Button className="bg-[#FF7300] hover:bg-[#E56700] text-white rounded-full px-6">
                                <Plus className="mr-2 h-4 w-4" /> New Session
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Create Session Card - Prominent */}
                            <Card className="col-span-1 lg:col-span-2 shadow-sm border-gray-200">
                                <CardHeader className="pb-4 border-b border-gray-50">
                                    <CardTitle>Schedule a Blind Interview</CardTitle>
                                    <div className="h-1 w-12 bg-[#FF7300] rounded mt-2"></div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Role</label>
                                            <Input
                                                placeholder="e.g. Senior Backend Engineer"
                                                className="border-gray-200 focus:border-[#FF7300] focus:ring-[#FF7300]"
                                                value={jobRole}
                                                onChange={(e) => setJobRole(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">When</label>
                                            <Input
                                                type="datetime-local"
                                                className="border-gray-200 focus:border-[#FF7300] focus:ring-[#FF7300]"
                                                value={dateTime}
                                                onChange={(e) => setDateTime(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1 md:col-span-2 space-y-2">
                                            <label className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Candidate Email</label>
                                            <Input
                                                type="email"
                                                placeholder="candidate@example.com"
                                                className="border-gray-200 focus:border-[#FF7300] focus:ring-[#FF7300]"
                                                value={candidateEmail}
                                                onChange={(e) => setCandidateEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            className="bg-black text-white hover:bg-gray-800"
                                            onClick={handleInvite}
                                        >
                                            Send Invitation
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recent Activity / Stats */}
                            <div className="space-y-6">
                                <Card className="shadow-sm border-gray-200 bg-white">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">Total Interviews</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-gray-900">24</div>
                                        <p className="text-xs text-green-600 mt-1 font-medium">+12% from last month</p>
                                    </CardContent>
                                </Card>

                                <Card className="shadow-sm border-gray-200 bg-white">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-500">Pending Reviews</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-[#FF7300]">3</div>
                                        <p className="text-xs text-gray-500 mt-1">Requires your attention</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Session List */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
                            <Card className="shadow-sm border-gray-200">
                                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                    <EmptyStateIllustration />
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions scheduled</h3>
                                    <p className="mt-1 text-sm text-gray-500 max-w-sm">Get started by scheduling a new interview above.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
