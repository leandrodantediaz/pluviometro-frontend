import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUserBackOffice($input: UserInput!) {
    addUser(input: $input) {
      fullName
      id
      cuit
      phone
      planId
      email
    }
  }
`;
