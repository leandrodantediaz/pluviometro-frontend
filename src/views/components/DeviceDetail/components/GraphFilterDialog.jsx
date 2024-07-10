import React from 'react';
import {
  Autocomplete, Button, Chip, Dialog, FormControl,
  FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField 
} from '@mui/material';

export const GraphFilterDialog = ({ 
  isOpen,
  handleFilterClose,
  temporalFilters,
  handleFilterChange, 
  handleSaveFilters, 
  handleResetFilters
}) => {  
  const handleApplyFilter = () => { 
    handleSaveFilters();
    handleFilterClose(); 
  };

  const handleCancelFilter = () => { 
    handleResetFilters();
    handleFilterClose(); 
  };

  return(
    <Dialog
      open={isOpen}
      onClose={handleFilterClose}
      maxWidth="md"
      fullWidth
    >
      <div className="dialog-body">
        <div className="dialog-title">Filtros</div>
        <div className="dialog-description">Explicativo de lo que se va a poder hacer en esta pantalla</div>
        <DevicesFilters 
          devices={temporalFilters.devices}
          selectedDevices={temporalFilters.selectedDevices}
          onDeviceChange={(value) => handleFilterChange('selectedDevices', value)}
        />
        <PeriodicityFilters
          periodicity={temporalFilters.periodicity}
          onPeriodicityChange={(value) => handleFilterChange('periodicity', value)}
          monthlyGroupBy={temporalFilters.monthlyGroupBy}
          onMonthlyGroupByChange={(value) => handleFilterChange('monthlyGroupBy', value)}
          anualGroupBy={temporalFilters.calendarType}
          onAnualGroupByChange={(value) => handleFilterChange('calendarType', value)}
        />
      </div>
    
      <div className="dialog-buttons-container">
        <Button
          className="dialog-button"
          variant="outlined"
          color="gray"
          onClick={handleCancelFilter}
        >
          Cancelar
        </Button>
        <Button
          className="dialog-button"
          variant="contained"
          color="secondary"
          onClick={handleApplyFilter}
        >
          Aplicar Filtro
        </Button>
      </div>
    </Dialog>
  ); 
};

const DevicesFilters = ({ devices, selectedDevices, onDeviceChange }) => (
  <div>
    <div className="section-title">Dispositivo</div>
    <Autocomplete
      style={{ width: '50%' }}
      multiple
      options={devices}
      getOptionLabel={(device) => device.name}
      value={selectedDevices}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onChange={(event, newValue) => onDeviceChange(newValue)}
      color="secondary"
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          color="secondary"
          variant="standard"
          label= {<div className="section-item">Agregar dispositivo</div>}
        />
      )}
      renderTags={(tagValue, getTagProps) => tagValue.map((option, index) => (
        <Chip
          {...getTagProps({ index })}
          key={option.id}
          label={option.name}
          size="small"
        />
      ))}
      renderOption={(props, option, state) => (
        <li
          {...props}
          key={option.id}
          style={{
            ...props.style,
            ...(state.selected ? { backgroundColor: '#2156bb29' } : {}),
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {option.name}
        </li>
      )}
    />
  </div>
);


const PeriodicityFilters = ({ 
  periodicity,
  onPeriodicityChange,
  monthlyGroupBy,
  onMonthlyGroupByChange, 
  anualGroupBy,
  onAnualGroupByChange 
}) => {
  const monthlyGroupByOptions = [ 'Días', 'Semanas' ];
  const anualGroupByOptions = [ 'Natural', 'Agrícola' ];
  
  return (
    <div>
      <div className="section-title">Periodicidad</div>
      <FormControl>
        <RadioGroup
          value={periodicity}
          onChange={(event) => onPeriodicityChange(event.target.value)}
        >
          <FormControlLabel
            className="section-item"
            value="diaria"
            control={<Radio color="secondary" size="small" />}
            label={<div className="section-item">Diaria</div>}
          />
          <FormControlLabel
            className="section-item"
            value="semanal"
            control={<Radio color="secondary" size="small" />}
            label={<div className="section-item">Semanal</div>}
          />
          <FormControlLabel
            className="section-item"
            value="mensual"
            control={<Radio color="secondary" size="small" />}
            label={
              <div className="section-label-filter">
                <div className="section-item">Mensual</div>
                { periodicity === 'mensual' && (
                  <MensualFilters
                    monthlyGroupBy={monthlyGroupBy}
                    onMonthlyGroupByChange={onMonthlyGroupByChange}
                    monthlyGroupByOptions={monthlyGroupByOptions}
                  />
                )}
              </div>
            }
          />
          <FormControlLabel
            className="section-item"
            value="anual"
            control={<Radio color="secondary" size="small" />}
            label={
              <div className="section-label-filter">
                <div className="section-item">Anual</div>
                { periodicity === 'anual' && (
                  <AnualFilters
                    anualGroupBy={anualGroupBy}
                    onAnualGroupByChange={onAnualGroupByChange}
                    anualGroupByOptions={anualGroupByOptions}
                  />
                )}
              </div>
            }
          />
        </RadioGroup>
      </FormControl>
    </div>
  ); 
};

const AnualFilters = (props) => (
  <GroupByFilter
    groupBy={props.anualGroupBy}
    onGroupByChange={props.onAnualGroupByChange}
    groupByOptions={props.anualGroupByOptions}
  />
);

const MensualFilters = (props) => (
  <GroupByFilter
    groupBy={props.monthlyGroupBy}
    onGroupByChange={props.onMonthlyGroupByChange}
    groupByOptions={props.monthlyGroupByOptions}
  />
);  

const GroupByFilter = ({ groupBy, onGroupByChange, groupByOptions }) => (
  <FormControl variant="standard" color="secondary" style={{ width: '200px' }}>
    <Select
      value={groupBy}
      onChange={(event) => onGroupByChange(event.target.value)}
      displayEmpty
      className="select-filter"
      MenuProps={{
        sx: {
          '&& .Mui-selected': { backgroundColor: '#2156bb29' },
          '&& .Mui-selected:hover': { backgroundColor: '#2156bb29' },
        },
      }}
    >
      {groupByOptions.map((option) => (
        <MenuItem
          key={option}
          value={option}
          style={{ fontSize: '14px', fontWeight: '500', '&:hover': { backgroundColor: '#2156bb29' } }}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
