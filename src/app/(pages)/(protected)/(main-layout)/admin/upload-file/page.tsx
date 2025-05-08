"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { Bell, ArrowLeft, Check, AlertCircle, FileIcon, X, Upload } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Department {
    id: number;
    name: string;
    organization_id: number;
}

interface Organization {
    id: number;
    name: string;
}

interface FormData {
    organization_id: string | number;
    otdel_id: string | number;
    name: string;
    file: File | null;
    description: string;
}

export default function UploadDocumentPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [organizations, setOrganizations] = useState<Organization[]>();
    const [departments, setDepartments] = useState<Department[]>([])
    const [fileName, setFileName] = useState("")

    const [formData, setFormData] = useState<FormData>({
        organization_id: "",
        otdel_id: "",
        name: "",
        file: null,
        description: "",
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const orgsRes = await fetch("/api/admin/fetch-info/organizations", {
                    method: "GET",
                    headers: {
                        "Content-Type": "aplication/json",
                    },
                    credentials: "include",
                });

                if (!orgsRes.ok) {
                    throw new Error("Ошибка при получении организаций");
                }

                const orgsData = await orgsRes.json();
                setOrganizations(orgsData.organizations);
            } catch (error) {
                console.error("Ошибка при загрузке организаций: ", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            if (formData.organization_id == 0) return;
            try {
                const departmentsRes = await fetch(
                    `/api/admin/fetch-info/departments?organization_id=${formData.organization_id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "aplication/json",
                        },
                        credentials: "include",
                    }
                );

                if (!departmentsRes.ok) {
                    throw new Error("Ошибка при получении отделов");
                }

                const departmentsData = await departmentsRes.json();
                setDepartments(departmentsData.departments);
            } catch (error) {
                console.error("Ошибка при загрузке отделов: ", error);
            }
        };

        fetchDepartments();
    }, [formData.organization_id]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            // Автоматически устанавливаем имя файла в поле name
            setFormData((prev) => ({
                ...prev,
                file: file,
                name: file.name, // Устанавливаем имя файла как значение поля name
            }))

            setFileName(file.name)
        }
    }

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const removeFile = () => {
        setFormData((prev) => ({
            ...prev,
            file: null,
            name: "", // Очищаем имя при удалении файла
        }))
        setFileName("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setSuccess(false)

        if (!formData.organization_id || !formData.otdel_id || !formData.name || !formData.file) {
            setError("Пожалуйста, заполните все обязательные поля")
            setIsLoading(false)
            return
        }

        try {
            const formDataToSend = new FormData()

            const numericFields = {
                otdel_id: Number(formData.otdel_id),
                organization_id: Number(formData.organization_id),
            };

            Object.entries(formData).forEach(([key, value]) => {
                if (key !== "file" && value !== null && value !== undefined) {
                    const finalValue =
                        key in numericFields
                            ? numericFields[key as keyof typeof numericFields].toString()
                            : value.toString();
                    formDataToSend.append(key, finalValue);
                }
            });

            if (formData.file) {
                formDataToSend.append("file", formData.file)
            }

            const response = await fetch("/api/documents", {
                method: "POST",
                body: formDataToSend,
            })

            if (response.ok) {
                setSuccess(true)

                setFormData({
                    organization_id: 0,
                    otdel_id: 0,
                    name: "",
                    file: null,
                    description: "",
                })
                setFileName("")

                setTimeout(() => {
                    router.push("/admin")
                }, 2000)
            } else {
                const data = await response.json()
                setError(data.error || data.message || "Произошла ошибка при загрузке документа")
            }
        } catch (err) {
            setError("Ошибка соединения с сервером")
        } finally {
            setIsLoading(false)
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Байт"
        const k = 1024
        const sizes = ["Байт", "КБ", "МБ", "ГБ"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    return (
        <div className="min-h-screen mx-auto max-w-7xl">

            {/* Page Title */}
            <div className="px-4 py-4 border-b border-gray-200">
                <h1 className="text-xl font-bold">Загрузка документа</h1>
                <p className="text-sm text-gray-500">Заполните все обязательные поля и загрузите файл</p>
            </div>

            {/* Form */}
            <div className="flex-1 px-4 py-4 overflow-auto pb-20">
                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
                        <Check className="w-5 h-5 mr-2" />
                        <span>Документ успешно загружен!</span>
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
                            <label htmlFor="organization_id" className="block text-sm font-medium mb-1">
                                Организация <span className="text-[#e30613]">*</span>
                            </label>
                            <Select
                                value={formData.organization_id.toString()}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, organization_id: Number(value) }))}
                                required
                            >
                                <SelectTrigger id="organization_id" className="w-full bg-white">
                                    <SelectValue placeholder="Выберите организацию" />
                                </SelectTrigger>
                                <SelectContent>
                                    {organizations?.map((org) => (
                                        <SelectItem key={org.id} value={org.id.toString()}>
                                            {org.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label htmlFor="otdel_id" className="block text-sm font-medium mb-1">
                                Отдел <span className="text-[#e30613]">*</span>
                            </label>
                            <Select
                                value={formData.otdel_id.toString()}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, otdel_id: Number(value) }))}
                                required
                            >
                                <SelectTrigger id="otdel_id" className="w-full bg-white">
                                    <SelectValue placeholder="Выберите отдел" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id.toString()}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Файл документа <span className="text-[#e30613]">*</span>
                            </label>

                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                            {formData.file ? (
                                <div className="p-3 bg-white border border-gray-300 rounded-md mb-2">
                                    <div className="flex items-center">
                                        <FileIcon className="w-6 h-6 text-gray-500 mr-2" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(formData.file.size)}</p>
                                        </div>
                                        <button type="button" onClick={removeFile} className="ml-2 p-1 rounded-full hover:bg-gray-100">
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={triggerFileInput}
                                    className="w-full py-3 border border-gray-300 rounded-md flex items-center justify-center gap-2 bg-white"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Выбрать файл</span>
                                </button>
                            )}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Название документа <span className="text-[#e30613]">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleTextChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                placeholder="Введите название документа"
                                disabled
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Описание
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleTextChange}
                                rows={4}
                                className="w-full p-2 border border-gray-300 rounded-md resize-none bg-white"
                                placeholder="Введите описание документа (необязательно)"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-[#e30613] text-white rounded-md font-medium disabled:opacity-70"
                        >
                            {isLoading ? "Загрузка..." : "Загрузить документ"}
                        </button>
                    </div>

                    <div className="pt-2">
                        <Link
                            href="/documents"
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
