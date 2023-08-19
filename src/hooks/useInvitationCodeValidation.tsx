import { useState } from 'react';
import { isValidInvitationCode } from '@/types/isValidInvitationCode';

export default function useInvitationCodeValidation() {
  const [invitationCode, setInvitationCode] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (value: string) => {
    setInvitationCode(value);
    setIsValid(isValidInvitationCode(value));
  };

  return {
    invitationCode,
    isValid,
    handleInputChange,
  };
}
