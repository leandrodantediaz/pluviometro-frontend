import { formatDate } from '../../../../../utils/dates/formatDate';

export const deviceAdapter = (device) => {
  if (!device) return null;
  return {
    ...device,
    position: { lat: Number(device.latitude), lng: Number(device.longitude) },
    modificationDate: formatDate(device.modificationDate),
    lastCommunicationDate: formatDate(device.lastCommunicationDate)
  };
};
