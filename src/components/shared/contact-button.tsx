import { Icon } from "@/components/ui/icons";

export default function ContactButton({
  title,
  Icon,
}: {
  title: string;
  Icon: Icon;
}) {
  return (
    <div className="w-92.5 h-11.25 bg-[#F5F5F5] flex items-center justify-between border-[0.25px] border-solid border-[#A4A4A4] rounded-[10px] mb-2.25 hover:bg-[#dfdfdf] transition-colors ease-in-out duration-300 cursor-pointer select-none">
      <span className="pl-4 text-[16px]">{title}</span>
      <div className="h-8.25 w-8.25 flex items-center justify-center pr-2.5">
        <Icon className="text-[#6D6D6D]" />
      </div>
    </div>
  );
}
