import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

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
        <body className={inter.className}>
        <main className="min-h-screen max-w-md mx-auto bg-white">{children}</main>
        </body>
        </html>
    )
}

