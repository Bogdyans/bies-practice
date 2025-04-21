"use client";

import HeaderWithBackButton from "@/components/mobile/header-with-back-button";
import Image from "next/image";
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  FileIcon,
  FolderIcon,
  GlobeIcon,
  LocationIcon,
  MessageIcon,
} from "@/components/ui/icons";

export default function ContactPage() {
  return (
    <>
      <HeaderWithBackButton title="Контакт" href="/phone-book" className="md:hidden"/>
      <div className="min-h-screen p-4 md:max-w-7xl md:mx-auto">
        <div className="flex justify-between ">
          <div className="space-y-[9px]">

            {/* Profile Information */}
            <div className="flex items-center gap-[5px]">
              <UserIcon className="w-[16px] h-[16px] text-[#e30613] md:hidden"/>
              {/* <User className="w-5 h-5 text-[#e30613]" /> */}
              <span className="text-black md:text-2xl">Фамилия Имя Отчество</span>
            </div>

            <div className="flex items-center gap-[5px]  md:text-lg">
              {/* <Phone className="w-5 h-5 text-[#e30613]" /> */}
              <PhoneIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">Служебный телефон: </span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <MailIcon className="w-[16px] h-[16px] text-[#e30613]"/>
              <span className="text-black">Почта: </span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <FileIcon className="w-[16px] h-[16px] text-[#e30613]"/>
              <span className="text-black">Должность: </span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <FolderIcon className="w-[16px] h-[16px] text-[#e30613]"/>
              <span className="text-black">Отдел: </span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <GlobeIcon className="w-[16px] h-[16px] text-[#e30613]"/>
              <span className="text-black">Организация: </span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <LocationIcon className="w-[16px] h-[16px] text-[#e30613]"/>
              {/* <MapPin className="w-5 h-5 text-[#e30613]" /> */}
              <span className="text-black">Размещение: </span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <MessageIcon className="w-[16px] h-[16px] text-[#e30613]"/>
              <span className="text-black">Псевдоним: </span>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="w-32 h-40 md:w-48 md:h-60 rounded-lg overflow-hidden md:mt-12">
            <Image
                src="/file.svg"
                alt="Profile Photo"
                width={128}
                height={160}
                className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </>
  );
}
