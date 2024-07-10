import { gql } from '@apollo/client';

export const ADD_DEVICE = gql`
mutation AddDevice($deviceInput: DeviceInput!) {
  addDevice(deviceInput: $deviceInput) {
    id
    name
    serialNumber
    creationDate
    modificationDate
    latitude
    longitude
    }
}
`;
