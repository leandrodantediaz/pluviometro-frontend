import { gql } from '@apollo/client';

export const GET_ALL_DEVICES = gql`
  query GetAllDevices($filterInput: DeviceFilterInput, $skip: Int!, $take: Int!) {
    allDevices(skip: $skip, take: $take, where: $filterInput, order: { id: DESC }) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      items {
       disabled
        id
        name
        serialNumber
        userName
        latitude
        longitude
        creationDate
        creationUser
        modificationDate
        modificationUser
        password
        owner {
          id
          creationDate
          creationUser
          cuit
          email
          expoPushToken
          fullName
          modificationDate
          modificationUser
          phone
          planId
          rolId
          userName
          userOwnerId
        }
      }
    }
  }
`;
