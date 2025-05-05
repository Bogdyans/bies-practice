import db from "@/lib/db";
import NewsModel from "@/models/news";
import {v4 as uuidv4} from "uuid";
import path from "path";
import {writeFile} from "fs/promises";
import pool from "@/lib/db";
import UserModel from "@/models/user";


export default class NewsController {
    static async getNewsById(user_id: number, news_id: number) {
        const client = await pool.connect();

        try {
            const org_id = await UserModel.getOrganizationForUser(client, user_id);
            const newsData = await NewsModel.findNewsById(client, news_id);


            if (newsData.organization_id !== org_id) {
                throw new Error('This news is not for you');
            }

            return newsData;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getNews(userId: number, limit: number, offset: number) {
        const client = await db.connect()

        try {
            const total = await NewsModel.getNewsCountForOrganization(client, userId);
            const news = await NewsModel.getNews(client, userId, limit, offset);

            return { news, total };
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async createNews(authorId: number, title: string, text: string, images: File[]) {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'news');

        const imagePaths: string[] = [];

        for (const image of images) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const ext = image.name.split('.').pop();
            const filename = `${uuidv4()}.${ext}`;

            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);

            imagePaths.push(`/uploads/news/${filename}`);
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');
            await NewsModel.createNewNews(client, authorId, title, text, imagePaths);
            await client.query("COMMIT");
        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            client.release();
        }
    }
}