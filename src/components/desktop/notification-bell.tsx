"use client"

import {useEffect, useState} from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotificationsWindow from "./notifications-window"
import type { NotificationType } from "@/types/notifications"

export default function NotificationBell() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
    const [notifications, setNotifications] = useState<NotificationType[]>([])

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await fetch('/api/notifications', {
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const data = await response.json();
            setNotifications(data.notifications);
        }

        fetchNotifications()
    })

    const unreadCount = notifications.filter((n) => !n.is_read).length

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen)
    }

    const handleMarkAsRead = (id: number) => {
        setNotifications(
            notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }

    const handleDelete = (id: number) => {
        setNotifications(notifications.filter((notification) => notification.id !== id))
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
                <Bell className="h-5 w-5" />
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
