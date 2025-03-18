'use client'

import darkenColor from "@/utils/funcs/darkenColor";
import { useState } from "react";

export default function DefaultButton(
        { content, bg, onClick, className }
        :
        { content: string, bg: string, onClick: () => void, className?: string }
) {
    const [isBgDarker, setIsBgDarker] = useState<boolean>(false);
    const hoverBg = darkenColor(bg, 20);

    return (
        <button
            className={`w-full cursor-pointer text-white py-4 rounded-lg font-medium transition-colors
                        ${className || ""}
                      `}
            style={{
                backgroundColor: isBgDarker ? hoverBg : bg,
                transition: "background-color 0.2s ease-in-out"
            }}
            onClick={onClick}

            onTouchStart={() => setIsBgDarker(true)}
            onTouchEnd={() => setIsBgDarker(false)}
            onTouchCancel={() => setIsBgDarker(false)}

            onMouseEnter={() => setIsBgDarker(true)}
            onMouseLeave={() => setIsBgDarker(false)}
        >
            {content}
        </button>
    );
}