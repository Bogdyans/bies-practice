import {NotificationType} from "@/types/notifications";

export const fetchNotifications = async (): Promise<NotificationType[]> => {
    const response = await fetch('/api/notifications', {
        headers: {
            "Content-Type": "application/json",
        }
    })

    const data = await response.json();
    return data.notifications;
}

export const deleteNotification = async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/notifications`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id})
    })

    return response.ok;
}

export const markAsRead = async (id: number): Promise<boolean> => {
    const response = await fetch(`/api/notifications`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({id})
    })

    return response.ok;
}