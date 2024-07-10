import { gql } from '@apollo/client';

export const CHANGE_DEVICE_NAME = gql`
mutation ChangeDeviceName($deviceId: Int!, $newName: String) {
  changeDeviceName(deviceId: $deviceId, newName: $newName) {
      id
      name
  }
}`;
