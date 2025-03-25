import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HeaderWithBackButton({ title = "", href }: { title?: string; href: string }) {
    return (
        <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-200">
            <Link className="absolute left-4" href={href}>
                <ArrowLeft className="w-6 h-6 text-black" />
            </Link>
            <h1 className="text-[#e30613] text-xl font-bold leading-tight">{title}</h1>
        </div>
    )
}

