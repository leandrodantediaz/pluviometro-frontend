import { gql } from '@apollo/client';

export const HARD_DELETE_USER = gql`
  mutation HardDeleteUser($id: Int!) {
    hardDeleteUser(id: $id)
  }
`;
