"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import DefaultButton from "@/components/shared/buttons/button";
import Image from "next/image";

export default function LoginPage() {
    const [phoneOrLogin, setPhoneOrLogin] = useState("")
    const [smsCode, setSmsCode] = useState("")

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
                        <label className="text-[#1d1d1b] text-lg">Телефон или корпоративный логин</label>
                            <Input
                                value={phoneOrLogin}
                                onChange={(e) => setPhoneOrLogin(e.target.value)}
                                placeholder="Ввод"
                                className="h-14 px-4 text-lg border-[#d9d9d9] rounded-lg mt-2"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[#1d1d1b] text-lg">Код из СМС</label>
                            <Input
                                value={smsCode}
                                onChange={(e) => setSmsCode(e.target.value)}
                                placeholder="xxx-xxx"
                                className="h-14 px-4 text-lg border-[#d9d9d9] rounded-lg mt-2"
                            />
                        </div>
                    </div>

                    <DefaultButton
                        content="Войти"
                        bg='#e30613'
                        onClick={() => {}}
                    />
                </div>
            </div>

    )
}

