import { deviceAdapter } from '../../getDeviceById/adapters/deviceAdapter';

export const allDevicesAdapter = devices => (
  devices?.filter(device => device.longitude && device.latitude)
    .map(device => deviceAdapter(device))
);
