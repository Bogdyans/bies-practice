"use client"

import { useMobile } from "@/hooks/use-mobile"
import MobileHomePage from "@/components/mobile/pages-content/home";
import DesktopHomePage from "@/components/desktop/pages-content/home";


export default function Home() {
    const isMobile = useMobile()

    return <>{isMobile ? <MobileHomePage /> : <DesktopHomePage />}</>
}
