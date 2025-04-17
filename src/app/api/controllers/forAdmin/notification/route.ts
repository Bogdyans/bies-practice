import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";
import { NotificationModel } from '@/app/api/models/role/maneger/addnotifications';
import db from "@/app/api/controllers/connect_to_bd/conectToBd";
import { verifyToken } from "@/app/api/utils/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await db.connect();
    
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: "Токен отсутствует. Доступ запрещен." });
        }
        const decoded = await verifyToken(token);
        if (!decoded?.id) {
            return res.status(401).json({ message: "Неверный токен" });
        }

        const userId = decoded.id;
        const userRoleResult = await client.query(
            'SELECT role_id FROM "User" WHERE id = $1',
            [userId]
        );
        if (userRoleResult.rows.length === 0) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }
        const roleId = userRoleResult.rows[0].role_id;
        if (roleId == 3) {
            return res.status(403).json({ message: 'Только администратор или менеджер может создовать,редачить' });
        }
        switch (req.method) {
            case 'GET':
                return await handleGet(req, res);
            case 'POST':
                return await handlePost(req, res);
            case 'PUT':
                return await handlePut(req, res);
            case 'DELETE':
                return await handleDelete(req, res);
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release();
    }
}
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    const { userId, limit, offset, unreadOnly } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const notifications = await NotificationModel.getByUserId(
            Number(userId),
            limit ? Number(limit) : 20,
            offset ? Number(offset) : 0,
            unreadOnly === 'true'
        );
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    const {
        user_id,
        title,
        message,
        notification_type,
        related_entity_type,
        related_entity_id
    } = req.body;

    if (!user_id || !title || !message || !notification_type) {
        return res.status(400).json({
            message: 'user_id, title, message and notification_type are required'
        });
    }

    try {
        const newNotification = await NotificationModel.create({
            user_id,
            title,
            message,
            notification_type,
            related_entity_type,
            related_entity_id
        });

        res.status(201).json(newNotification);
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Error creating notification' });
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    const { is_read } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    if (typeof is_read === 'undefined') {
        return res.status(400).json({ message: 'is_read field is required' });
    }

    try {
        const updatedNotification = await NotificationModel.updateReadStatus(Number(id), is_read);

        if (!updatedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json(updatedNotification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    try {
        const deletedNotification = await NotificationModel.delete(Number(id));

        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({
            message: 'Notification deleted successfully',
            deletedNotification
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Error deleting notification' });
    }
}