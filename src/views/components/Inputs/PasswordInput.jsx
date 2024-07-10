import React from 'react';
import { useState } from 'react';
import { EyeClosedIcon, EyeIcon } from '../../../icons';
import { BaseInput } from './BaseInput';

export const PasswordInput = ({ label, placeholder, description, onPasswordChange, inputId = 'password', ...props }) => (
  <div className="input-container">
    <label htmlFor={inputId} className="input-title">{label}</label>
    <PasswordInputContent
      id={inputId}
      placeholder={placeholder}
      onPasswordChange={onPasswordChange}
      {...props}
    />
    {description && <div className="input-description">{description}</div>}
  </div>
);

const PasswordInputContent = ({ onPasswordChange, name = 'password', ...others }) => {
  const [ value, setValue ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onPasswordChange(name, newValue);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <BaseInput
      {...others}
      type={showPassword ? 'text' : 'password'}
      value={value}
      name="password"
      onChange={handleChange}
      endAdornment={
        <div
          aria-label="toggle password visibility"
          onClick={handleTogglePasswordVisibility}
          onMouseDown={handleMouseDownPassword}
          className="password-icon-container"
        >
          {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
        </div>
      }
    />
  );
};
