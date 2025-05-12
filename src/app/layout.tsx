import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata = {
    title: "ПРОМТЕХ",
    description: "Мобильное приложение ПРОМТЕХ",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ru">
          <body className={"min-h-screen w-full bg-white "+ inter.className}>
            {children}
            <Toaster position="bottom-right" />
          </body>
        </html>
    )
}

