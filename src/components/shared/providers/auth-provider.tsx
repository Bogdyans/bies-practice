"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type AuthContextType = {
    isAuthenticated: boolean
    username: string | null
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    username: null,
    login: () => {},
    logout: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [username, setUsername] = useState<string | null>(null)
    const router = useRouter()


    useEffect(() => {
        const token = localStorage.getItem("token")
        console.log(token)

        if (!token)
        {
            router.push("/")
        }

        try {
            if (!token) return; //чтобы не ругалось

            const payload = JSON.parse(atob(token.split(".")[1]))

            if (payload.exp && payload.exp * 1000 < Date.now()) {
                localStorage.removeItem("token")
                setIsAuthenticated(false)
                setUsername(null)

                router.push("/login")
            } else {
                setIsAuthenticated(true)
                setUsername(payload.username)
            }
        } catch (error) {
            console.error("Invalid token", error)
            localStorage.removeItem("token")
            setIsAuthenticated(false)
            setUsername(null)

            router.push("/login")
        }

    }, [])

    const login = (token: string) => {
        localStorage.setItem("token", token)
        try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            setIsAuthenticated(true)
            setUsername(payload.username)
        } catch (error) {
            console.error("Invalid token during login", error)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsAuthenticated(false)
        setUsername(null)
        router.push("/login")
    }

    return <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>{children}</AuthContext.Provider>
}

