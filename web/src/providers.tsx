'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { ThemeProvider } from '@/context/ThemeContext'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                <ThemeProvider>
                    <Toaster
                        toastOptions={{
                            className: 'dark:bg-zinc-800 dark:text-white',
                        }}
                    />
                    {children}
                </ThemeProvider>
                {/* <ReactQueryDevtools /> */}
            </GoogleOAuthProvider>
        </QueryClientProvider>
    )
}