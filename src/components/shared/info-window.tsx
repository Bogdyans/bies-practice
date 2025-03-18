import {X} from "lucide-react";


export default function InfoWindow(
        {content, onClose}
        :
        { content: string | null, onClose: () => void }
){
    if (!content) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 p-1">
                    <X className="w-5 h-5"/>
                </button>
                <h3 className="font-bold text-lg mb-2">Информация</h3>
                <p>{content}</p>
                <button onClick={onClose} className="mt-4 bg-[#e30613] text-white py-2 px-4 rounded-lg w-full">
                    Закрыть
                </button>
            </div>
        </div>
    )
}