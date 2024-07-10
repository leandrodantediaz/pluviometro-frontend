import { useState, useEffect } from 'react';

export const DEFAULT_CAMERA = {
  center: { lat: -37.185509, lng: -65.630371 },
  zoom: 5
};

const DEFAULT_BOUNDS = 250;

const useCenterMap = (map, devices, loadingDevices) => {
  const [ loadingMap, setLoadingMap ] = useState(true);
  const [ centerMap, setCenterMap ] = useState(false);

  useEffect(() => {
    if (map && !loadingDevices && devices.length >= 0) {
      if (devices.length === 0) {
        map.setCenter(DEFAULT_CAMERA.center);
        map.setZoom(DEFAULT_CAMERA.zoom);
      }
      else {
        const bounds = new window.google.maps.LatLngBounds();
        for (let i = 0; i < devices.length; i++) {
          const { lat, lng } = devices[i].position;
          const coordinates = new window.google.maps.LatLng(lat, lng);
          bounds.extend(coordinates);
        }
        map.fitBounds(bounds, DEFAULT_BOUNDS);
      }
      setLoadingMap(false);
    } else {
      setLoadingMap(true);
    }
  }, [ devices, map, centerMap ]);

  const handleCenterMap = () => {
    setCenterMap(prev => !prev);
  };

  return { loadingMap, handleCenterMap };
};

export default useCenterMap;
