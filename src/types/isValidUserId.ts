export type UserId = string & { length: 10 };

export function isValidUserId(userId: string): userId is UserId {
  return userId.length === 10 && /^[a-zA-Z0-9]+$/.test(userId);
}