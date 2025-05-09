import UserModel from "@/models/user";
import pool from "@/lib/db";
import path from "path";
import fs from "fs/promises";

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

export default class AdminController {
  static async createUser(data: NewUserData): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      let photoUrl: String | null = null;
      if (data.avatar) {
        photoUrl = await this.saveAvatar(data.avatar);
      }

      if (!photoUrl) {
        throw new Error("Ошибка при загрузки аватарки");
      }
      await UserModel.createUserWithProfile(client, { ...data, photoUrl });
      await client.query("COMMIT");

      return true;
    } catch (err) {
      await client.query("ROLLBACK");

      console.error("Ошибка при создании пользователя:", err);

      throw Error("Error creating new user");
    } finally {
      client.release();
    }
  }

  private static async saveAvatar(avatarFile: File): Promise<String> {
    try {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "avatars"
      );
      await fs.mkdir(uploadDir, { recursive: true });

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = avatarFile.name.split(".").pop();
      const filename = `avatar-${uniqueSuffix}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await fs.writeFile(filePath, buffer);

      return `/uploads/avatars/${filename}`;
    } catch (error) {
      console.error("Ошибка при сохранении аватарки: ", error);
      throw new Error("Failed to save avatar");
    }
  }
}
