import Link from "next/link";


export default function BottomMenuButton(
        {href, title, selected, Icon}
        :
        {href: string, title: string, selected: boolean, Icon: React.ElementType }
) {
    return (
        <Link href={href} className="flex flex-col items-center">
            <Icon className={`w-6 h-6 ${ selected ? 'text-[#e30613]' : 'text-[#3f3f3f]'} `}/>
            <span className={`text-xs ${ selected ? 'text-[#e30613]' : ''}`}>{title}</span>
        </Link>
    )
}