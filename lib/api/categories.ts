// import { Category } from "@/types/category";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// /**
//  * Отримання списку категорій (Public)
//  */
// export const getCategories = async (): Promise<Category[]> => {
//   const res = await fetch(`${API_URL}/categories`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     const errorData = await res.json().catch(() => null);
//     throw new Error(errorData?.message || "Failed to fetch categories");
//   }

//   const json = await res.json();
//   return json.data;
// };

import { Category } from "@/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type CategoriesResponse = {
  status: string;
  code: number;
  data: Category[];
};

export const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch categories");
  }

  const json: CategoriesResponse = await res.json();
  return json.data;
};
