'use client'

import {useParams} from "next/navigation";
import {SERVICE_DATA} from "@/constants/service-data";
import React, {useEffect, useState} from "react";
import NotFound from "@/components/shared/not-found";
import HeaderWithBackButton from "@/components/mobile/header-with-back-button";
import {FileIcon, MailIcon, UserIcon} from "@/components/ui/icons";
import MenuServiceButton from "@/components/shared/menu-service-button";
import DefaultButton from "@/components/shared/buttons/button";
import Image from "next/image"
import InfoWindow from "@/components/shared/info-window";
import {AnswererData} from "@/types/contact";
import Loading from "@/components/shared/loading";


export default function AskPage() {
    const {serviceParam} = useParams()

    const [questionValue, setQuestionValue] = useState<string>("");
    const [activeDescription, setActiveDescription] = useState<string | null>(null)
    const [answererData, setAnswererData] = useState<AnswererData | null>(null);

    useEffect( () => {
        const fetchAnswererData = async () => {
            const result = await fetch(`/api/questions/answerer/${serviceParam}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await result.json();
            setAnswererData(data.answerer_data);
        }

        fetchAnswererData()
    }, [serviceParam]);

    if (!serviceParam) {
        return <NotFound/>
    }

    //Проверяем есть ли такой сервис, как я додумался до этого
    const service = SERVICE_DATA.find((el) => el.href.slice(-1 * (serviceParam.length)) === serviceParam)

    if (!service) {
        return <NotFound/>
    }

    const handleSend = async () => {
        if (!questionValue || questionValue.trim().length <= 0) {
            return;
        }

        const response = await fetch('/api/questions', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ theme: serviceParam, text: questionValue })
        })

        if (response.ok) {
            setQuestionValue('');
        }
    }

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }

    return (
    <div className="min-h-screen bg-white font-sans mx-auto max-w-md lg:max-w-7xl">
        {/* Mobile Header */}
        <HeaderWithBackButton
            title={service.title}
            href="/"
            className="md:hidden"
        />

        <div className="px-4 py-4 lg:px-6 lg:py-8">
            {/* Desktop Title */}
            <h1 className="hidden lg:block text-2xl font-bold mb-8">{service.title}</h1>

            <div className="flex flex-col lg:flex-row-reverse lg:justify-between lg:gap-8">
                {/* Responsible Person Section */}
                <div className="lg:bg-gray-50 lg:p-6 lg:rounded-lg lg:w-1/3 xl:w-1/4">
                    <h2 className="text-xl font-bold mb-3 lg:mb-4">Ответственное лицо:</h2>

                    {/* Mobile Layout */}

                            <div className="md:hidden flex justify-between">
                                {
                                    answererData? (
                                        <>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <UserIcon className="w-5 h-5 text-[#e30613] mr-2" />
                                        <span className="text-base">{answererData.fio}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileIcon className="w-5 h-5 text-[#e30613] mr-2" />
                                        <span className="text-base">{answererData.job_title}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MailIcon className="w-5 h-5 text-[#e30613] mr-2" />
                                        <span className="text-base">{answererData.email}</span>
                                    </div>
                                </div>
                                <div className="w-28 h-32 bg-gray-200 rounded-md overflow-hidden">
                                    <Image
                                        width={160}
                                        height={192}
                                        src={answererData.photo_url}
                                        alt="Фото ответственного лица"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                        </>
                                    ) : <Loading/>}
                            </div>


                    {/* Desktop Layout */}

                    <div className="hidden lg:block">
                        {
                            answererData? (
                                <>
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-40 h-48 bg-gray-200 rounded-md overflow-hidden mb-4">
                                <Image
                                    width={160}
                                    height={192}
                                    src={answererData.photo_url}
                                    alt="Фото ответственного лица"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <UserIcon className="w-5 h-5 text-[#e30613] mr-3" />
                                <span className="text-base">{answererData.fio}</span>
                            </div>
                            <div className="flex items-center">
                                <FileIcon className="w-5 h-5 text-[#e30613] mr-3" />
                                <span className="text-base">{answererData.job_title}</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-5 h-5 text-[#e30613] mr-3" />
                                <span className="text-base">{answererData.email}</span>
                            </div>
                        </div>
                                </>
                            ) : <Loading/>}
                    </div>

                </div>


                {/* Main Content */}
                <div className="flex-1 lg:pr-8">
                    {/* About Department */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2 lg:mb-4">Об отделе:</h2>
                        <p className="text-base">{service.about}</p>
                    </div>

                    {/* Services */}
                    {service.children && (
                        <div>
                            <h2 className="text-xl font-bold mb-3 lg:mb-4">Сервисы:</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
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

                    {/* Feedback */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-3 lg:mb-4">Обратная связь:</h2>
                        <div className="space-y-4">
                <textarea
                    className="w-full h-32 lg:h-40 bg-white border border-[#a4a4a4] rounded-md px-4 py-3
                    text-black placeholder-[#a4a4a4] resize-none"
                    placeholder="Текст вопроса, проблемы..."
                    onChange={(e) => setQuestionValue(e.target.value)}
                    value={questionValue}
                />
                            <DefaultButton
                                content="Задать вопрос"
                                bg="#e30613"
                                onClick={handleSend}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <InfoWindow content={activeDescription}
                    onClose={closeTooltip}
        />
    </div>
)
}