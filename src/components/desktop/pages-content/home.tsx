"use client"

import { useState } from "react"

import InfoWindow from "@/components/shared/info-window"
import Link from "next/link";
import {SERVICE_DATA} from "@/constants/service-data";
import MenuServiceButton from "@/components/shared/menu-service-button";
import {NEWS_TITLE_DATA} from "@/constants/mock/news-title-data";
import NewsTitle from "@/components/shared/menu-news-title";
import DefaultButton from "@/components/shared/buttons/button";
import {useRouter} from "next/navigation";


export default function DesktopHomePage() {
    const [activeDescription, setActiveDescription] = useState<string | null>(null)
    const router = useRouter()

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-7xl">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Services */}
                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-6">Сервисы</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {SERVICE_DATA.map((data) => (
                            <MenuServiceButton
                                key={data.title}
                                title={data.title}
                                description={data.description}
                                iconPath={data.iconPath}
                                showDescription={showTooltip}
                                href={data.href}
                                className="h-32"
                            >{data.smallDescription}</MenuServiceButton>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <DefaultButton
                            content={'Гид нового сотрудника'}
                            bg={"#e30613"}
                            onClick={() => router.push("/guide")}
                        />
                        <DefaultButton
                            content={'Мне только спросить!'}
                            bg={"#b6b6b6"}
                            onClick={() => router.push("/ask")}
                        />
                    </div>
                </div>

                {/* Right Column - News */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Новости и анонсы</h2>

                    <div className="space-y-6">
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
                        <div className="text-center">
                            <Link href="/news" className="text-[#e30613] font-medium hover:underline">
                                Все новости →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Tooltip/Modal */}
            <InfoWindow content={activeDescription} onClose={closeTooltip}/>
        </div>
    )
}
