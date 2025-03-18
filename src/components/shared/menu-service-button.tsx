"use client"

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";


export default function MenuServiceButton(
        { title, description, iconPath, href, showDesc }
        :
        { title: string, description: string, iconPath: string, href: string, showDesc: (arg0: string) => void }
) {
    const [isTouching, setIsTouching] = useState<boolean>(false);

    const handleInfoClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        showDesc(description)
    }


    return (
        <Link
            className={`bg-[#f5f5f5] rounded-lg p-4 relative h-24 w-full text-left
                       hover:shadow-md transition-shadow
                       ${isTouching ? "shadow-md" : ""}
                      `}
            href={href}
            onTouchStart={() => setIsTouching(true)}
            onTouchEnd={() => setIsTouching(false)}
            onTouchCancel={() => setIsTouching(false)}
        >
            <div className="font-medium">{title}</div>


            {
                iconPath.trim().length > 0? (
                    <div className="absolute bottom-8 right-2">
                        <Image
                            src={iconPath}
                            alt="icon"
                            width={60}
                            height={30}
                            className="text-[#1dbcff]"
                        />
                    </div>
                ) : null
            }


            {
                description.trim().length > 0 ? (
                        <button
                            className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-2 border-[#bbbbbb] flex items-center justify-center text-[#bbbbbb]
                                       hover:border-[#e30613] hover:text-[#e30613] transition-colors
                                       cursor-pointer
                                      "
                            onClick={handleInfoClick}
                        >
                            i
                        </button>
                    ) : null
            }

        </Link>
    )
}