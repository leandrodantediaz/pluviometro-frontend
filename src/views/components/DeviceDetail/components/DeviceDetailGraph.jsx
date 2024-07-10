import React from 'react';
import { usePrecipitationData } from '../hooks/usePrecipitationData';
import { Skeleton } from '@mui/material';
import { GraphFilterDialog } from './GraphFilterDialog';
import { BarChart } from '../../BarChart/BarChart';

export const DeviceDetailGraph = ({ showActions = false, graphFilterProps }) => {
  const {
    filters,
    temporalFilters,
    filterDialogOpen,
    handleFilterChange,
    handleSaveFilters,
    handleResetFilters,
    closeFilterDialog,
  } = graphFilterProps;
  
  const {
    chartData,
    loadingPrecipitationData
  } = usePrecipitationData(filters);

  if (loadingPrecipitationData) return <DeviceDetailGraphSkeleton />;

  return (
    <>
      {chartData && <div className={showActions ? 'graph-title' : 'graph-title-small'}>{chartData.title}</div>}
      {chartData &&
        <div className="graph-container">
          <BarChart
            data={{ 
              labels: chartData.labels,
              datasets: chartData.datasets 
            }}
          />
        </div>
      }

      {showActions &&
        <GraphFilterDialog
          isOpen={filterDialogOpen}
          handleFilterClose={closeFilterDialog}
          temporalFilters={temporalFilters}
          handleFilterChange={handleFilterChange}
          handleSaveFilters={handleSaveFilters}
          handleResetFilters={handleResetFilters}
        />
      }
    </>
  );
};

const DeviceDetailGraphSkeleton = () => (
  <Skeleton variant="rectangular" height={200} />
);
