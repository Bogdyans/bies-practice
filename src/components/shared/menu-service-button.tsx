import Image from "next/image";


export default function MenuServiceButton(
        { title, description, iconPath, showDesc }
        :
        { title: string, description: string, iconPath: string, showDesc: (arg0: string) => void }
) {
    return (
        <button
            onClick={() => handleCategoryClick("training")}
            className="bg-[#f5f5f5] rounded-lg p-4 relative h-24 w-full text-left"
        >
            <div className="font-medium">{title}</div>


            {
                iconPath.trim().length > 0?
                (
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
                description.trim().length > 0 ?
                    (
                        <button
                            className="absolute bottom-2 right-2 w-6 h-6 rounded-full border border-[#bbbbbb] flex items-center justify-center text-[#bbbbbb]"
                            onClick={(e) => {
                                e.stopPropagation()
                                showDesc(description)
                            }}
                        >
                            i
                        </button>
                    ) : null
            }

        </button>
    )
}