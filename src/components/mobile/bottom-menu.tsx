import Link from "next/link";

import BottomMenuButton from "@/components/mobile/bottom-menu-icon";
import {BOTTOM_MENU_BUTTONS_DATA} from "@/constants/bottom-menu-buttons";


export default function BottomMenu({selected} : {selected: string}) {

    return (
        <div className="sticky bottom-0 border-t border-[#f5f5f5] bg-white">
            <div className="flex justify-between items-center px-6 py-3">
                {
                    BOTTOM_MENU_BUTTONS_DATA.slice(0, 2).map((data) => (
                        <BottomMenuButton
                            key={data.title}
                            title={data.title}
                            href={data.href}
                            selected={data.href == selected}
                            Icon={data.Icon}
                        />
                    ))
                }
                <Link href="/map" className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full border-2 border-[#e30613] flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#e30613]"></div>
                    </div>
                </Link>
                {
                    BOTTOM_MENU_BUTTONS_DATA.slice(2, 4).map((data) => (
                        <BottomMenuButton
                            key={data.title}
                            title={data.title}
                            href={data.href}
                            selected={data.href == selected}
                            Icon={data.Icon}
                        />
                    ))
                }
            </div>
        </div>
    )
}