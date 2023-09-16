import { InvitationCode } from '@/types/InvitationCode';

export function isInvitationCode(code: string): code is InvitationCode {
  return code.length === 6 && /^[0-9]+$/.test(code);
}
