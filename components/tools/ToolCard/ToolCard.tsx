"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { Tool } from "@/types/tool";
import { useAuthStore } from "@/store/auth.store";
import { deleteTool } from "@/lib/api/tools";
import { ConfirmationModal } from "@/components/modal/ConfirmationModal/ConfirmationModal";
import styles from "./ToolCard.module.css";

interface ToolCardProps {
    tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    // Получаем статус авторизации из Zustand стора
    const { isAuthenticated } = useAuthStore();

    // Заглушка для изображения, если массив images пуст
    let mainImage = "/image/Placeholder Image.png";

    if (tool.images) {
        if (Array.isArray(tool.images) && tool.images.length > 0) {
            mainImage = tool.images[0];
        } else if (typeof tool.images === "string") {
            mainImage = tool.images;
        }
    }

    const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDeleteError(null);
        setShowConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true);
        setDeleteError(null);

        try {
            await deleteTool(tool._id);
            setShowConfirm(false);
            router.refresh();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Не вдалося видалити інструмент. Спробуйте ще раз.";

            setDeleteError(message);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        if (isDeleting) return;

        setShowConfirm(false);
        setDeleteError(null);
    };

    // Формируем звезды рейтинга
    const renderStars = (rating: number) => {
        // Округляем до целого или половин (для простоты покажем целые)
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={
                        i <= Math.round(rating)
                            ? styles.starFilled
                            : styles.starEmpty
                    }
                >
                    ★
                </span>
            );
        }
        return <div className={styles.rating}>{stars}</div>;
    };

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={mainImage}
                    alt={tool.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{tool.name}</h3>
                    <p className={styles.price}>{tool.pricePerDay} грн/доба</p>
                </div>

                {renderStars(tool.rating ?? 0)}

                <div className={styles.actions}>
                    {isAuthenticated ? (
                        // Авторизованный пользователь
                        <>
                            <Link
                                href={`/tools/${tool._id}/edit`}
                                className={styles.editButton}
                            >
                                Редагувати
                            </Link>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={styles.deleteButton}
                                aria-label="Видалити інструмент"
                            >
                                <Trash2 size={20} />
                            </button>
                        </>
                    ) : (
                        // НЕавторизованный пользователь
                        <Link
                            href={`/tools/${tool._id}`}
                            className={styles.detailsButton}
                        >
                            Детальніше
                        </Link>
                    )}
                </div>
            </div>

            <ConfirmationModal
                open={showConfirm}
                message="Ви впевнені, що хочете видалити оголошення?"
                isLoading={isDeleting}
                error={deleteError ?? undefined}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </div>
    );
}
