import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
query allUsers ($filterInput: UserFilterInput, $skip: Int!, $take: Int!) {
  allUsers (
    skip: $skip
    take: $take
    where: $filterInput
    order: { id: DESC }
  ) {
    totalCount
    items {
      creationDate
      creationUser
      cuit
      disabled
      email
      expoPushToken
      fullName
      id
      modificationDate
      modificationUser
      phone
      planId
      rolId
      userName
      userOwnerId
      rol {
        displayName
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}`;

