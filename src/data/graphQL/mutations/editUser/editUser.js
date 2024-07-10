import { gql } from '@apollo/client';

export const EDIT_USER = gql`
mutation editUser( 
    $planId: Int!
    $id: Int!
    $email: String
    $cuit: String
    $phone: String
    $lastName: String
    $name: String
    $rolId: Int!
) {
    editUser ( 
        input: { 
            planId: $planId
            id: $id
            email: $email
            cuit: $cuit
            phone: $phone
            lastName: $lastName
            name: $name
            rolId: $rolId
        }
  ) {
    id
  }
}`;
