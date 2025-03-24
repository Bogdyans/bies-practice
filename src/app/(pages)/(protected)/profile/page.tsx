
"use client"

import {MapPin, Phone, User } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
    return (
                <div className="min-h-screen p-4">
                    <div className="flex justify-between">
                        <div className="space-y-4">
                            {/* Profile Information */}
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-[#e30613]" />
                                <span className="text-black">Фамилия Имя Отчество</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-[#e30613]" />
                                <span className="text-black">Служебный телефон</span>
                            </div>

                            <div className="flex items-center gap-2">

                                <span className="text-black">Почта</span>
                            </div>

                            <div className="flex items-center gap-2">

                                <span className="text-black">Должность</span>
                            </div>

                            <div className="flex items-center gap-2">

                                <span className="text-black">Отдел</span>
                            </div>

                            <div className="flex items-center gap-2">

                                <span className="text-black">Организация</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#e30613]" />
                                <span className="text-black">Размещение</span>
                            </div>

                            <div className="flex items-center gap-2">

                                <span className="text-black">Псевдоним</span>
                            </div>
                        </div>

                        {/* Profile Photo */}
                        <div className="w-32 h-40 rounded-lg overflow-hidden">
                            <Image
                                src="/placeholder.svg?height=160&width=128"
                                alt="Profile Photo"
                                width={128}
                                height={160}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>

                     {/*Space Badge*/}
                    {/*<div className="absolute bottom-24 right-4">*/}
                    {/*    <div className="relative w-36 h-36">*/}
                    {/*        <div className="absolute inset-0 bg-[#20499a] rounded-full"></div>*/}
                    {/*        <div className="absolute inset-0 border-8 border-[#f0801b] rounded-full flex items-center justify-center">*/}
                    {/*            <div className="text-white text-center">*/}
                    {/*                <div className="text-sm font-bold">КОСМОС</div>*/}
                    {/*                <div className="text-sm font-bold">НАШ</div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
    )
}

