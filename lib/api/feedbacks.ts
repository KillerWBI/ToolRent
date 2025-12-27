import { CreateFeedbackPayload, Feedback } from "@/types/feedback";
import axios from "axios";

export async function getFeedbacks(): Promise<Feedback[]> {
    let allFeedbacks: Feedback[] = [];
    const seenIds = new Set<string>();
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks?page=${page}&limit=100`,
            {
                cache: "no-store",
            }
        );

        if (!res.ok) {
            if (page === 1) throw new Error("Не вдалося отримать відгуки");
            break;
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
            // Filter out duplicates
            const uniqueData = data.filter((f: any) => {
                const id = typeof f._id === "string" ? f._id : f._id?.$oid;
                if (!id || seenIds.has(id)) return false;
                seenIds.add(id);
                return true;
            });

            allFeedbacks = [...allFeedbacks, ...uniqueData];
            page++;
            if (page > 20) hasMore = false;
        } else {
            hasMore = false;
        }
    }

    return allFeedbacks;
}

export async function getFeedbacksByIds(
    ids: Set<string>,
    limit: number = 10
): Promise<Feedback[]> {
    let matches: Feedback[] = [];
    const seenIds = new Set<string>();
    let page = 1;
    let hasMore = true;
    const MAX_PAGES = 20;
    let emptyPagesCount = 0;

    while (hasMore && matches.length < limit && page <= MAX_PAGES) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks?page=${page}&limit=100`,
                {
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                // If error, stop scanning
                break;
            }

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                const pageMatches = data.filter((f: any) => {
                    const fId = typeof f._id === "string" ? f._id : f._id?.$oid;
                    // Check if ID is in the requested set AND not already seen
                    if (!fId || !ids.has(fId) || seenIds.has(fId)) return false;
                    seenIds.add(fId);
                    return true;
                });

                if (pageMatches.length > 0) {
                    matches = [...matches, ...pageMatches];
                    emptyPagesCount = 0;
                } else {
                    emptyPagesCount++;
                }
                if (emptyPagesCount >= 3) {
                    break;
                }

                page++;
            } else {
                hasMore = false;
            }
        } catch (e) {
            console.error("Error fetching feedbacks page:", page, e);
            break;
        }
    }

    return matches.slice(0, limit);
}

export async function createFeedback(
    payload: CreateFeedbackPayload
) {
    try {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks`,
        {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            toolId: payload.toolId,
            rate: payload.rate,
            description: payload.description,
        }),
        }
    );

    if (!res.ok) {
        throw new Error("Не вдалося надіслати відгук");
    }

    return await res.json();
    } catch (e) {
    console.error("Create feedback error:", e);
    throw e;
    }
}