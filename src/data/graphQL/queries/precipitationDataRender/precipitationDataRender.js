import { gql } from '@apollo/client';

export const PRECIPITATION_DATA_RENDER = gql`
query PrecipitationDataRender ($date: DateTime!, $devicesIds: [Int!], $periodicity: PeriodicityTypes!) {
  precipitationDataRender ( 
    input: { 
        date: $date
        devicesIds: $devicesIds
        periodicity: $periodicity
    }
  ) {
    date
    deviceId
    deviceName
    precipitation
  }
}`;
