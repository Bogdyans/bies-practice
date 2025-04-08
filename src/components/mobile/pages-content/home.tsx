import {SERVICE_DATA} from "@/constants/service-data";
import MenuServiceButton from "@/components/shared/menu-service-button";
import DefaultButton from "@/components/shared/buttons/button";
import {NEWS_TITLE_DATA} from "@/constants/mock/news-title-data";
import NewsTitle from "@/components/shared/menu-news-title";
import InfoWindow from "@/components/shared/info-window";
import {useRouter} from "next/navigation";
import {useState} from "react";


export default function MobileHomePage() {
    const router = useRouter()
    const [activeDescription, setActiveDescription] = useState<string | null>(null)

    const showTooltip = (description: string) => {
        setActiveDescription(description)
    }

    const closeTooltip = () => {
        setActiveDescription(null)
    }


    return (
        <>
            <div className="grid grid-cols-2 gap-4 p-4">
                {SERVICE_DATA.map((data) => (
                    <MenuServiceButton
                        key={data.title}
                        title={data.title}
                        description={data.description}
                        iconPath={data.iconPath}
                        showDescription={showTooltip}
                        href={data.href}
                    />
                ))}
            </div>

            {/* Action Buttons */}
            <div className="px-4 space-y-3 mb-6">
                <DefaultButton
                    content={'Гид нового сотрудника'}
                    bg={"#e30613"}
                    onClick={() => router.push("/guide")}
                />
                <DefaultButton
                    content={'Мне только спросить!'}
                    bg={"#b6b6b6"}
                    onClick={() => router.push("/ask")}
                />
            </div>

            {/* News Section */}
            <div className="px-4 mb-4 flex-grow">
                <h2 className="text-xl font-bold mb-4">Новости и анонсы</h2>

                {
                    NEWS_TITLE_DATA.map((data) => (
                        <NewsTitle
                            key={data.title}
                            title={data.title}
                            date={data.date}
                            photos={data.photos}
                        />
                    ))
                }
                {/* Info Tooltip/Modal */}
                <InfoWindow content={activeDescription}
                            onClose={closeTooltip}
                />
            </div>
        </>
    )
}