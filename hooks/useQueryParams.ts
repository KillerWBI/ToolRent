'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type QueryDefaults = Record<string, string | number | null>;

export function useQueryParams(defaults: QueryDefaults = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // получить параметр
  const get = (key: string) => {
    return searchParams.get(key) ?? defaults[key] ?? null;
  };

  // установить / удалить параметр
  const set = (key: string, value: string | number | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // получить все параметры
  const getAll = () => {
    const result: Record<string, string | number | null> = {
      ...defaults,
    };

    for (const [key, value] of searchParams.entries()) {
      result[key] = value;
    }

    return result;
  };

  return {
    get,
    set,
    getAll,
  };
}

//Use:
//const { get, set } = useQueryParams({ page: 1 });

//const page = get('page'); // '1'

//set('page', 2);     // ?page=2
//set('page', null);  // удалит параметр
