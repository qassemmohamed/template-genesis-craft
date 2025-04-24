"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function useAvatar() {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // Try to get avatar from localStorage first
    const storedAvatar = localStorage.getItem("userAvatar");

    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
      console.log("Avatar loaded from localStorage:", storedAvatar);
    } else if (user?.avatarUrl) {
      // If not in localStorage but available in user object, store it
      localStorage.setItem("userAvatar", user.avatarUrl);
      setAvatarUrl(user.avatarUrl);
      console.log("Avatar loaded from user object:", user.avatarUrl);
    }
  }, [user?.avatarUrl]);

  const updateAvatar = (newAvatarUrl: string) => {
    if (!newAvatarUrl) return;

    console.log("Updating avatar URL to:", newAvatarUrl);
    localStorage.setItem("userAvatar", newAvatarUrl);
    setAvatarUrl(newAvatarUrl);
  };

  const clearAvatar = () => {
    localStorage.removeItem("userAvatar");
    setAvatarUrl(null);
  };

  return {
    avatarUrl,
    updateAvatar,
    clearAvatar,
  };
}
