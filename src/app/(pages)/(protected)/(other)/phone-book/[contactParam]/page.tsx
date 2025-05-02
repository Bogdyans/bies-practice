"use client";

import { UserIcon, PhoneIcon, MailIcon, FileIcon, FolderIcon, GlobeIcon, LocationIcon, MessageIcon } from "@/components/ui/icons";
import Image from "next/image";
import { useState, useEffect } from 'react';
import {Contact} from "@/types/contact";
import {useParams} from "next/navigation";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Contact | null>(null);
  const { contactParam } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      const response = await fetch(`/api/contacts/${contactParam}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setProfileData(data.profileData)
    }

    fetchProfileData()
  }, [])

  if (!profileData) {
    return <div className="min-h-screen p-4 md:max-w-7xl md:mx-auto"> </div>
  }

  return (
      <div className="min-h-screen p-4 md:max-w-7xl md:mx-auto">
        <div className="flex justify-between ">
          <div className="space-y-[9px]">

            {/* Profile Information */}
            <div className="flex items-center gap-[5px]">
              <UserIcon className="w-[16px] h-[16px] text-[#e30613] md:hidden"/>
              {/* <User className="w-5 h-5 text-[#e30613]" /> */}
              <span className="text-black md:text-2xl">{profileData.fio}</span>
            </div>

            <div className="flex items-center gap-[5px]  md:text-lg">
              {/* <Phone className="w-5 h-5 text-[#e30613]" /> */}
              <PhoneIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">{profileData.phone_number}</span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <MailIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">{profileData.email}</span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <FileIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">Должность: {profileData.job_title}</span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <FolderIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">Отдел: {profileData.otdel}</span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <GlobeIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">Организация: {profileData.organization}</span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <LocationIcon className="w-4 h-4 text-[#e30613]"/>
              {/* <MapPin className="w-5 h-5 text-[#e30613]" /> */}
              <span className="text-black">Размещение: {profileData.location}</span>
            </div>

            <div className="flex items-center gap-[5px] md:text-lg">
              <MessageIcon className="w-4 h-4 text-[#e30613]"/>
              <span className="text-black">Псевдоним: {profileData.pseudonim}</span>
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
  );
}
