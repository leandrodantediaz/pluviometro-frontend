import React from 'react';
import { useState } from 'react';
import { DropdownIcon } from '../../../icons';
import { MenuItem, Select } from '@mui/material';

export const DropdownInput = ({ label, onRolChange, ...props }) => (
  <div className="input-container">
    <label className="input-title">{label}</label>
    <DropdownInputContent
      onRolChange={onRolChange}
      {...props}
    />
  </div>
);

const DropdownInputContent = ({ onRolChange, name, ...others }) => {
  const [ value, setValue ] = useState('');

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onRolChange(name, newValue);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      IconComponent={DropdownIcon}
      {...others}
    >
      {[ 'Colaborador', 'Invitado' ].map((option) => (
        <MenuItem
          key={option}
          value={option}
          style={{ fontSize: '14px', fontWeight: '500', '&:hover': { backgroundColor: '#F2F4F8' } }}
        >
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};
