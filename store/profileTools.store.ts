import { create } from "zustand";
import { Tool } from "@/types/tool";

interface ProfileToolsStore {
  tools: Tool[];
  setTools: (tools: Tool[]) => void;
  removeTool: (toolId: string) => void;
  reset: () => void;
}

export const useProfileToolsStore = create<ProfileToolsStore>((set) => ({
  tools: [],
  setTools: (tools) => set({ tools }),
  removeTool: (toolId) =>
    set((state) => ({ tools: state.tools.filter((t) => t._id !== toolId) })),
  reset: () => set({ tools: [] }),
}));
