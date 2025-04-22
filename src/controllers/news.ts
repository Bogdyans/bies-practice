import db from "@/lib/db";
import NewsModel from "@/models/news";


export default class NewsController {
    static async getNews(userId: number, limit: number, offset: number) {
        const client = await db.connect()

        try {
            const news = await NewsModel.getNews(client, userId, limit, offset);

            return news;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}