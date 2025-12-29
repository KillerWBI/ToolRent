import {
    CreateFeedbackPayload,
    Feedback,
    FeedbacksByToolId,
} from "@/types/feedback";

export async function getFeedbacks(): Promise<Feedback[]> {
    let allFeedbacks: Feedback[] = [];
    const seenIds = new Set<string>();
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks?page=${page}&limit=10`,
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

export const getFeedbacksByToolId = async (
    toolId: string
): Promise<FeedbacksByToolId[]> => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/feedbacks/tools/${toolId}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch feedbacks");
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
};

export async function createFeedback(payload: CreateFeedbackPayload) {
    const res = await fetch(`/api/feedbacks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create feedback");
    }

    return res.json();
}
