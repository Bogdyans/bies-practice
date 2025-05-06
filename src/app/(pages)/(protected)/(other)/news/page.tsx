"use client"

import { useEffect, useState } from "react"
import NewsTitle from "@/components/shared/menu-news-title"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { News } from "@/types/news"
import Loading from "@/components/shared/loading";
import HeaderWithBackButton from "@/components/mobile/header-with-back-button";

export default function NewsPage() {
    const [news, setNews] = useState<News[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [isLoading, setIsLoading] = useState(true)
    const limit = 6 // 3x2 grid

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true)
            try {
                const offset = (currentPage - 1) * limit
                const res = await fetch(`/api/news?limit=${limit}&offset=${offset}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })

                if (!res.ok) {
                    throw new Error("Ошибка при получении новостей")
                }

                const data = await res.json()

                console.log(data.total)
                setNews(data.news)
                setTotalPages(Math.ceil(data.total.total / limit))
            } catch (error) {
                console.error("Ошибка при загрузке новостей:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNews()
    }, [currentPage])

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    return (
        <div className="md:container md:mx-auto md:px-6 md:py-8 md:max-w-7xl">
            <HeaderWithBackButton  href="/" className="md:hidden" title='Новости'/>
            <h1 className="text-2xl font-bold mb-6 px-4 md:px-0">Новости и анонсы</h1>

            {isLoading ? (
                <Loading />
            ) : (
                <>
                    {/* Grid layout: 1 column on mobile, 2 on small tablets, 3 on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
                        {news.map((item) => (
                            <NewsTitle key={item.news_id} title={item.title} date={item.date} photos={item.photos} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    )
}

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const renderPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 5

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-10 h-10 rounded-md ${
                        currentPage === i ? "bg-[#e30613] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {i}
                </button>,
            )
        }

        return pages
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8 px-4 md:px-0">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>

            {renderPageNumbers()}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center"
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}
