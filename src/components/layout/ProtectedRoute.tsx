import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../features/auth/api/auth";
import { useEffect, type ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    // 1. If no token immediately, redirect.
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. If token exists, validate it.
    const { isError, isLoading } = useQuery({
        queryKey: ['auth', 'me'],
        queryFn: getUser,
        retry: false, // Don't retry if 401
    });

    useEffect(() => {
        if (isError) {
            localStorage.removeItem("token");
        }
    }, [isError]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (isError) {
        // Redirect to login if token invalid
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
