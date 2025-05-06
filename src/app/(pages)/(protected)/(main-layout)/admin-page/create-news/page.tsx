"use client";

import { AlertCircle, Check, ImageIcon, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import DefaultButton from "@/components/shared/buttons/button";
import { Input } from "@/components/ui/input";
import XButton from "@/components/shared/buttons/x-button";

interface FormData {
  title: string;
  content: string;
  images: File[];
}

export default function CreateNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);

      const newPreviews = newImages.map((file) => URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);

      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await fetch("/api/news-maker/news", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          title: "",
          content: "",
          images: [],
        });
        setImagePreviews([]);

        setTimeout(() => {
          router.push("/admin-page");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Произошла ошибка при создании новости");
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl">
      <div className="px-4 py-4 flex flex-col items-center border-b border-gray-200">
        <h1 className="text-xl font-bold">Создание новости</h1>
        <p className="text-sm text-gray-500">
          Заполните все обязательные поля и добавьте изображения
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-4 py-4 overflow-auto pb-20">
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            <span>Новость успешно создана!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Заголовок <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleTextChange}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded-md"
                placeholder="Введите заголовок новости"
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-1"
              >
                Содержание <span className="text-[#e30613]">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleTextChange}
                required
                rows={6}
                className="w-full p-2 border border-gray-300 bg-white rounded-md resize-none"
                placeholder="Введите текст новости"
              />
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Изображения
              </label>

              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="hidden"
              />

              <div className="grid grid-cols-3 gap-2 mb-3">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border border-gray-300"
                  >
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <XButton
                      onClick={() => removeImage(index)}
                      className={
                        "absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                      }
                    />
                  </div>
                ))}
                <div onClick={(e) => e.preventDefault()}>
                  <DefaultButton
                    content="Добавить"
                    bg={"#b6b6b6"}
                    onClick={triggerFileInput}
                    className="aspect-square rounded-md border-2 border-dashed border-white flex flex-col items-center justify-center text-s mt-1"
                  />
                </div>
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <DefaultButton
                  content="Загрузить изображения"
                  bg={"#b6b6b6"}
                  onClick={triggerFileInput}
                  className="w-full py-2 border rounded-md flex items-center justify-center gap-2"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <DefaultButton
              content="Опубликовать новость"
              bg={"#e30613"}
              onClick={() => handleSubmit}
              className="w-full py-4 bg-[#e30613] text-white rounded-md font-medium disabled:opacity-70"
            />
          </div>

          <div className="pt-2" onClick={(e) => e.preventDefault()}>
            <DefaultButton
              content="Отмена"
              bg={"#b6b6b6"}
              onClick={() => router.push("/admin-page")}
              className="block w-full py-4 rounded-md font-medium text-center"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
