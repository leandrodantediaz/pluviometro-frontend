import { CHANGE_DEVICE_NAME } from '../../../mutations/changeDeviceName/changeDeviceName';

export const changeDeviceNameMocks = [
  {
    request: {
      query: CHANGE_DEVICE_NAME,
      variables: { deviceId: '1', newName: 'New Device Name' },
    },
    result: {
      data: { changeDeviceName: { id: '1', name: 'New Device Name' } },
    },
  }
];
