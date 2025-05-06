'use client'

import {useEffect, useState} from "react";
import {News} from "@/types/news";
import {useParams} from "next/navigation";
import Loading from "@/components/shared/loading";
import HeaderWithBackButton from "@/components/mobile/header-with-back-button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Image from "next/image";

export default function NewsPage() {
    const [newsData, setNewsData] = useState<News | null>(null)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/news/${id}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if (!response.ok) {
                return;
            }
            const data = await response.json()
            console.log(data)
            setNewsData(data.newsData)
        }

        fetchData()
    }, [])

    const handleNextPhoto = () => {
        if (newsData?.photos && currentPhotoIndex < newsData.photos.length - 1) {
            setCurrentPhotoIndex((prev) => prev + 1)
        }
    }

    const handlePrevPhoto = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex((prev) => prev - 1)
        }
    }

    // Format date to DD.MM.YYYY
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date
            .toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
            .replace(/\//g, ".")
    }

    if (!newsData) return <Loading/>

    return (
        <div className="min-h-screen px-0 mx-auto sm:max-w-md md:max-w-3xl container md:px-6 md:py-8 lg:max-w-7xl">
            <HeaderWithBackButton href="/news" title={newsData.title} className="md:hidden"/>
            <div className="px-4 sm:px-0">

                <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Photo Carousel */}
                    {newsData.photos && newsData.photos.length > 0 && (
                        <div className="relative">
                            <div className="aspect-[16/9] relative">
                                <Image
                                    src={newsData.photos[currentPhotoIndex].url || "/placeholder.svg"}
                                    alt={newsData.photos[currentPhotoIndex].caption || newsData.title }
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                {/*<Image*/}
                                {/*    src={newsData.photos[currentPhotoIndex].url || "/placeholder.svg"}*/}
                                {/*    alt={newsData.photos[currentPhotoIndex].caption}*/}
                                {/*    fill*/}
                                {/*    className="object-cover"*/}
                                {/*    priority*/}
                                {/*/>*/}
                            </div>

                            {newsData.photos.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevPhoto}
                                        disabled={currentPhotoIndex === 0}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 disabled:opacity-50 shadow-md"
                                        aria-label="Previous photo"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={handleNextPhoto}
                                        disabled={currentPhotoIndex === newsData.photos.length - 1}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 disabled:opacity-50 shadow-md"
                                        aria-label="Next photo"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                        {currentPhotoIndex + 1} / {newsData.photos.length}
                                    </div>

                                    {/* Thumbnail navigation */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                        {newsData.photos.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentPhotoIndex(index)}
                                                className={`w-2 h-2 rounded-full ${
                                                    currentPhotoIndex === index ? "bg-[#e30613]" : "bg-white/70"
                                                }`}
                                                aria-label={`Go to photo ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold">{newsData.title}</h1>
                            <span className="text-gray-400 text-sm whitespace-nowrap ml-4">{formatDate(newsData.date)}</span>
                        </div>

                        <div className="prose max-w-none">
                            {newsData.text ? (
                                <div dangerouslySetInnerHTML={{ __html: newsData.text }} />
                            ) : (
                                <>
                                    <p>{newsData.text}</p>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                                        tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget
                                        ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
                                    </p>
                                    <p>
                                        Praesent euismod, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit
                                        amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl
                                        nisl sit amet nisl.
                                    </p>
                                </>
                            )}
                        </div>


                        {/* Author */}
                        {/*{newsData.author && (*/}
                        {/*    <div className="mt-6 pt-4 border-t border-gray-100">*/}
                        {/*        <p className="text-sm text-gray-500">*/}
                        {/*            Автор: <span className="font-medium text-gray-700">{news.author}</span>*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*)}*/}
                    </div>
                </article>
            </div>
        </div>
    )
}