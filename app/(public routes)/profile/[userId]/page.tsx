import type { Metadata } from "next";
import styles from "./ProfilePage.module.css";

import ProfileWrapper from "@/components/profile/ProfileWrapper/ProfileWrapper";
import ProfilePlaceholderClient from "@/components/profile/ProfilePlaceholder/ProfilePlaceholderClient";
import UserToolsGrid from "@/components/tools/UserToolsGrid/UserToolsGrid";

import type { Tool } from "@/types/tool";
import {
    getPublicUserById,
    getUserToolsByUserId,
    type PublicUser,
} from "@/lib/api/users";
import FeedbacksBlock from "@/components/home/FeedbacksBlock/FeedbacksBlock";
import ReviewsBlock from "@/components/profile/ReviewsBlock/ReviewsBlock";
import type { Feedback, FeedbacksByToolId } from "@/types/feedback";
import { getFeedbacksByToolId } from "@/lib/api/feedbacks";

type PageProps = {
    params: Promise<{ userId: string }>;
};

function extractArray<T>(res: any): T[] {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.tools)) return res.tools;
    if (Array.isArray(res?.items)) return res.items;
    return [];
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { userId } = await params;

    try {
        const user = await getPublicUserById(userId);

        return {
            title: `${user.name} | Профіль`,
            description: `Профіль користувача ${user.name}`,
            openGraph: {
                title: `${user.name} | Профіль`,
                description: `Профіль користувача ${user.name}`,
                type: "profile",
            },
        };
    } catch {
        return {
            title: "Профіль користувача",
            description: "Сторінка профілю користувача",
        };
    }
}

export default async function ProfilePage({ params }: PageProps) {
    const { userId } = await params;

    if (!userId || userId === "undefined") {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.inner}>
                        <p>
                            Користувача не знайдено або сталася помилка
                            завантаження.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    let user: PublicUser | null = null;
    let tools: Tool[] = [];
    let feedbacks: Feedback[] = [];

    try {
        // 1. Fetch user and tools first
        const [rawUser, rawTools] = await Promise.all([
            getPublicUserById(userId),
            getUserToolsByUserId(userId) as any,
        ]);

        user = rawUser;
        tools = extractArray<Tool>(rawTools);

        // Get feedbacks for all user tools
        const allFeedbacks: Feedback[] = [];
        for (const tool of tools) {
            try {
                const toolFeedbacks = await getFeedbacksByToolId(tool._id);
                const converted: Feedback[] = toolFeedbacks.map(
                    (f: FeedbacksByToolId) => ({
                        _id: f._id,
                        name: f.name,
                        description: f.description,
                        rate: f.rate,
                        toolId: f.toolId,
                        owner: f.owner,
                        createdAt: f.createdAt,
                    })
                );
                allFeedbacks.push(...converted);
            } catch (e) {
                console.warn(`Failed to fetch feedbacks for tool ${tool._id}`);
            }
        }

        // Take only top 10 feedbacks
        feedbacks = allFeedbacks.slice(0, 10);

        // 3. Calculate rating from feedbacks
        if (user) {
            let avgRating = 0;
            let reviewsCount = feedbacks.length;

            if (reviewsCount > 0) {
                // Priority: Calculate from actual feedbacks found
                const totalRating = feedbacks.reduce(
                    (acc: number, f: any) => acc + (f.rate || 0),
                    0
                );
                avgRating = totalRating / reviewsCount;
            }

            user = {
                ...user,
                rating: avgRating,
                reviewsCount: reviewsCount,
            };
        }
    } catch (err) {
        console.error("Помилка завантаження профілю:", err);
    }

    if (!user) {
        return (
            <main className={styles.page}>
                <div className="container">
                    <div className={styles.inner}>
                        <p>
                            Користувача не знайдено або сталася помилка
                            завантаження.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <div className="container">
                <div className={styles.inner}>
                    <ProfileWrapper user={user} />

                    <section className={styles.toolsSection}>
                        <h2 className={styles.toolsTitle}>Інструменти</h2>

                        {tools.length === 0 ? (
                            <ProfilePlaceholderClient />
                        ) : (
                            <UserToolsGrid tools={tools} />
                        )}
                    </section>

                    {feedbacks.length > 0 ? (
                        <FeedbacksBlock feedbacks={feedbacks} title="Відгуки" />
                    ) : (
                        <ReviewsBlock feedbacks={[]} />
                    )}
                </div>
            </div>
        </main>
    );
}
