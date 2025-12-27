export type Feedback = {
    _id: { $oid: string } | string; // Handle both formats if needed, or just string if normalized
    name: string;
    description: string;
    rate: number;
    toolId?: string;
    owner?: string | { _id: string; name: string; avatarUrl?: string };
    createdAt?: string;
};

export type CreateFeedbackPayload = {
    toolId: string;
    rate: number;
    description: string;
}