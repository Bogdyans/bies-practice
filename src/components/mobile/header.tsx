"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import XButton from "@/components/shared/buttons/x-button";

export default function Header() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [isSearchOpen])


    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isSearchOpen) {
                setIsSearchOpen(false)
            }
        }

        document.addEventListener("keydown", handleEscKey)
        return () => {
            document.removeEventListener("keydown", handleEscKey)
        }
    }, [isSearchOpen])

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)

        if (!isSearchOpen && searchInputRef.current) searchInputRef.current.value = ""
    }

    return (
        <header className="relative flex justify-between items-center px-4 py-3 border-b border-[#f5f5f5] overflow-hidden">

            {/* Search Icon */}
            <div
                className={`z-10 cursor-pointer transition-all duration-500 ease-in-out`}
                onClick={toggleSearch}
            >
                <Image src="/media/icons/search.png" alt="search" width={33} height={33} />
            </div>

            {/* Logo */}
            <div
                className={`flex flex-col items-center transition-all duration-500 ease-in-out
                    absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    ${
                    isSearchOpen
                        ? "opacity-0 transform translate-y-10 pointer-events-none"
                        : "opacity-100 transform"
                }`}
            >
                <div className="relative w-32 h-12">
                    <Image src="/media/logo.png" alt="logo" width={151} height={58} />
                </div>
            </div>

            {/* Notification Icon */}
            <div
                className={`transition-all duration-500 ease-in-out ${
                    isSearchOpen
                        ? "opacity-0 transform translate-x-10 absolute right-4 pointer-events-none"
                        : "opacity-100 transform translate-x-0"
                }`}
            >
                <Image src="/media/icons/notifications.png" alt="notifications" width={33} height={33} />
            </div>

            {/* Search Input */}
            <div
                className={`absolute left-16 transition-all duration-500 ease-in-out flex items-center ${
                    isSearchOpen ? "opacity-100 w-[calc(100%-5rem)]" : "opacity-0 w-0 pointer-events-none"
                }`}
            >
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Поиск..."
                    className="w-full border-none outline-none text-base bg-transparent"
                />
                <XButton onClick={toggleSearch} className={isSearchOpen ? "opacity-100 scale-100" : "opacity-0 scale-50"}/>
            </div>
        </header>
    )
}

