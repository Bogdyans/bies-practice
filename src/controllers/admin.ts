import {NextResponse} from "next/server";
import db from "@/lib/db";
import UserModel from "@/models/user";

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

export default class AdminController {
    static async createUser(data: NewUserData): Promise<boolean> {
        const client = await db.connect()

        try {
            await client.query("BEGIN")
            const newUserId = await UserModel.createUserWithProfile(client, data);
            await client.query("COMMIT");

            return true;
        } catch (err) {
            await client.query("ROLLBACK");

            console.error("Ошибка при создании пользователя:", err);

            throw Error("Error creating new user")
        } finally {
            client.release();
        }
    }
}