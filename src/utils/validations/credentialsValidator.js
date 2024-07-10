import { isEmailValid } from './emailValidator';
import { isPasswordValid } from './passwordValidator';

export const areCredentialsValid = (credentials) => {
  const { email, password } = credentials;
  return {
    isEmailValid: isEmailValid(email),
    isPasswordValid: isPasswordValid(password),
  };
};
