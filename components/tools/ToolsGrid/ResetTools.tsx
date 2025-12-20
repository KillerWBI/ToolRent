'use client';

import { useEffect } from "react";
import { useToolsStore } from "@/store/tools.store";

export default function ResetToolsOnHome() {
  const resetTools = useToolsStore((state) => state.resetTools);

  useEffect(() => {
    resetTools();
  }, [resetTools]);

  return null;
}
