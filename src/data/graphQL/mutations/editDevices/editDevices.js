import { gql } from '@apollo/client';

export const EDIT_DEVICE = gql`
mutation editDevice(
  $id: Int!
  $deviceName: String
  $displayName: String
  $password: String
  $serialNumber: String
  $ownerId: Int
) {
  editDevice(
    input: {
      id: $id
      deviceName: $deviceName
      displayName: $displayName
      password: $password
      serialNumber: $serialNumber
      ownerId: $ownerId
    }
  ) {
    bateryLevel
    creationDate
    creationUser
    id
    lastCommunicationDate
    latitude
    longitude
    modificationDate
    modificationUser
    name
    password
    serialNumber
    token
    userName
    owner {
      id
    }
  }
}
`;
