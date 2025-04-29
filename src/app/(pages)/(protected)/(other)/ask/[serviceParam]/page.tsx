'use client'

import {useParams} from "next/navigation";
import {SERVICE_DATA} from "@/constants/service-data";
import React, {useState} from "react";
import NotFound from "@/components/shared/not-found";
import {useMobile} from "@/hooks/use-mobile";
import DesktopAskPage from "@/components/desktop/pages-content/ask";
import MobileAskPage from "@/components/mobile/pages-content/ask";
import InfoWindow from "@/components/shared/info-window";

export default function AskPage() {
    const isMobile = useMobile()
    const {serviceParam} = useParams()
    const [questionValue, setQuestionValue] = useState<string | null>(null);
    const [activeDescription, setActiveDescription] = useState<string | null>(null)

    if (!serviceParam) {
        return <NotFound/>
    }

    //Проверяем есть ли такой сервис, как я додумался до этого
    const service = SERVICE_DATA.find((el) => el.href.slice(-1 * (serviceParam.length)) === serviceParam)

    if (!service) {
        return <NotFound/>
    }

    const handleSend = () => {
        if (!questionValue || questionValue.trim().length <= 0) {
            return <NotFound/>
        }
    }

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }

    return <>
        {!isMobile ?
            <DesktopAskPage
                service={service}
                showTooltip={showTooltip}
                setQuestionValue={setQuestionValue}
                handleSend={handleSend}
            />
            :
            <MobileAskPage
                service={service}
                showTooltip={showTooltip}
                setQuestionValue={setQuestionValue}
                handleSend={handleSend}
            />
        }
        <InfoWindow content={activeDescription}
                    onClose={closeTooltip}
        />
    </>
}