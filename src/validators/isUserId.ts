import { UserId } from '@/types/UserId';

export function isUserId(userId: string): userId is UserId {
  return userId.length === 13 && /^id_[a-zA-Z0-9]+$/.test(userId);
}
