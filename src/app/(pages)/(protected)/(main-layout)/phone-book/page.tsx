'use client'

import { SearchIcon, ArrowIcon } from "@/components/ui/icons";
import ContactButton from "@/components/shared/contact-button";
import {useEffect, useState} from "react";
import {ContactForList} from "@/types/contact";

export default function PhoneBookPage() {
   const [contacts, setContacts] = useState<ContactForList[]>([]);

   useEffect(() => {
       const fetchData = async () => {
           const response = await fetch('/api/contacts', {
               headers: {
                   'Content-Type': 'application/json'
               }
           })

           const data = await response.json();
           setContacts(data.contacts);
       }

       fetchData()
   }, [])


   return (
    <div className="md:container md:mx-auto md:px-6 md:py-8 md:max-w-7xl">
      <div className="mx-auto h-14 bg-[#F5F5F5] flex justify-center items-center border-1 border-solid border-[#A4A4A4] rounded-[10px]">
        <SearchIcon className="h-[22px] w-[22px] m-3 shrink-0 text-[#6D6D6D]" />
        <input
          type="text"
          placeholder="Поиск по справочнику"
          className="w-full border-none outline-none text-base bg-transparent text-[16px]"
        />
      </div>
      <div className="py-4 flex justify-center flex-col items-center">
        {contacts.map((data) => (
          <ContactButton
            key={data.id}
            href={`/phone-book/${data.id}`}
            title={data.fio}
            Icon={ArrowIcon}
          />
        ))}
      </div>
    </div>
  );
}
