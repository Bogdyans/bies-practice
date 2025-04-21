import {NextRequest, NextResponse} from "next/server";
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
}

export async function POST(req: NextRequest) {
    const userData: NewUserData = await req.json();

    try {
        const newUserId = await AdminController.createUser(userData);

        return NextResponse.json({ message: "Пользователь создан", userId: newUserId }, { status: 201 });
    } catch (err) {
        
        return NextResponse.json({ message: "Ошибка при создании пользователя" }, { status: 500 });
    }

}