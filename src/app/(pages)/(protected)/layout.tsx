

import type React from "react"
import { AuthProvider } from "@/components/shared/providers/auth-provider"
import Header from "@/components/mobile/header";
import BottomMenu from "@/components/mobile/bottom-menu";



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <AuthProvider>
            <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col gap-y-3">
                <Header />
                {children}
                <BottomMenu />
            </div>
        </AuthProvider>
)
}

