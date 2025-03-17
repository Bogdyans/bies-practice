"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import BottomMenu from "@/components/mobile/bottom-menu";

import {MENU_SERVICE_BUTTON_DATA} from "@/constants/menu-service-button-data";
import MenuServiceButton from "@/components/shared/menu-service-button";

import {NEWS_TITLE_DATA} from "@/constants/mock/news-title-data";
import NewsTitle from "@/components/shared/menu-news-title";
import Header from "@/components/mobile/header";

export default function PromtehApp() {
    const router = useRouter()
    const [activeDescription, setActiveDescription] = useState<string | null>(null)

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }

    return (
        <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">


            {/* Header */}
            <Header />


            {/* Service Categories Grid */}
            <div className="grid grid-cols-2 gap-4 p-4">
                {MENU_SERVICE_BUTTON_DATA.map((data) => (
                    <MenuServiceButton
                        key={data.title}
                        title={data.title}
                        description={data.description}
                        iconPath={data.iconPath}
                        showDesc={showTooltip}
                        href={data.href}
                    />
                ))}
            </div>


            {/* Action Buttons */}
            <div className="px-4 space-y-3 mb-6">
                <button
                    className="w-full bg-[#e30613] text-white py-4 rounded-lg font-medium"
                    onClick={() => router.push("/guide")}
                >
                    Гид нового сотрудника
                </button>
                <button
                    className="w-full bg-[#b6b6b6] text-white py-4 rounded-lg font-medium"
                    onClick={() => router.push("/ask")}
                >
                    &#34;Мне только спросить!&#34;
                </button>
            </div>


            {/* News Section */}
            <div className="px-4 mb-4 flex-grow">
                <h2 className="text-xl font-bold mb-4">Новости и анонсы</h2>

                {
                    NEWS_TITLE_DATA.map((data) => (
                        <NewsTitle
                            key={data.title}
                            title={data.title}
                            date={data.date}
                            photos={data.photos}
                        />
                    ))
                }
                
            </div>


            {/* Bottom Navigation - Fixed to bottom */}
            <BottomMenu />


            {/* Info Tooltip/Modal */}
            {activeDescription && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
                        <button onClick={closeTooltip} className="absolute top-2 right-2 p-1">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="font-bold text-lg mb-2">Информация</h3>
                        <p>{activeDescription}</p>
                        <button onClick={closeTooltip} className="mt-4 bg-[#e30613] text-white py-2 px-4 rounded-lg w-full">
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

