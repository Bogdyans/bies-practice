import {Bell, Search} from "lucide-react";
import Image from "next/image";


export default function Header(){
    return (
        <header className="flex justify-between items-center px-4 py-3 border-b border-[#f5f5f5] ">
            <Image src="/media/icons/search.png" alt="search" width={33} height={33} />
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-12">
                     <Image src="/media/logo.png" alt="logo" width={151} height={58} />
                </div>
            </div>
            <Image src="/media/icons/notifications.png" alt="notifications" width={33} height={33} />
        </header>
    )
}