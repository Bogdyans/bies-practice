"use client"

import { useState } from "react"
import { Check, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { NotificationType } from "@/types/notifications"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function NotificationsWindow({
                                                isNotificationsOpen,
                                                notifications,
                                                onClose,
                                                onMarkAsRead,
                                                onDelete,
                                            }: {
    isNotificationsOpen: boolean
    notifications: NotificationType[]
    onClose: () => void
    onMarkAsRead: (id: number) => void
    onDelete: (id: number) => void
}) {
    const [activeTab, setActiveTab] = useState("all")

    // Count unread notifications
    const unreadCount = notifications.filter((n) => !n.is_read).length

    // Filter notifications based on active tab
    const filteredNotifications = notifications.filter((notification) => {
        if (activeTab === "all") return true
        if (activeTab === "unread") return !notification.is_read
        return true
    })

    if (!isNotificationsOpen) return null

    return (
        <div
            className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
            role="dialog"
            aria-labelledby="notifications-title"
        >
            <div className="p-4 border-b border-gray-200">
                <h3 id="notifications-title" className="font-semibold text-lg">
                    Уведомления
                </h3>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-2 pt-2">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="all">Все</TabsTrigger>
                        <TabsTrigger value="unread">Новые ({unreadCount})</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all" className="m-0">
                    <NotificationsList notifications={filteredNotifications} onMarkAsRead={onMarkAsRead} onDelete={onDelete} />
                </TabsContent>

                <TabsContent value="unread" className="m-0">
                    <NotificationsList notifications={filteredNotifications} onMarkAsRead={onMarkAsRead} onDelete={onDelete} />
                </TabsContent>
            </Tabs>

            <div className="p-2 text-center border-t border-gray-200">

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
        return <div className="p-4 text-center text-gray-500">No notifications</div>
    }

    return (
        <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${
                        !notification.is_read ? "bg-gray-50" : ""
                    }`}
                >
                    <div className="flex items-start">
                        {!notification.is_read && <span className="flex-shrink-0 mt-1.5 mr-2 h-2 w-2 rounded-full bg-blue-500" />}
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
                                    className="h-6 w-6"
                                    onClick={() => onMarkAsRead(notification.id)}
                                    aria-label="Mark as read"
                                >
                                    <Check className="h-3 w-3" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => onDelete(notification.id)}
                                aria-label="Delete notification"
                            >
                                <Trash2 className="h-3 w-3" />
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
    } catch (error) {
        return dateString
    }
}
