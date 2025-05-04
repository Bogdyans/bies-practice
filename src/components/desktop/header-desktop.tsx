"use client"

import {BellIcon, MainLogoIcon, SearchIcon} from "@/components/ui/icons";
import {usePathname} from "next/navigation";
import { useState } from "react";
import {HEADER_BUTTONS_DATA} from "@/constants/header-buttons";
import Link from "next/link";

// Mock данные для уведомлений
const mockNotifications = [
    {
        id: 1,
        title: "Новое сообщение",
        text: "У вас новый отзыв на публикацию",
        date: "5 мин назад"
    },
    {
        id: 2,
        title: "Обновление системы",
        text: "Доступно новое обновление платформы",
        date: "2 часа назад"
    },
    {
        id: 3,
        title: "Напоминание",
        text: "Не забудьте завершить публикацию проекта",
        date: "Вчера"
    },
];

export default function HeaderDesktop() {
    const path = usePathname();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors relative"
                            >
                                <BellIcon width="20px" height="20px"/>
                                {/* Индикатор новых уведомлений */}
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* Выпадающее окно уведомлений */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="font-semibold text-lg">Уведомления</h3>
                                    </div>

                                    <div className="max-h-64 overflow-y-auto">
                                        {mockNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                <div className="text-sm font-medium text-gray-900">
                                                    {notification.title}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {notification.text}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-2">
                                                    {notification.date}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-2 text-center border-t border-gray-200">
                                        <button className="text-sm text-blue-600 hover:text-blue-800">
                                            Показать все
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}