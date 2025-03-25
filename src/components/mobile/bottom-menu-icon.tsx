import Link from "next/link";
import { Icon } from "@/components/ui/icons";

export default function BottomMenuButton({
  href,
  title,
  selected,
  Icon: IconComponent,
}: {
  href: string;
  title: string;
  selected: boolean;
  Icon: Icon;
}) {
  return (
    <Link href={href} className="flex flex-col items-center h-10 w-10">
      <IconComponent
        className={`w-6 h-6 ${selected ? "text-[#e30613]" : "text-[#3f3f3f]"} `}
      />
      <span className={`text-xs ${selected ? "text-[#e30613]" : ""}`}>
        {title}
      </span>
    </Link>
  );
}
