'use client'

import HeaderWithBackButton from "@/components/mobile/header-with-back-button";
import { ServiceType} from "@/constants/service-data";
import DefaultButton from "@/components/shared/buttons/button";
import MenuServiceButton from "@/components/shared/menu-service-button";
import {FileIcon, MailIcon, UserIcon} from "@/components/ui/icons";
import Image from "next/image";

interface AskPageProps {
    service: ServiceType
    showTooltip: (description: string) => void
    setQuestionValue: (question: string) => void
    handleSend: () => void
}

export default function MobileAskPage({ service, showTooltip, setQuestionValue, handleSend }: AskPageProps) {
    return (
        <div className="flex flex-col min-h-screen max-w-md bg-white font-sans mx-auto">

            <HeaderWithBackButton
                title={service.title}
                href="/"
            />

            {/* Main content */}
            <div className="flex-1 px-4 py-4">
                {/* Responsible person section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-3">Ответственное лицо:</h2>
                    <div className="flex justify-between">
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <UserIcon className="w-5 h-5 text-[#e30613] mr-2"/>
                                <span className="text-base">Фамилия Имя Отчество</span>
                            </div>
                            <div className="flex items-center">
                                <FileIcon className="w-5 h-5 text-[#e30613] mr-2"/>
                                <span className="text-base">Должность</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-5 h-5 text-[#e30613] mr-2"/>
                                <span className="text-base">Почта</span>
                            </div>
                        </div>
                        <div className="w-28 h-32 bg-gray-200 rounded-md overflow-hidden">
                            <Image
                                src="/placeholder.svg?height=128&width=112"
                                alt="Фото ответственного лица"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* About department section */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2">Об отделе:</h2>
                    <p className="text-base">
                        {service.about}
                    </p>
                </div>

                {
                    service.children ?
                        (
                            <div className="grid grid-cols-2 gap-4 pb-4">
                                {
                                    service.children.map((data) => (
                                        <MenuServiceButton
                                            key={data.title}
                                            title={data.title}
                                            description={data.description}
                                            iconPath={data.iconPath}
                                            showDescription={showTooltip}
                                        />
                                    ))
                                }
                            </div>
                        )
                        :
                        null
                }

                {/* Feedback section */}
                <div>
                    <h2 className="text-xl font-bold mb-3">Обратная связь:</h2>
                    <div className="space-y-4">
            <textarea
                className="w-full h-32 bg-white border border-[#a4a4a4] rounded-md px-4 py-3 text-black placeholder-[#a4a4a4]"
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
        </div>

)
}