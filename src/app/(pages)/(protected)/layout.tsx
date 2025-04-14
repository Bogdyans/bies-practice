'use client'

import {useMobile} from "@/hooks/use-mobile";
import {AuthProvider} from "@/components/shared/providers/auth-provider";
import HeaderDesktop from "@/components/desktop/header-desktop";
import type React from "react";

export default function MainLayout({ children, }: { children: React.ReactNode }){
    const isMobile = useMobile()

    return (
        <AuthProvider>
            {!isMobile? (
                <div className="bg-white min-h-screen w-full flex flex-col">
                    <HeaderDesktop/>
                    <main className="w-full">{children}</main>
                </div>
            ): <>{children}</>}
        </AuthProvider>
    )
}