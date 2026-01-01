import {useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";

import Cases from "@/pages/Cases";
import Login from "@/pages/Login";
import Users from "@/pages/Users";
import NotFound from "@/pages/NotFound";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Appointments from "@/pages/Appointments";
import {Toaster} from "@/components/ui/toaster";
import {useAuthStore} from "@/stores/authStore.ts";
import {AuthProvider} from "@/contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Toaster as Sonner} from "@/components/ui/sonner";

const queryClient = new QueryClient();

const App = () => {
    const {fetchUser, isAuthenticated, isLoading, isAdmin} = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchUser();
    }, [fetchUser, isAuthenticated, isAdmin]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin h-8 w-8 text-primary"/>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <Toaster/>
                    <Sonner/>
                    <BrowserRouter>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>

                            {/* Protected routes with dashboard layout */}
                            <Route
                                element={
                                    <ProtectedRoute>
                                        <DashboardLayout/>
                                    </ProtectedRoute>
                                }
                            >
                                <Route path="/dashboard" element={<Dashboard/>}/>
                                <Route path="/appointments" element={<Appointments/>}/>
                                <Route path="/cases" element={<Cases/>}/>
                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute requiredRole="ADMIN">
                                            <Users/>
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>

                            {/* Redirect root to dashboard */}
                            <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

                            {/* 404 */}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
