import { UserId } from "@/types/UserId";

export function isUserId(userId: string): userId is UserId {
    return userId.length === 10 && /^[a-zA-Z0-9]+$/.test(userId);
  }