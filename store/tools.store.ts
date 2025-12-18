import { create } from "zustand";
import { Tool } from "@/types/tool";

interface ToolsStore {
    tools: Tool[];
    setTools: (tools: Tool[]) => void;
    removeTool: (toolId: string) => void;
}

export const useToolsStore = create<ToolsStore>((set) => ({
    tools: [],
    setTools: (tools) => set({ tools }),
    removeTool: (toolId) =>
        set((state) => ({
            tools: state.tools.filter((tool) => tool._id !== toolId),
        })),
}));
