import Link from "next/link";
import {FileText, Home, Phone, User} from "lucide-react";


export default function BottomMenu() {
    return (
        <div className="sticky bottom-0 border-t border-[#f5f5f5] bg-white">
            <div className="flex justify-between items-center px-6 py-3">
                <Link href="/" className="flex flex-col items-center">
                    <Home className="w-6 h-6 text-[#e30613]"/>
                    <span className="text-xs text-[#e30613]">Главная</span>
                </Link>
                <Link href="/documents" className="flex flex-col items-center">
                    <FileText className="w-6 h-6 text-[#3f3f3f]"/>
                    <span className="text-xs">Документы</span>
                </Link>
                <Link href="/main-menu" className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e30613] flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#e30613]"></div>
                    </div>
                </Link>
                <Link href="/directory" className="flex flex-col items-center">
                    <Phone className="w-6 h-6 text-[#3f3f3f]"/>
                    <span className="text-xs">Справочник</span>
                </Link>
                <Link href="/profile" className="flex flex-col items-center">
                    <User className="w-6 h-6 text-[#3f3f3f]"/>
                    <span className="text-xs">Профиль</span>
                </Link>
            </div>
            <div className="h-1 w-1/5 mx-auto bg-black rounded-full mb-2"></div>
        </div>
    )
}