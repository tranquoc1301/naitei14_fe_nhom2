import { User } from "@/features/auth/types/auth.types";
import { API_BASE_URL } from "@/constants/common";
import { UpdateProfileRequest, UpdateProfileError } from "../types";

export const updateProfile = async (
  userId: string,
  data: UpdateProfileRequest
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = `Profile update API failed with status ${response.status}`;
    console.error("Profile update API error", {
      message: errorMessage,
      status: response.status,
      userId,
      data,
      timestamp: new Date().toISOString(),
    });
    throw new UpdateProfileError(
      "Cập nhật hồ sơ thất bại",
      new Error(errorMessage)
    );
  }

  return response.json();
};
