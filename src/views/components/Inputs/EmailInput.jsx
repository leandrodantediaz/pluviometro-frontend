import React from 'react';
import { LabeledInput } from './LabeledInput';

export const EmailInput = ({ label, placeholder, onEmailChange, ...props }) => (
  <LabeledInput
    id="email"
    type="text" 
    label={label}
    placeholder={placeholder}
    onChange={onEmailChange}
    name="email"
    {...props}
  />
);
