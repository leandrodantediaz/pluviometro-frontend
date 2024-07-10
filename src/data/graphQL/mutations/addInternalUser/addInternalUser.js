import { gql } from '@apollo/client';

export const ADD_INTERNAL_USER = gql`
mutation AddInternalUser ( $password: String, $name: String, $lastName: String, $rolId: Int!, $email: String ) {
  addUserCollaborator ( 
    input: { 
      email: $email,
      password: $password, 
      name: $name, 
      lastName: $lastName, 
      rolId: $rolId 
    }
  ) {
    email
  }
}`;
