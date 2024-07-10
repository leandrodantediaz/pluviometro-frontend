import { gql } from '@apollo/client';

export const DELETE_DEVICE = gql`
  mutation deleteDevice($id: Int!) {
    deleteDevice(id: $id) {
      id
      serialNumber
      name
      userName
      password
      latitude
      longitude
    }
  }
`;
