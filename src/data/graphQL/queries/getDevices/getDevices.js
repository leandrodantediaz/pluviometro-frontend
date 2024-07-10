import { gql } from '@apollo/client';

export const GET_DEVICES = gql`
query DevicesByUser {
  devicesByUser {
    id
    serialNumber
    modificationDate
    name
    latitude
    longitude
    lastCommunicationDate
  }
}`;
