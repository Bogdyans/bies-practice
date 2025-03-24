'use client'

import type React from "react"
import { AuthProvider } from "@/components/shared/providers/auth-provider"
import Header from "@/components/mobile/header";
import BottomMenu from "@/components/mobile/bottom-menu";
import {usePathname} from "next/navigation";



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const path = usePathname()

    return (
        <AuthProvider>
            <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col gap-y-3">
                <Header />
                {children}
                <BottomMenu selected={path} />
            </div>
        </AuthProvider>
)
}

