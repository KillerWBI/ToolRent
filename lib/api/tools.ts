import { Tool } from "@/types/tool";

// Базовий URL бекенду
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Типи для параметрів запиту
export interface GetToolsParams {
    page?: number;
    limit?: number;
    search?: string;
    category?: string; // ID категорій через кому: "id1,id2"
}

// Тип відповіді списку інструментів (пагінація)
export interface ToolsResponse {
    page: number;
    limit: number;
    totalTools: number;
    totalPages: number;
    tools: Tool[];
}

/**
 * Отримання списку інструментів (Public)
 * @param params - параметри фільтрації та пагінації
 */
export const getTools = async (
    params: GetToolsParams = {}
): Promise<ToolsResponse> => {
    const query = new URLSearchParams();

    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    if (params.search) query.append("search", params.search);
    if (params.category) query.append("category", params.category);

    const res = await fetch(`${API_URL}/tools?${query.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store", // Щоб завжди отримувати актуальні дані
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch tools");
    }

    return res.json();
};

/**
 * Отримання одного інструменту за ID (Public)
 */
export const getToolById = async (toolId: string): Promise<Tool> => {
  const res = await fetch(`${API_URL}/tools/${toolId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Tool not found");
        }
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch tool details");
    }

    return res.json();
};

/**
 * Створення інструменту (Private)
 * Використовує FormData для передачі файлів та полів
 */
export const createTool = async (formData: FormData): Promise<Tool> => {
    const res = await fetch(`${API_URL}/tools`, {
        method: "POST",
        body: formData,
        // credentials: 'include' потрібен, щоб передати куки (accessToken) на бекенд
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create tool");
    }

    return res.json();
};

/**
 * Оновлення інструменту (Private)
 */
export const updateTool = async (
    toolId: string,
    formData: FormData
): Promise<Tool> => {
    const res = await fetch(`${API_URL}/tools/${toolId}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update tool");
    }

    return res.json();
};

/**
 * Видалення інструменту (Private)
 */
export const deleteTool = async (toolId: string): Promise<void> => {
    // Call same-origin proxy route to avoid CORS with credentials
    const res = await fetch(`/api/tools/${toolId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (!res.ok) {
        let message = "Failed to delete tool";
        try {
            const errorData = await res.json();
            message = errorData.message || message;
        } catch {
            // ignore parse errors
        }
        throw new Error(message);
    }
};
