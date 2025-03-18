import {X} from "lucide-react";
import {useEffect, useRef} from "react";
import DefaultButton from "@/components/shared/buttons/button";
import XButton from "@/components/shared/buttons/x-button";


export default function InfoWindow(
        {content, onClose}
        :
        { content: string | null, onClose: () => void }
){
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!content) return;

        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose()
            }
        };

        const handleEscapePress = (event) => {
            if (event.key === "Escape") {
                onClose()
            }
        };

        document.addEventListener("pointerdown", handleOutsideClick)
        document.addEventListener("keydown", handleEscapePress)


        return () => {
            document.removeEventListener('pointerdown', handleOutsideClick)
            document.removeEventListener('keydown', handleEscapePress)
        };

    }, [content, onClose])

    if (!content) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" >
            <div className="bg-white rounded-lg p-4 max-w-sm w-full relative" ref={modalRef}>
                <XButton onClick={onClose} className="absolute top-4 right-4 p-1"/>

                <h3 className="font-bold text-lg mb-2">Информация</h3>

                <p className="my-3">{content}</p>

                <DefaultButton
                    content={"Закрыть"}
                    bg={"#e30613"}
                    onClick={onClose}
                    className="mt-2 py-2 px-4 rounded-lg"
                />

            </div>
        </div>
    )
}