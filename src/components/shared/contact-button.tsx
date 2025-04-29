'use client';

import { Icon } from "@/components/ui/icons";
import Link from "next/link";
import { useState } from "react";

export default function ContactButton({
  title,
  href,
  Icon,
}: {
  title: string;
  href: string;
  Icon: Icon;
}) {
  const [isTouching, setIsTouching] = useState<boolean>(false);

  return (
    <Link
      href={href ? href : ""}
      className={`w-full h-[45px] bg-[#F5F5F5] flex items-center justify-between border-1 border-solid border-[#A4A4A4] rounded-[10px] mb-2 hover:bg-[#dfdfdf]
        transition-colors ease-in-out duration-300 cursor-pointer select-none
        ${isTouching ? "shadow-md" : ""}
        `}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => setIsTouching(false)}
      onTouchCancel={() => setIsTouching(false)}
    >
      <span className="pl-4 text-[16px]">{title}</span>
      <div className="h-[33px] w-[33px] flex items-center justify-center pr-2">
        <Icon className="text-[#6D6D6D]" />
      </div>
    </Link>
  );
}
