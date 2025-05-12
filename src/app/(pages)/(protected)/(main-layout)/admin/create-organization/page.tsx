"use client"
import { useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { Bell, ArrowLeft, Check, AlertCircle } from "lucide-react"
import Link from "next/link"

interface FormData {
    name: string
}

export default function CreateOrganizationPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    const [formData, setFormData] = useState<FormData>({
        name: "",
    })

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess(false)

        if (!formData.name.trim()) {
            setError("Пожалуйста, введите название организации")
            setIsLoading(false)
            return
        }

        try {
            const formDataToSend = new FormData()
            formDataToSend.append("name", formData.name)

            const response = await fetch("/api/organizations", {
                method: "POST",
                body: formDataToSend,
            })

            if (response.ok) {
                setSuccess(true)
                setFormData({
                    name: "",
                })
                setTimeout(() => {
                    router.push("/admin")
                }, 2000)
            } else {
                const data = await response.json()
                setError(data.error || data.message || "Произошла ошибка при создании организации")
            }
        } catch (err) {
            setError("Ошибка соединения с сервером")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen mx-auto max-w-7xl">

            {/* Page Title */}
            <div className="px-4 py-4 border-b border-gray-200">
                <h1 className="text-xl font-bold">Создание организации</h1>
                <p className="text-sm text-gray-500">Введите название новой организации</p>
            </div>

            {/* Form */}
            <div className="flex-1 px-4 py-4 overflow-auto pb-20">
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        <span>Организация успешно создана!</span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Название организации <span className="text-[#e30613]">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleTextChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                placeholder="Введите название организации"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#e30613] text-white rounded-md font-medium disabled:opacity-70"
                        >
                            {isLoading ? "Создание..." : "Создать организацию"}
                        </button>
                    </div>

                    <div className="pt-2">
                        <Link
                            href="/admin"
                            className="block w-full py-4 bg-[#b6b6b6] text-white rounded-md font-medium text-center"
                        >
                            Отмена
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
