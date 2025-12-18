// components/profile/ProfilePlaceholder/ProfilePlaceholderClient.tsx
"use client";

import useAuth from "@/hooks/useAuth";
import ProfilePlaceholder from "./ProfilePlaceholder";

export default function ProfilePlaceholderClient() {
  const { isAuthenticated } = useAuth();

  return <ProfilePlaceholder isAuthorized={isAuthenticated} />;
}
