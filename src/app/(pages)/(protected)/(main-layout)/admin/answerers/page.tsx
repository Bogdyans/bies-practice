"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Organization {
    id: string
    name: string
}

interface User {
    id: string
    name: string
    position: string
    email: string
    photo_url?: string
}

interface Theme {
    id: string
    name: string
    responsible_person_id: string
}

export default function AssignResponsiblePage() {
    const [organizations, setOrganizations] = useState<Organization[]>([])
    const [selectedOrganization, setSelectedOrganization] = useState<string>("")
    const [themes, setThemes] = useState<Theme[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingThemes, setLoadingThemes] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)

    // Fetch organizations on component mount
    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true)
            try {
                const response = await fetch("/api/admin/fetch-info/organizations")
                const data = await response.json()
                setOrganizations(data.organizations)
            } catch (error) {
                console.error("Failed to fetch organizations:", error)
                toast.error("Не удалось загрузить список организаций")
            } finally {
                setLoading(false)
            }
        }

        fetchOrganizations()
    }, [])

    // Fetch themes when organization is selected
    useEffect(() => {
        if (!selectedOrganization) return

        const fetchThemes = async () => {
            setLoadingThemes(true)
            try {
                const response = await fetch(`/api//themes?organizationId=${selectedOrganization}`)
                const responseUsers = await fetch(`/api/admin/fetch-info/users?organizationId=${selectedOrganization}`)
                const data = await response.json()
                const dataUsers = await responseUsers.json()
                setThemes(data.themes)
                setUsers(dataUsers.users)
            } catch (error) {
                console.error("Failed to fetch themes:", error)
                toast.error("Не удалось загрузить список тем")
            } finally {
                setLoadingThemes(false)
            }
        }

        fetchThemes()
    }, [selectedOrganization])

    // Handle changing responsible person
    const handleChangeResponsible = async (themeId: string, userId: string) => {
        try {
            const response = await fetch("/api/admin/answerer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    themeId,
                    userId,
                    organizationId: selectedOrganization,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to update responsible person")
            }

            // Update local state
            setThemes(themes.map((theme) => (theme.id === themeId ? { ...theme, responsible_person_id: userId } : theme)))

            toast.success("Ответственное лицо обновлено")
        } catch (error) {
            console.error("Failed to update responsible person:", error)
            toast.error("Не удалось обновить ответственное лицо")
        }
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-medium text-center">Назначение ответственных лиц</h1>
            <p className="text-center text-gray-500 mt-2 mb-8">Выберите организацию и назначьте ответственных лиц для тем</p>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-lg font-medium mb-2">
                    Организация <span className="text-red-500">*</span>
                </h2>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between bg-white border-gray-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Загрузка...</span>
                                </div>
                            ) : selectedOrganization ? (
                                organizations.find((org) => org.id === selectedOrganization)?.name || "Выберите организацию"
                            ) : (
                                "Выберите организацию"
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <Command>
                            <CommandInput placeholder="Поиск организации..." />
                            <CommandList>
                                <CommandEmpty>Организации не найдены</CommandEmpty>
                                <CommandGroup>
                                    {organizations.map((org) => (
                                        <CommandItem
                                            key={org.id}
                                            value={org.id}
                                            onSelect={(currentValue) => {
                                                setSelectedOrganization(currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn("mr-2 h-4 w-4", selectedOrganization === org.id ? "opacity-100" : "opacity-0")}
                                            />
                                            {org.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {loadingThemes ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Загрузка тем...</span>
                </div>
            ) : selectedOrganization && themes.length > 0 ? (
                <div className="space-y-6">
                    {themes.map((theme) => (
                        <div key={theme.id} className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">{theme.name}</h3>

                            <div className="mb-6">
                                <h4 className="mb-2">
                                    Ответственное лицо <span className="text-red-500">*</span>
                                </h4>
                                <Select
                                    value={theme.responsible_person_id}
                                    onValueChange={(value) => handleChangeResponsible(theme.id, value)}
                                >
                                    <SelectTrigger className="w-full bg-white border-gray-200">
                                        <SelectValue placeholder="Выберите ответственное лицо" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                <div className="flex items-center">
                                                    <Avatar className="h-6 w-6 mr-2">
                                                        <AvatarImage src={user.photo_url || "/placeholder.svg"} alt={user.name} />
                                                        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                                    </Avatar>
                                                    {user.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {theme.responsible_person_id && (
                                <div>
                                    <h4 className="mb-2">Текущее ответственное лицо:</h4>
                                    {(() => {
                                        const responsiblePerson = users.find((user) => user.id === theme.responsible_person_id)

                                        if (!responsiblePerson) return <p>Не назначено</p>

                                        return (
                                            <div className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-md">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={responsiblePerson.photo_url || "/placeholder.svg"}
                                                        alt={responsiblePerson.name}
                                                    />
                                                    <AvatarFallback>{responsiblePerson.name.substring(0, 2)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{responsiblePerson.name}</p>
                                                    <p className="text-sm text-gray-500">{responsiblePerson.position}</p>
                                                    <p className="text-sm text-gray-500">{responsiblePerson.email}</p>
                                                </div>
                                            </div>
                                        )
                                    })()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : selectedOrganization ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p>Нет доступных тем для этой организации</p>
                </div>
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p>Выберите организацию для просмотра тем</p>
                </div>
            )}
        </div>
    )
}
