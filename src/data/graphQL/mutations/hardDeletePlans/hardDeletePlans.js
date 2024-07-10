import { gql } from '@apollo/client';

export const HARD_DELETE_PLAN = gql`
  mutation HardDeletePlan($id: Int!) {
    hardDeletePlan(id: $id)
  }
`;
