import { gql } from '@apollo/client';

export const ADD_PLAN = gql`
mutation AddPlan($planInput: PlanInput!) {
    addPlan(planInput: $planInput) {
      id
      maxAllowedUsers
      name
    }
  }
  
`;
