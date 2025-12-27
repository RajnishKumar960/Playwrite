"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Configure React Query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 1000, // 5 seconds for real-time feel
            refetchOnWindowFocus: true, // Sync when returning to tab
            retry: 1,
        },
    },
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
