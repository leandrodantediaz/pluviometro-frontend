import { gql } from '@apollo/client';

export const GET_DEVICE_BY_ID = gql`
query DeviceById($deviceId: Int!) {
    deviceById(deviceId: $deviceId) {
      name
      id
      serialNumber
      latitude
      longitude
      modificationDate
    }
  }`;
