"use client"

import DefaultButton from "@/components/shared/buttons/button"
import MenuServiceButton from "@/components/shared/menu-service-button"
import { FileIcon, MailIcon, UserIcon } from "@/components/ui/icons"
import {ServiceType} from "@/constants/service-data";
import Image from "next/image";

interface AskPageProps {
    service: ServiceType
    showTooltip: (description: string) => void
    setQuestionValue: (question: string) => void
    handleSend: () => void
}

export default function DesktopAskPage({ service, showTooltip, setQuestionValue, handleSend }: AskPageProps) {

    return (
        <div className="min-h-screen bg-white font-sans max-w-7xl mx-auto">
            {/* Main content */}
            <div className="mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold mb-8">{service.title}</h1>

                <div className="flex flex-col-reverse lg:flex-row justify-between gap-8">
                    {/* Left column */}
                    <div className="space-y-8 lg:w-7/10">
                        {/* About department section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Об отделе:</h2>
                            <p className="text-base">{service.about}</p>
                        </div>

                        {/* Service menu buttons */}
                        {service.children && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">Сервисы:</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {service.children.map((data) => (
                                        <MenuServiceButton
                                            key={data.title}
                                            title={data.title}
                                            description={data.description}
                                            iconPath={data.iconPath}
                                            showDescription={showTooltip}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Feedback section */}
                        <div>
                            <h2 className="text-xl font-bold mb-4">Обратная связь:</h2>
                            <div className="space-y-4">
                                <textarea
                                    className="w-full h-40 bg-white border border-[#a4a4a4] rounded-md px-4 py-3 text-black placeholder-[#a4a4a4]"
                                    placeholder="Текст вопроса, проблемы..."
                                    onChange={(e) => setQuestionValue(e.target.value)}
                                ></textarea>
                                <DefaultButton
                                    content="Задать вопрос"
                                    bg="#e30613"
                                    onClick={() => {
                                        handleSend()
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right column - Responsible person section */}
                    <div className="bg-gray-50 p-6 rounded-lg w-1/4">
                        <h2 className="text-xl font-bold mb-4">Ответственное лицо:</h2>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-40 h-48 bg-gray-200 rounded-md overflow-hidden mb-4">
                                <Image
                                    src="/placeholder.svg?height=128&width=112"
                                    alt="Фото ответственного лица"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <UserIcon className="w-5 h-5 text-[#e30613] mr-3" />
                                <span className="text-base">Фамилия Имя Отчество</span>
                            </div>
                            <div className="flex items-center">
                                <FileIcon className="w-5 h-5 text-[#e30613] mr-3" />
                                <span className="text-base">Должность</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-5 h-5 text-[#e30613] mr-3" />
                                <span className="text-base">Почта</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
