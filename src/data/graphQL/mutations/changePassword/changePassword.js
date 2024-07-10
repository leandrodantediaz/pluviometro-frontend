import { gql } from '@apollo/client';

export const CHANGE_PASSWORD = gql`
  mutation changePassword($password: String) {
    changePassword(password: $password) {
      id
    }
  }
`;
