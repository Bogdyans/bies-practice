'use client'

import darkenColor from "@/utils/funcs/darkenColor";
import {useEffect, useState} from "react";


//Данная кнопка сама считает для себя затемнение при наведении
export default function DefaultButton(
    { content, bg, onClick, className }
        :
        { content: string, bg: string, onClick: () => void, className?: string }
) {
    const [hoverBg, setHoverBg] = useState<string>("")

    useEffect(() => {
        setHoverBg(darkenColor(bg, 10))
    }, [bg]);

    return (
        <button
            className={`w-full text-white bg-[${bg}] py-4 rounded-lg font-medium transition-colors ${className || ""}`}

            //Оно только так динамически работает, я хз что делать
            onClick={onClick}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = hoverBg)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bg)}
        >
            {content}
        </button>
    )
}