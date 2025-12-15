import styles from "./ProfilePage.module.css";
import { request } from "@/lib/api/api";
import type { PublicUser } from "@/types/user";
import type { Tool } from "@/types/tool";

import UserProfile from "@/components/profile/UserProfile/UserProfile";
import ToolsGrid from "@/components/tools/ToolsGrid/ToolsGrid";
import ProfilePlaceholder from "@/components/profile/ProfilePlaceholder/ProfilePlaceholder";

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

function extractUser(res: any): PublicUser {
  
  if (res?.data && typeof res.data === "object") return res.data as PublicUser;
  return res as PublicUser;
}

export async function generateMetadata({ params }: PageProps) {
  const { userId } = await params;
  const rawUser = await request<any>(`/api/users/${userId}`);
  const user = extractUser(rawUser);

  return {
    title: `${user.name} | Профіль`,
    description: `Профіль користувача ${user.name}`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { userId } = await params;

  const [rawUser, rawTools] = await Promise.all([
    request<any>(`/api/users/${userId}`),
    request<any>(`/api/users/${userId}/tools`),
  ]);

  const user = extractUser(rawUser);
  const tools: Tool[] = extractArray<Tool>(rawTools);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <UserProfile user={user} />

        <section className={styles.toolsSection}>
          <h2 className={styles.toolsTitle}>Інструменти</h2>

          {tools.length === 0 ? (
            <ProfilePlaceholder />
          ) : (
            <ToolsGrid tools={tools} />
          )}
        </section>
      </div>
    </div>
  );
}
