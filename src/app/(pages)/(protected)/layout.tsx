

import type React from "react"
import { AuthProvider } from "@/components/shared/providers/auth-provider"



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>{children}</AuthProvider>
    )
}

