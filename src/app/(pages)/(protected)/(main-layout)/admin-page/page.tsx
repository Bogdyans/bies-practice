import ContactButton from "@/components/shared/contact-button";
import { ArrowIcon } from "@/components/ui/icons";

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <div className="px-4 py-4 flex items-center flex-col border-b border-gray-200">
        <h1 className="text-xl font-bold">Панель администрации</h1>
        <p className="text-sm text-gray-500">Выберите нужную функцию</p>
      </div>
      <div className="py-4 flex justify-center flex-col items-center mx-50">
        <ContactButton
          href={"/admin-page/create-news"}
          title={"Панель создания новостей"}
          Icon={ArrowIcon}
        />
        <ContactButton
          href={"/admin-page/create-user"}
          title={"Панель создания пользователей"}
          Icon={ArrowIcon}
        />
      </div>
    </div>
  );
}
