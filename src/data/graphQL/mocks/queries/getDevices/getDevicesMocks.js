import { GET_DEVICES } from '../../../queries/getDevices/getDevices';

export const device1Mock = {
  id: '1',
  name: 'Test Device',
  latitude: '-36.306703',
  longitude: '-64.865366',
  serialNumber: '123456',
  modificationDate: '2024-05-27T00:00:00.000Z',
};

export const device2Mock = {
  id: '2',
  name: 'Test Device 2',
  latitude: '-36.251393',
  longitude: '-64.903843',
  serialNumber: '545454',
  modificationDate: '2024-05-15T11:07:08.601Z',
};

export const getDevicesMocks = [
  {
    request: {
      query: GET_DEVICES,
    },
    result: {
      data: { devicesByUser: [ device1Mock, device2Mock ] },
    },
  },
];
