"use client"

import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { SERVICE_DATA } from "@/constants/service-data"
import InfoWindow from "@/components/shared/info-window"
import MenuServiceButton from "@/components/shared/menu-service-button"
import NewsTitle from "@/components/shared/menu-news-title"
import DefaultButton from "@/components/shared/buttons/button"
import {News} from "@/types/news";

export default function HomePage() {
    const router = useRouter()
    const [activeDescription, setActiveDescription] = useState<string | null>(null)
    const [news, setNews] = useState<News[]>([]);

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("/api/news?limit=2&offset=0", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include" // если токен в cookie
                });

                if (!res.ok) {
                    throw new Error("Ошибка при получении новостей");
                }

                const data = await res.json();
                setNews(data.news)
            } catch (error) {
                console.error("Ошибка при загрузке новостей:", error);
            }
        };

        fetchNews();
    }, [],)

    return (
        <>
            {/* Mobile layout (default) / Desktop layout (md and up) */}
            <div className="md:container md:mx-auto md:px-6 md:py-8 md:max-w-7xl">
                {/* Mobile Services Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 md:hidden">
                    {SERVICE_DATA.map((data) => (
                        <MenuServiceButton
                            key={data.title}
                            title={data.title}
                            description={data.description}
                            iconPath={data.iconPath}
                            showDescription={showTooltip}
                            href={data.href}
                        />
                    ))}
                </div>

                {/* Desktop Layout - Only visible on md screens and up */}
                <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 md:gap-8">
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
                                >
                                    {data.smallDescription}
                                </MenuServiceButton>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <DefaultButton content={"Гид нового сотрудника"} bg={"#e30613"} onClick={() => router.push("/guide")} />
                            <DefaultButton content={"Мне только спросить!"} bg={"#b6b6b6"} onClick={() => router.push("/ask")} />
                        </div>
                    </div>

                    {/* Right Column - News */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Новости и анонсы</h2>

                        <div className="space-y-6">
                            {news.map((data) => (
                                <NewsTitle key={data.news_id} id={data.news_id} title={data.title} date={data.date} photos={data.photos} />
                            ))}
                            <div className="text-center">
                                <Link href="/news" className="text-[#e30613] font-medium hover:underline">
                                    Все новости →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Action Buttons - Only visible on small screens */}
                <div className="px-4 space-y-3 mb-6 md:hidden">
                    <DefaultButton content={"Гид нового сотрудника"} bg={"#e30613"} onClick={() => router.push("/guide")} />
                    <DefaultButton content={"Мне только спросить!"} bg={"#b6b6b6"} onClick={() => router.push("/ask")} />
                </div>

                {/* Mobile News Section - Only visible on small screens */}
                <div className="px-4 mb-4 flex-grow md:hidden">
                    <h2 className="text-xl font-bold mb-4">Новости и анонсы</h2>

                    {news.map((data) => (
                        <NewsTitle key={data.news_id} id={data.news_id} title={data.title} date={data.date}
                                   photos={data.photos}/>
                    ))}
                    <div className="text-center">
                        <Link href="/news" className="text-[#e30613] font-medium hover:underline">
                            Все новости →
                        </Link>
                    </div>
                </div>

                {/* Info Tooltip/Modal - Shared between both layouts */}
                <InfoWindow content={activeDescription} onClose={closeTooltip}/>
            </div>
        </>
    )
}
