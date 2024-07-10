
import React, {useState} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = ({ onDeviceDetailOpen, device }) => {
  const [ infowindowOpen, setInfowindowOpen ] = useState(true);
  const [ markerRef, marker ] = useAdvancedMarkerRef();

  const handleMarkerClick = () => {
    setInfowindowOpen(true);
    onDeviceDetailOpen(device); 
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={handleMarkerClick}
        position={device.position}
      >
        <Pin background={'#F25817'} scale={1.2} glyphColor={'#FFFFFF'} />
      </AdvancedMarker>
      {infowindowOpen && (
        <InfoWindow
          shouldFocus={false}
          anchor={marker}
          onCloseClick={() => setInfowindowOpen(false)}
          ariaLabel={device.name}
        >
          <div style={{ color: 'black', fontWeight: '500' }}>
            {device.name}
          </div>
        </InfoWindow>
      )}
    </>
  );
};
