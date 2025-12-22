"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import UserProfileEditable from "../UserProfile/UserProfileEditable";
import type { PublicUser } from "@/lib/api/users";

type Props = {
  user: PublicUser;
};

export default function ProfileWrapper({ user }: Props) {
  const { user: authUser } = useAuth();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setIsOwnProfile(false);
      return;
    }

    const authUserId = (authUser as any)?.id || (authUser as any)?._id;
    const profileUserId = user._id;

    setIsOwnProfile(authUserId === profileUserId);
  }, [authUser, user._id]);

  return <UserProfileEditable user={user} isOwnProfile={isOwnProfile} />;
}
