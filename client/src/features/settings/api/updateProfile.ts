import api from "@/shared/api/axios";
import type { User } from "@/features/auth/types/auth.types";

interface UpdateProfilePayload {
  fullName: string;
  avatarUrl?: string;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<User> {
  const res = await api.patch("/auth/me", payload);

  return res.data.data;
}
