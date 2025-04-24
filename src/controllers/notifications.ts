import pool from "@/lib/db";
import NotificationsModel from "@/models/notifications";


export default class NotificationsController {
    static async findAllForUser(userId: number) {
        const client = await pool.connect();

        try {
            const notifications = await NotificationsModel.findAllForUser(client, userId);
            return notifications;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async changeIsRead(userId: number, notificationId: number, newStatus: boolean) {
        const client = await pool.connect();

        try {
            const notificationsUserId = await NotificationsModel.getUserIdOfNotification(client, notificationId);
            if (notificationsUserId !== userId) //чекаем, что читает именно пользователь, которому принадлежит уведомление
                throw Error('no no no, mister fish, this is not your notification') //приведет к ошибке 500, что не правильно, но для безопасности норм в цеолм

            await NotificationsModel.changeIsRead(client, notificationId, newStatus)
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async delete(userId: number, notificationId: number) {
        const client = await pool.connect();

        try {
            const notificationsUserId = await NotificationsModel.getUserIdOfNotification(client, notificationId);
            if (notificationsUserId !== userId) //чекаем, что читает именно пользователь, которому принадлежит уведомление
                throw Error('no no no, mister fish, this is not your notification') //приведет к ошибке 500, что не правильно, но для безопасности норм в цеолм

            await NotificationsModel.delete(client, notificationId)
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}