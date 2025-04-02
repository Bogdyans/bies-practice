import { SearchIcon, ArrowIcon } from "@/components/ui/icons";
import { CONTACTS_DATA } from "@/constants/mock/contacts-data";
import ContactButton from "@/components/shared/contact-button";

export default function PhoneBookPage() {
  return (
    <div className="min-h-screen">
      <div className="mt-8.5 mx-auto w-92.5 h-14 bg-[#F5F5F5] flex justify-center items-center border-[0.25px] border-solid border-[#A4A4A4] rounded-[10px]">
        <SearchIcon className="h-5.5 w-5.5 p-1.375 m-3 shrink-0 text-[#6D6D6D]" />
        <input
          type="text"
          placeholder="Поиск по справочнику"
          className="w-full border-none outline-none text-base bg-transparent text-[16px]"
        />
      </div>
      <div className="mt-4 flex justify-center flex-col items-center">
        {CONTACTS_DATA.map((data) => (
          <ContactButton key={data.title} title={data.title} Icon={ArrowIcon} />
        ))}
      </div>
    </div>
  );
}
