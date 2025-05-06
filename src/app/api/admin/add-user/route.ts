import { NextRequest, NextResponse } from "next/server";
import AdminController from "@/controllers/admin";

export interface NewUserData {
  login: string;
  password: string;
  role_id: number;
  fio: string;
  email: string;
  phone_number: string;
  job_title: string;
  otdel_id: number;
  location: string;
  pseudonim?: string;
  avatar?: File;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const userData: NewUserData = {
      login: formData.get("login") as string,
      password: formData.get("password") as string,
      role_id: Number(formData.get("role_id")),
      fio: formData.get("fio") as string,
      email: formData.get("email") as string,
      phone_number: formData.get("phone_number") as string,
      job_title: formData.get("job_title") as string,
      otdel_id: Number(formData.get("otdel_id")),
      location: formData.get("location") as string,
      pseudonim: formData.get("pseudonim") as string | undefined,
      avatar: formData.get("avatar") as File | undefined,
    };

    const newUserId = await AdminController.createUser(userData);

    return NextResponse.json(
      { message: "Пользователь создан", userId: newUserId },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Ошибка при создании пользователя" },
      { status: 500 }
    );
  }
}
