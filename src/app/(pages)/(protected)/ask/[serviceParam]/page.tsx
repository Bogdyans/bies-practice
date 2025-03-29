'use client'

import {useParams} from "next/navigation";
import HeaderWithBackButton from "@/components/mobile/header-with-back-button";
import {SERVICE_DATA} from "@/constants/service-data";
import React, {useState} from "react";
import {Briefcase, Mail, User} from "lucide-react";
import DefaultButton from "@/components/shared/buttons/button";
import MenuServiceButton from "@/components/shared/menu-service-button";
import InfoWindow from "@/components/shared/info-window";
import NotFound from "@/components/shared/not-found";

export default function AskPage() {
    const { serviceParam } = useParams()
    const [ questionValue, setQuestionValue ] = useState<string | null>(null);
    const [activeDescription, setActiveDescription] = useState<string | null>(null)

    if (!serviceParam) {
        return null;
    }

    //Проверяем есть ли такой сервис, как я додумался до этого
    const service = SERVICE_DATA.find((el) => el.href.slice(-1 * (serviceParam.length)) === serviceParam)

    if (!service) {
        return <NotFound />
    }

    const handleSend = () => {
        if (!questionValue || questionValue.trim().length <= 0) {
            return <NotFound />
        }
    }

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }

    return (
        <>

            <HeaderWithBackButton
                title={service.title}
                href="/"
            />

            <div className="flex flex-col min-h-screen max-w-md bg-white font-sans mx-auto">

                {/* Main content */}
                <div className="flex-1 px-4 py-4">
                    {/* Responsible person section */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-3">Ответственное лицо:</h2>
                        <div className="flex justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <User className="w-5 h-5 text-[#e30613] mr-2"/>
                                    <span className="text-base">Фамилия Имя Отчество</span>
                                </div>
                                <div className="flex items-center">
                                    <Briefcase className="w-5 h-5 text-[#e30613] mr-2"/>
                                    <span className="text-base">Должность</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 text-[#e30613] mr-2"/>
                                    <span className="text-base">Почта</span>
                                </div>
                            </div>
                            <div className="w-28 h-32 bg-gray-200 rounded-md overflow-hidden">
                                <img
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
                                            showDesc={showTooltip}
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
            <InfoWindow content={activeDescription}
                        onClose={closeTooltip}
            />
        </>
    )
}