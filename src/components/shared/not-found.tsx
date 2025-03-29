'use client'

import DefaultButton from "@/components/shared/buttons/button";
import {useRouter} from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[82vh] text-center px-4">
        <h2 className="text-3xl font-bold mb-4">404 - Страницы Нет</h2>
    <p className="text-lg mb-6">Данного сервиса не было найдено</p>
    <DefaultButton
        content="Вернуться"
        bg="#e30613"
        onClick={() => router.push('/')}
        className="max-w-84"
    />
    </div>
)
}

