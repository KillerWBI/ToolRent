"use client";

import { useAuth } from "@/store/auth.store";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { fetchUser } = useAuth();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return <>{children}</>;
}
