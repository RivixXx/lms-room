"use client"

import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };
    courseId: string;
};

const formSchema = z.object({
    url: z.string().min(1)
})

export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Данные обновлены!");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Что-то пошло не так!");
        } 
    };

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Вложение удалено!");
            router.refresh();
        } catch {
            toast.error("Что-то пошло не так!");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Вложения курса
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Отмена</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Добавить файл
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                           Вложений пока нет 
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {initialData.attachments.map((attahment) => (
                                <div 
                                    key={attahment.id}
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                >
                                    <File className="h-4 w-4 mr-2 flex-shrink-0" />
                                    <p className="text-xs line-clamp-1">
                                        {attahment.name}
                                    </p>
                                    {deletingId  === attahment.id && (
                                        <div>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                    {deletingId  !== attahment.id && (
                                        <button
                                            onClick={() => onDelete(attahment.id)}
                                            className="ml-auto hover:opacity-75 transition"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {isEditing && (
                <div>
                    <FileUpload 
                        endpoint="courseAttachment"
                        onChange={(url) => {
                            if (url) {
                                onSubmit({ url: url });
                            }
                        }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Добавьте все, что может понадобиться вашим сотрудникам для завершения курса.
                    </div>
                </div>
            )}
        </div>
    )
}