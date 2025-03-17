import Image from "next/image";
import {useState} from "react";


export default function NewsTitle(
        {title, date, photos}
        :
        { title: string, date: string, photos: string[] }
) {
    const [currentImage, setCurrentImage] = useState<string>(photos[0]);
    const [isTouching, setIsTouching] = useState<boolean>(false);

    return (
        <div className={`bg-[#f5f5f5] rounded-lg mb-4 overflow-hidden
                        hover:shadow-lg transition-shadow
                        ${isTouching ? "shadow-md" : ""}
                       `}
             onTouchStart={() => setIsTouching(true)}
             onTouchEnd={() => setIsTouching(false)}
             onTouchCancel={() => setIsTouching(false)}
        >
            <div className="p-4">
                <h3 className="font-medium mb-1">{title}</h3>
                <div className="flex justify-between items-center text-[#a4a4a4] text-sm">
                    <span>Читать далее</span>
                    <span>{date}</span>
                </div>
            </div>
            <div className="w-full h-48 relative">
                <Image src={currentImage} alt="Award ceremony" fill className="object-cover"/>
                <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-xs rounded">Фото: 1 из {photos.length}</div>
            </div>
        </div>
    )
}