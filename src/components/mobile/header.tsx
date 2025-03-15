import {Bell, Search} from "lucide-react";


export default function Header(){
    return (
        <div className="flex justify-between items-center px-4 py-3 border-b border-[#f5f5f5]">
            <Search className="w-6 h-6"/>
            <div className="flex flex-col items-center">
                <div className="relative w-32 h-8">
                    <div className="absolute w-full h-4 top-0">
                        <div className="relative w-full h-full">
                            <div className="absolute w-full h-1 bg-[#e30613] rounded-full top-1"></div>
                            <div
                                className="absolute w-3 h-3 bg-[#e30613] rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3"></div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 w-full text-center font-bold tracking-widest">ПРОМТЕХ</div>
                </div>
            </div>
            <Bell className="w-6 h-6"/>
        </div>
    )
}