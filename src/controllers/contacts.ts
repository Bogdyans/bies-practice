import ContactsModel from "@/models/contacts";
import pool from "@/lib/db";

interface getInterface {
    user_id: number;
    search_str?: string;
    limit: number;
    offset: number;
}

export default class ContactsController {


    static async getContacts(params: getInterface) {
        const client = await pool.connect();

        try {
            return await ContactsModel.get(params, client);
        } catch (error) {
            console.error('Database connection error:', error);

            throw Error("Failed to get contacts");
        } finally {
            client.release();
        }
    }
}