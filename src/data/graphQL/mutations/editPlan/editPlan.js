import { gql } from '@apollo/client';

export const EDIT_PLAN = gql`
  mutation editPlan($id: Int!, $maxAllowedUsers: Int!, $name: String) {
    editPlan(planEditInput: { 
      id: $id
      maxAllowedUsers: $maxAllowedUsers
      name: $name
    }) {
      disabled
      id
      maxAllowedUsers
      name
    }
  }
`;


