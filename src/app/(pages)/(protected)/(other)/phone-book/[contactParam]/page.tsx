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
      <HeaderWithBackButton title="Контакт" href="/phone-book" />
      <div className="min-h-screen p-4">
        <div className="flex justify-between">
          <div className="space-y-[9px]">
            {/* Profile Information */}
            <div className="flex items-center gap-[5px]">
              <UserIcon className="w-[16px] h-[16px] text-[#e30613]" />
              {/* <User className="w-5 h-5 text-[#e30613]" /> */}
              <span className="text-black">Фамилия Имя Отчество</span>
            </div>

            <div className="flex items-center gap-[5px]">
              {/* <Phone className="w-5 h-5 text-[#e30613]" /> */}
              <PhoneIcon className="w-[16px] h-[16px] text-[#e30613]" />
              <span className="text-black">Служебный телефон</span>
            </div>

            <div className="flex items-center gap-[5px]">
              <MailIcon className="w-[16px] h-[16px] text-[#e30613]" />
              <span className="text-black">Почта</span>
            </div>

            <div className="flex items-center gap-[5px]">
              <FileIcon className="w-[16px] h-[16px] text-[#e30613]" />
              <span className="text-black">Должность</span>
            </div>

            <div className="flex items-center gap-[5px]">
              <FolderIcon className="w-[16px] h-[16px] text-[#e30613]" />
              <span className="text-black">Отдел</span>
            </div>

            <div className="flex items-center gap-[5px]">
              <GlobeIcon className="w-[16px] h-[16px] text-[#e30613]" />
              <span className="text-black">Организация</span>
            </div>

            <div className="flex items-center gap-[5px]">
              <LocationIcon className="w-[16px] h-[16px] text-[#e30613]" />
              {/* <MapPin className="w-5 h-5 text-[#e30613]" /> */}
              <span className="text-black">Размещение</span>
            </div>

            <div className="flex items-center gap-[5px]">
              <MessageIcon className="w-[16px] h-[16px] text-[#e30613]" />
              <span className="text-black">Псевдоним</span>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="w-32 h-40 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=160&width=128"
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
