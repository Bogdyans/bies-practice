"use client"

import Link from "next/link"
import {Search, Bell, Menu} from "lucide-react"
import {MainLogoIcon} from "@/components/ui/icons";

export default function HeaderDesktop() {
    return (
        <header className="border-b border-[#f5f5f5] bg-white">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">

                        {/* Logo */}
                        <div className="">
                            <MainLogoIcon width={"150"}/>
                        </div>

                        {/* Main Navigation */}
                        <nav className="hidden md:flex space-x-6">
                            <Link href="/" className="font-medium hover:text-[#e30613] transition-colors">
                            Главная
                            </Link>
                            <Link href="/documents" className="font-medium hover:text-[#e30613] transition-colors">
                                Документы
                            </Link>
                            <Link href="/directory" className="font-medium hover:text-[#e30613] transition-colors">
                                Справочник
                            </Link>
                            <Link href="/profile" className="font-medium hover:text-[#e30613] transition-colors">
                                Профиль
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
                            <Search className="w-5 h-5"/>
                        </button>
                        <button className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
                            <Bell className="w-5 h-5"/>
                        </button>
                        <button className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors md:hidden">
                            <Menu className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}
