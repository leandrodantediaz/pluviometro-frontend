import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const ArrowLeftIcon = (props) => (
  <SvgIcon {...props}>
    <svg
      width="35"
      height="36"
      viewBox="0 0 35 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="35"
        height="36"
        rx="6"
        transform="matrix(-1 0 0 1 35 0)"
        fill="#F1F1F1"
      />
      <path
        d="M21 11L14 18L21 25"
        stroke="black"
        strokeOpacity="0.75"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </SvgIcon>
);

export default ArrowLeftIcon;
