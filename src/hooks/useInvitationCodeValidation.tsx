import { isInvitationCode } from '@/validators/isInvitationCode';
import { useState } from 'react';

export default function useInvitationCodeValidation() {
  const [invitationCode, setInvitationCode] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (value: string) => {
    setInvitationCode(value);
    setIsValid(isInvitationCode(value));
  };

  return {
    invitationCode,
    isValid,
    handleInputChange,
  };
}
