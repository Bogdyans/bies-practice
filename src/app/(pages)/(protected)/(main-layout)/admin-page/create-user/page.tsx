"use client";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultButton from "@/components/shared/buttons/button";
import { ImageIcon, X } from "lucide-react";
import XButton from "@/components/shared/buttons/x-button";

interface FormData {
  login: string;
  password: string;
  role_id: number | string;
  fio: string;
  email: string;
  phone_number: string;
  job_title: string;
  otdel_id: number | string;
  organization_id: number | string;
  location: string;
  pseudonim?: string;
  avatar?: File | null;
}

interface Organization {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
  organization_id: number;
}

interface Role {
  id: number;
  name: string;
}

export default function CreateUserPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<FormData>({
    login: "",
    password: "",
    role_id: "",
    fio: "",
    email: "",
    phone_number: "",
    job_title: "",
    otdel_id: "",
    organization_id: "",
    location: "",
    pseudonim: "",
    avatar: null,
  });
  const [roles, setRoles] = useState<Role[]>();
  const [organizations, setOrganizations] = useState<Organization[]>();
  const [departments, setDepartments] = useState<Department[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesRes = await fetch("/api/admin/fetch-info/roles", {
          method: "GET",
          headers: {
            "Content-Type": "aplication/json",
          },
          credentials: "include",
        });

        if (!rolesRes.ok) {
          throw new Error("Ошибка при получении ролей");
        }

        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles);

        const orgsRes = await fetch("/api/admin/fetch-info/organizations", {
          method: "GET",
          headers: {
            "Content-Type": "aplication/json",
          },
          credentials: "include",
        });

        if (!orgsRes.ok) {
          throw new Error("Ошибка при получении организаций");
        }

        const orgsData = await orgsRes.json();
        setOrganizations(orgsData.organizations);
      } catch (error) {
        console.error("Ошибка при загрузке организаций: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.organization_id == 0) return;
      try {
        const departmentsRes = await fetch(
          `/api/admin/fetch-info/departments?organization_id=${formData.organization_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "aplication/json",
            },
            credentials: "include",
          }
        );

        if (!departmentsRes.ok) {
          throw new Error("Ошибка при получении отделов");
        }

        const departmentsData = await departmentsRes.json();
        setDepartments(departmentsData.departments);
      } catch (error) {
        console.error("Ошибка при загрузке отделов: ", error);
      }
    };

    fetchDepartments();
  }, [formData.organization_id]);

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeAvatar = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(null);
    setFormData((prev) => ({
      ...prev,
      avatar: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      const numericFields = {
        role_id: Number(formData.role_id),
        otdel_id: Number(formData.otdel_id),
        organization_id: Number(formData.organization_id),
      };

      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "avatar" && value !== null && value !== undefined) {
          const finalValue =
            key in numericFields
              ? numericFields[key as keyof typeof numericFields].toString()
              : value.toString();
          formDataToSend.append(key, finalValue);
        }
      });

      if (formData.avatar) {
        formDataToSend.append("avatar", formData.avatar);
      }

      const response = await fetch("/api/admin/add-user", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarPreview(null);
        setFormData({
          login: "",
          password: "",
          role_id: 0,
          fio: "",
          email: "",
          phone_number: "",
          job_title: "",
          otdel_id: 0,
          organization_id: 0,
          location: "",
          pseudonim: "",
          avatar: null,
        });
        setTimeout(() => {
          router.push("/admin-page");
        }, 2000);
      } else {
        setError(data.message || "Произошла ошибка при создании пользователя");
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mx-auto max-w-7xl">
      <div className="px-4 py-4 flex items-center flex-col border-b border-gray-200">
        <h1 className="text-xl font-bold">Создание пользователя</h1>
        <p className="text-sm text-gray-500">Заполните все обязательные поля</p>
      </div>

      <div className="flex-1 px-4 py-4 overflow-auto">
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
            <span>Пользователь успешно создан!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-4">
            <div>
              <label htmlFor="login" className="block text-sm font-medium mb-1">
                Логин <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Пароль <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="role_id"
                className="block text-sm font-medium mb-1"
              >
                Роль <span className="text-[#e30613]">*</span>
              </label>
              <Select
                value={formData.role_id.toString()}
                onValueChange={(value) =>
                  handleChange({ target: { name: "role_id", value } })
                }
                required
              >
                <SelectTrigger id="role_id" className="w-full bg-white">
                  <SelectValue placeholder="Выберите роль" />
                </SelectTrigger>
                <SelectContent>
                  {roles?.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Аватар пользователя
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />

              <div className="flex items-center space-x-4">
                <div className="relative w-25 h-25 rounded-full overflow-hidden border border-gray-300 bg-white flex items-center justify-center">
                  {avatarPreview ? (
                    <>
                      <Image
                        src={avatarPreview || "/placeholder.svg"}
                        alt="Предпросмотр аватара"
                        fill
                        className="object-cover"
                      />
                      {/* <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute right-[10px] top-[10px] bg-white rounded-full p-1 shadow-md"
                      >
                        <X className="w-3 h-3 text-[#e30613]" />
                      </button> */}
                      <XButton
                        onClick={removeAvatar}
                        className="absolute right-[10px] top-[10px] bg-white rounded-full p-1 shadow-md text-[#e30613]"
                      />
                    </>
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                {/* <button
                  type="button"
                  onClick={triggerFileInput}
                  className="py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2 bg-white"
                >
                  <span>Загрузить фото</span>
                </button> */}
                <div onClick={(e) => e.preventDefault()}>
                  <DefaultButton
                    content="Загрузить фото"
                    bg={"#b6b6b6"}
                    onClick={triggerFileInput}
                    className="py-2 px-4 border border-gray-300 rounded-md flex items-center justify-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-4">
            <div>
              <label htmlFor="fio" className="block text-sm font-medium mb-1">
                ФИО <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="text"
                id="fio"
                name="fio"
                value={formData.fio}
                onChange={handleChange}
                required
                className="w-full p-2 border bg-white border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border bg-white border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium mb-1"
              >
                Телефон <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded-md"
              />
            </div>
          </div>

          <div className="bg-[#f5f5f5] rounded-lg p-4 space-y-4">
            <div>
              <label
                htmlFor="job_title"
                className="block text-sm font-medium mb-1"
              >
                Должность <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 bg-white rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="organization_id"
                className="block text-sm font-medium mb-1"
              >
                Организация <span className="text-[#e30613]">*</span>
              </label>
              <Select
                value={formData.organization_id.toString()}
                onValueChange={(value) => {
                  handleChange({ target: { name: "organization_id", value } });
                  setFormData((prev) => ({ ...prev, otdel_id: 0 }));
                }}
                required
              >
                <SelectTrigger id="organization_id" className="w-full bg-white">
                  <SelectValue placeholder="Выберите организацию" />
                </SelectTrigger>
                <SelectContent>
                  {organizations?.map((org) => (
                    <SelectItem key={org.id} value={org.id.toString()}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="otdel_id"
                className="block text-sm font-medium mb-1"
              >
                Отдел <span className="text-[#e30613]">*</span>
              </label>
              <Select
                value={formData.otdel_id.toString()}
                onValueChange={(value) =>
                  handleChange({ target: { name: "otdel_id", value } })
                }
                required
              >
                <SelectTrigger id="otdel_id" className="w-full bg-white">
                  <SelectValue placeholder="Выберите отдел" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-1"
              >
                Местоположение <span className="text-[#e30613]">*</span>
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-2 border bg-white border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="pseudonim"
                className="block text-sm font-medium mb-1"
              >
                Псевдоним
              </label>
              <Input
                type="text"
                id="pseudonim"
                name="pseudonim"
                value={formData.pseudonim}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 bg-white rounded-md"
              />
            </div>
          </div>

          <div className="pt-4">
            <DefaultButton
              content="Создать пользователя"
              bg={"#e30613"}
              onClick={() => handleSubmit}
              className="py-4 rounded-md font-medium"
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
