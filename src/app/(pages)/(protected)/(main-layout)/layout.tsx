'use client'

import type React from "react"
import Header from "@/components/mobile/header";
import BottomMenu from "@/components/mobile/bottom-menu";
import {usePathname} from "next/navigation";
import {useMobile} from "@/hooks/use-mobile";



export default function RootLayout({children,}: { children: React.ReactNode }) {
    const path = usePathname()
    const isMobile = useMobile()

    return <>{ isMobile ?
                (
                    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col gap-y-3">
                        <Header />
                        {children}
                        <BottomMenu selected={path} />
                    </div>
                )
                :
                <>{children}</>
            }</>
}

