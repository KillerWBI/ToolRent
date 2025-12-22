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
            <p>Користувача не знайдено або сталася помилка завантаження.</p>
          </div>
        </div>
      </main>
    );
  }

  let user: PublicUser | null = null;
  let tools: Tool[] = [];

  try {
    const [rawUser, rawTools] = await Promise.all([
      getPublicUserById(userId),
      getUserToolsByUserId(userId) as any,
    ]);

    user = rawUser;
    tools = extractArray<Tool>(rawTools);
  } catch (err) {
    console.error("Помилка завантаження профілю:", err);
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className="container">
          <div className={styles.inner}>
            <p>Користувача не знайдено або сталася помилка завантаження.</p>
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
        </div>
      </div>
    </main>
  );
}
