import Image from "next/image";
import {useState, useEffect} from "react";

export default function NewsTitle(
        {title, date, photos}
        :
        { title: string, date: string, photos: { url: string, caption?: string }[] }
) {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isTouching, setIsTouching] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photos.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [photos.length]);

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
                <h3 className="font-medium mb-1 cursor-pointer">{title}</h3>
                <div className="flex justify-between items-center text-[#a4a4a4] text-sm">
                    <span className="cursor-pointer hover:text-[#e30613] hover:drop-shadow-md transition-all duration-300">Читать далее</span>
                    <span className="select-none">{date.slice(0, 10)}</span>
                </div>
            </div>
            <div className="w-full h-48 relative overflow-hidden">
                <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
                    {photos.map((photo, index) => (
                        <div key={index} className="w-full h-48 flex-shrink-0 relative">
                            <Image
                                src={photo.url}
                                alt={photo.url}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-xs rounded select-none">
                    Фото: {currentImageIndex + 1} из {photos.length}
                </div>
            </div>
        </div>
    )
}