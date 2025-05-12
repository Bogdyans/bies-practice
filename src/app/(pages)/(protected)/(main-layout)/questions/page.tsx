"use client"

import { useState, useEffect } from "react"
import { Check, Clock, X } from "lucide-react"
import Loading from "@/components/shared/loading";


export default function AnswersPage() {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("new")
    const [organizations, setOrganizations] = useState([])
    const [selectedOrg, setSelectedOrg] = useState("all")

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch organizations
                const orgsResponse = await fetch(`/api/organizations`)
                const orgsData = await orgsResponse.json()
                setOrganizations(orgsData.organizations)

                // Fetch questions
                await fetchQuestions()
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    console.log(organizations)
    console.log(selectedOrg)

    const fetchQuestions = async () => {
        setLoading(true)
        try {
            const status = activeTab === "new" ? "new" : activeTab === "answered" ? "answered" : "all"
            const orgFilter = selectedOrg !== "all" ? selectedOrg : ""

            const response = await fetch(`/api/questions?status=${status}&&organization=${orgFilter}`)
            const data = await response.json()
            setQuestions(data.questions)
        } catch (error) {
            console.error("Error fetching questions:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuestions()
    }, [activeTab, selectedOrg])

    const handleAnswerSubmit = async (questionId: number, answerText: string) => {
        try {
            const response = await fetch("/api/answers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question_id: questionId,
                    text: answerText,
                }),
            })

            if (response.ok) {
                // Refresh questions after answering
                fetchQuestions()
            }
        } catch (error) {
            console.error("Error submitting answer:", error)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new":
                return <Clock className="h-5 w-5 text-yellow-500" />
            case "answered":
                return <Check className="h-5 w-5 text-green-500" />
            default:
                return <Clock className="h-5 w-5 text-gray-500" />
        }
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="hidden md:block">
                    <h1 className="text-2xl font-bold mb-6">Ответы на вопросы</h1>
                </div>

                {/* Filters */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab("new")}
                                className={`px-4 py-2 rounded-md ${
                                    activeTab === "new" ? "bg-[#e30613] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Новые
                            </button>
                            <button
                                onClick={() => setActiveTab("answered")}
                                className={`px-4 py-2 rounded-md ${
                                    activeTab === "answered" ? "bg-[#e30613] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Отвеченные
                            </button>
                            <button
                                onClick={() => setActiveTab("all")}
                                className={`px-4 py-2 rounded-md ${
                                    activeTab === "all" ? "bg-[#e30613] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Все
                            </button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <select
                                value={selectedOrg}
                                onChange={(e) => setSelectedOrg(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
                            >
                                <option value="all">Все организации</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                    {loading ? (
                        <Loading />
                    ) : questions.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Нет вопросов для отображения</p>
                        </div>
                    ) : (
                        questions.map((question) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                onAnswerSubmit={handleAnswerSubmit}
                                getStatusIcon={getStatusIcon}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    )
}

function QuestionCard({ question, onAnswerSubmit, getStatusIcon }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [answerText, setAnswerText] = useState("")
    const [isAnswering, setIsAnswering] = useState(false)

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const handleSubmit = async () => {
        if (!answerText.trim()) return

        await onAnswerSubmit(question.id, answerText)
        setAnswerText("")
        setIsAnswering(false)
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        {getStatusIcon(question.status)}
                        <div>
                            <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-gray-900">{question.user_profile?.fio || "Пользователь"}</h3>
                                <span className="text-sm text-gray-500">{question.user_profile?.job_title}</span>
                            </div>
                            <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                                <span>{question.theme?.name || "Общая тема"}</span>
                                <span>•</span>
                                <span>{formatDate(question.created_at)}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-gray-500">
                        {isExpanded ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-gray-700">{question.text}</p>
                </div>

                {isExpanded && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        {question.answer ? (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900">Ответ:</h4>
                                    <span className="text-sm text-gray-500">
                    {question.answer.created_at && formatDate(question.answer.created_at)}
                  </span>
                                </div>
                                <p className="mt-2 text-gray-700">{question.answer.text}</p>
                            </div>
                        ) : (
                            <div>
                                {isAnswering ? (
                                    <div className="space-y-4">
                    <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        className="w-full h-32 border border-gray-300 rounded-md px-4 py-2 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#e30613] focus:border-transparent"
                        placeholder="Введите ваш ответ..."
                    />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => setIsAnswering(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Отмена
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                className="px-4 py-2 bg-[#e30613] text-white rounded-md hover:bg-[#c00510]"
                                            >
                                                Отправить
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsAnswering(true)}
                                        className="px-4 py-2 bg-[#e30613] text-white rounded-md hover:bg-[#c00510]"
                                    >
                                        Ответить
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
