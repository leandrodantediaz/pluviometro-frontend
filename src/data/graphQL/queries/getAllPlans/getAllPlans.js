import { gql } from '@apollo/client';

export const GET_ALL_PLANS = gql`
  query allPlans($filterInput: PlanFilterInput, $skip: Int!, $take: Int!) {
    allPlans(
      skip: $skip
      take: $take
      where: $filterInput
      order: { id: DESC }
    ) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
        id
        name
        maxAllowedUsers
        disabled
      }
    }
  }
`;
