import React from 'react';
import { BaseInput } from './BaseInput';

export const LabeledInput = ({ id, label, onChange, name, ...props }) => (
  <div className="input-container">
    <label htmlFor={id} className="input-title">{label}</label>
    <BaseInput
      onChange={(event) => onChange(name, event.target.value)}
      id={id}
      {...props}
    />
  </div>
);
