import { gql } from '@apollo/client';

export const DELETE_PLAN = gql`
  mutation deletePlan($id: Int!) {
    deletePlan(id: $id) {
      disabled
      id
      maxAllowedUsers
      name
    }
  }
`;
