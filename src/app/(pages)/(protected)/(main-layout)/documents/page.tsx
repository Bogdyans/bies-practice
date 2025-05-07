"use client"

import { ArrowIcon, SearchIcon } from "@/components/ui/icons";
import { useEffect, useState } from "react";
import { Document } from "@/types/document";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const userResponse = await fetch(`/api/user`);
            if (!userResponse.ok) throw new Error('Failed to fetch user data');
            const userData = await userResponse.json();

            if (userData.otdel_id) {
                const docsResponse = await fetch(`/api/documents?otdel_id=${userData.otdel_id}`);
                if (!docsResponse.ok) throw new Error('Failed to fetch documents');
                const docsData = await docsResponse.json();
                setDocuments(docsData.documents);
            }
        };
        fetchData();
    }, []);

    const handleDocumentClick = (id: number) => {
        window.open(`/api/documents/${id}`, '_blank');
    };

    return (
        <div className="min-h-screen p-4">
            <div className="mx-auto h-14 bg-[#F5F5F5] flex justify-center items-center border-1 border-solid border-[#A4A4A4] rounded-[10px]">
                <SearchIcon className="h-[22px] w-[22px] m-3 shrink-0 text-[#6D6D6D]" />
                <input
                    type="text"
                    placeholder="Поиск по справочнику"
                    className="w-full border-none outline-none text-base bg-transparent text-[16px]"
                />
            </div>
            <div className="py-4 flex justify-center flex-col items-center">
                {documents.map((document) => (
                    <div
                        key={document.id}
                        className="p-4 w-full bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleDocumentClick(document.id)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-black">{document.name}</h3>
                                {document.description && (
                                    <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">
                                    Добавлен: {new Date(document.uploaded_at).toLocaleDateString()}
                                </p>
                            </div>
                            <ArrowIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}