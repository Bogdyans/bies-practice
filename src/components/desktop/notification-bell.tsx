"use client"

import {useEffect, useState} from "react"
import { Button } from "@/components/ui/button"
import NotificationsWindow from "./notifications-window"
import type { NotificationType } from "@/types/notifications"
import {deleteNotification, fetchNotifications, markAsRead} from "@/utils/fetch/notifications";
import {BellIcon} from "@/components/ui/icons";

export default function NotificationBell() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [notifications, setNotifications] = useState<NotificationType[]>([])

    useEffect(() => {
        const fetch = async () => {
            const notifications = await fetchNotifications();
            setNotifications(notifications);
        }

        fetch()
    }, [])

    const unreadCount = notifications.filter((n) => !n.is_read).length

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen)
    }

    const handleMarkAsRead = async (id: number) => {
        const success = await markAsRead(id);

        if (success) {
            setNotifications(
                notifications.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)),
            )
        } else {
            console.error("Could not change notification status")
        }
    }

    const handleDelete = async (id: number) => {
        const success = await deleteNotification(id);

        if (success) {
            setNotifications(notifications.filter((notification) => notification.id !== id))
        } else {
            console.error("Could not delete notification")
        }
    }

    const handleClose = () => {
        setIsNotificationsOpen(false)
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleNotifications}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            >
                <BellIcon width={"100%"} height={"100%"} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
            {unreadCount}
          </span>
                )}
            </Button>

            <NotificationsWindow
                isNotificationsOpen={isNotificationsOpen}
                notifications={notifications}
                onClose={handleClose}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
            />
        </div>
    )
}
