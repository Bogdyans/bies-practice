"use client"

import {MainLogoIcon, SearchIcon} from "@/components/ui/icons";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {HEADER_BUTTONS_DATA} from "@/constants/header-buttons";
import Link from "next/link";
import NotificationBell from "@/components/desktop/notification-bell";


export default function HeaderDesktop() {
    const path = usePathname();

    return (
        <header className="border-b border-[#f5f5f5] bg-white">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <div className="">
                            <MainLogoIcon width={"150"}/>
                        </div>

                        {/* Main Navigation */}
                        <nav className="hidden md:flex space-x-6">
                            {
                                HEADER_BUTTONS_DATA.map((button, index) =>
                                    <Link href={button.href} key={index} className={`font-medium ${path === button.href? "text-[#e30613]" : ""} hover:text-[#e30613] transition-colors`}>
                                        {button.title}
                                    </Link>
                                )
                            }
                        </nav>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
                            <SearchIcon width="20px" height="20px"/>
                        </button>

                        {/* Контейнер для уведомлений с относительным позиционированием */}
                        <div className="relative">

                                <NotificationBell />

                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}