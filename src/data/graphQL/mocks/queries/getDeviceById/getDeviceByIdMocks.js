import { GET_DEVICE_BY_ID } from '../../../queries/getDeviceById/getDeviceById';
import { device1Mock } from '../getDevices/getDevicesMocks';

export const getDeviceByIdMocks = [
  {
    request: {
      query: GET_DEVICE_BY_ID,
      variables: { deviceId: 1 },
    },
    result: {
      data: { deviceById: device1Mock },
    },
  },
];
