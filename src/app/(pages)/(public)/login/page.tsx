"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import DefaultButton from "@/components/shared/buttons/button";
import Image from "next/image";
import {router} from "next/client";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter();

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login, password }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Login failed")
            }

            localStorage.setItem("token", data.token)

            router.push("/")
        } catch (err: any) {
            setError(err.message || "An error occurred during login")
        } finally {
            setIsLoading(false)
        }
    }

    return (
            <div className="max-w-md min-h-screen mx-auto overflow-hidden flex flex-col relative justify-center items-center p-8">


                {/* Logo */}
                <div className="relative w-60 h-24">
                    <Image src="/media/logo.png" alt="logo" width={60*4} height={24*4}/>
                </div>

                {/* Form */}
                <div className="flex flex-col w-full">
                    <div className="flex flex-col gap-6 my-20">
                        <div className="space-y-2">
                        <label className="text-[#1d1d1b] text-lg">Логин для входа:</label>
                            <Input
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="Мой логин"
                                className="h-14 px-4 text-lg border-[#d9d9d9] rounded-lg mt-2"
                                type="text"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[#1d1d1b] text-lg">Пароль:</label>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Мой Пароль"
                                className="h-14 px-4 text-lg border-[#d9d9d9] rounded-lg mt-2"
                                type="password"
                            />
                        </div>
                    </div>

                    <DefaultButton
                        content="Войти"
                        bg='#e30613'
                        onClick={handleLogin}
                    />
                </div>
            </div>

    )
}

