import {X} from "lucide-react";


export default function XButton(
        { onClick, className }
        :
        { onClick: () => void, className?: string }
){
    return (
        <button
            onClick={onClick}
            className={`ml-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-300 ${className} cursor-pointer`}
        >
            <X size={20} className="text-gray-500"/>
        </button>
    )
}