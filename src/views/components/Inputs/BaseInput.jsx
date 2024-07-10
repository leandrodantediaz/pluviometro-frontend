import React from 'react';
import { Input } from '@mui/base';
import { forwardRef } from 'react';
import './input.scss';

export const BaseInput = forwardRef(
  function CustomInput(props, ref) {
    const color = props.color || 'default';

    return (
      <Input
        slotProps={{
          root: { className: `${color === 'grey' ? 'input-root-grey' : 'input-root'}`},
          input: { className: `${color === 'grey' ? 'input-grey' : 'input'}` },
        }}
        {...props}
        ref={ref}
      />
    );
  }
);
