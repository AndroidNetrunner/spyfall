export type InvitationCode = string & { length: 6; };

export function isValidInvitationCode(code: string): code is InvitationCode {
    return code.length === 6 && /^[0-9]+$/.test(code);
}