import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext/useAuth";
import { updateProfile } from "../services/profileAPI";
import { User } from "@/features/auth/types/auth.types";

export const useUpdateProfile = () => {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserProfile = async (data: {
    fullName: string;
    phone: string;
    email: string;
    website?: string;
    subscribeEmail: boolean;
  }) => {
    setLoading(true);
    setError(null);

    const user = JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
    );
    if (!user.id) {
      const errorMessage = "User not found";
      setError(errorMessage);
      setLoading(false);
      console.error("Profile update failed:", {
        error: errorMessage,
        userId: null,
      });
      return;
    }

    try {
      const requestData = {
        ...data,
        website: data.website || "",
      };

      const updatedUser: User = await updateProfile(user.id, requestData);

      updateUser(updatedUser);

      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Update failed";
      setError(errorMessage);
      console.error("Profile update failed:", {
        error: err,
        message: errorMessage,
        userId: user.id,
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateUserProfile, loading, error };
};
