"use client"

import {useEffect, useState} from "react"
import { Check, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {NotificationType} from "@/types/notifications";
import {deleteNotification, fetchNotifications, markAsRead} from "@/utils/fetch/notifications";
import HeaderWithBackButton from "@/components/mobile/header-with-back-button";



export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationType[]>([])
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        const fetch = async () => {
            const notifications = await fetchNotifications();
            setNotifications(notifications);
        }

        fetch()
    }, [])

    const unreadCount = notifications.filter((n) => !n.is_read).length

    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab === "all") return true
        if (activeTab === "unread") return !notification.is_read
        return true
    })

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

    return (
        <div className="min-h-screen  bg-white">
            <div className="max-w-md mx-auto">
                <HeaderWithBackButton href='/' title="Уведомления" />

                {/* Tabs */}
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="px-4 pt-4">
                        <TabsList className="grid grid-cols-2 w-full">
                            <TabsTrigger value="all">Все</TabsTrigger>
                            <TabsTrigger value="unread">Новые ({unreadCount})</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="m-0">
                        <NotificationsList
                            notifications={filteredNotifications}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                        />
                    </TabsContent>

                    <TabsContent value="unread" className="m-0">
                        <NotificationsList
                            notifications={filteredNotifications}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function NotificationsList({
                               notifications,
                               onMarkAsRead,
                               onDelete,
                           }: {
    notifications: NotificationType[]
    onMarkAsRead: (id: number) => void
    onDelete: (id: number) => void
}) {
    if (notifications.length === 0) {
        return <div className="p-6 text-center text-gray-500">Нет уведомлений</div>
    }

    return (
        <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? "bg-gray-50" : ""}`}
                >
                    <div className="flex items-start">
                        {!notification.is_read && <span className="flex-shrink-0 mt-1.5 mr-2 h-2 w-2 rounded-full bg-[#e30613]" />}
                        <div className="flex-grow">
                            <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                            <div className="text-sm text-gray-500 mt-1 break-words whitespace-normal">{notification.message}</div>
                            <div className="text-xs text-gray-400 mt-2">{formatTimeAgo(notification.time)}</div>
                        </div>
                        <div className="flex flex-shrink-0 ml-2 space-x-1">
                            {!notification.is_read && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => onMarkAsRead(notification.id)}
                                    aria-label="Mark as read"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onDelete(notification.id)}
                                aria-label="Delete notification"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

// Helper function to format time
function formatTimeAgo(dateString: string) {
    try {
        const date = new Date(dateString)
        return formatDistanceToNow(date, { addSuffix: true })
    } catch {
        return dateString
    }
}
