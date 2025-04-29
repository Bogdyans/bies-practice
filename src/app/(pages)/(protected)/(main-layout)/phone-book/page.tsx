import { SearchIcon, ArrowIcon } from "@/components/ui/icons";
import { CONTACTS_DATA } from "@/constants/mock/contacts-data";
import ContactButton from "@/components/shared/contact-button";

export default function PhoneBookPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto h-14 bg-[#F5F5F5] flex justify-center items-center border-1 border-solid border-[#A4A4A4] rounded-[10px]">
        <SearchIcon className="h-[22px] w-[22px] m-3 shrink-0 text-[#6D6D6D]" />
        <input
          type="text"
          placeholder="Поиск по справочнику"
          className="w-full border-none outline-none text-base bg-transparent text-[16px]"
        />
      </div>
      <div className="py-4 flex justify-center flex-col items-center">
        {CONTACTS_DATA.map((data) => (
          <ContactButton
            key={data.id}
            href={`/phone-book/${data.id}`}
            title={data.title}
            Icon={ArrowIcon}
          />
        ))}
      </div>
    </div>
  );
}
