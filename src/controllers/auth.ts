import pool from "@/lib/db";
import UserModel from "@/models/user";
import bcrypt from "bcryptjs";
import Jwt from "@/lib/jwt";


export default class AuthController {
    static async login(login: string, password: string) {
        const client = await pool.connect();

        if (!login || !password) {
            throw new Error('Username and password are required');
        }

        let user;
        try {
            try {
                user = await UserModel.findByUsername(client, login);
            } catch {
                throw new Error('Error finding user');
            }

            if (!user || !(await bcrypt.compare(password, user.password_hash))) {
                throw new Error("Invalid username or password");
            }

            return await Jwt.getNewSignJwt(user.login, user.id);
        } finally {
            client.release();
        }
    }
}