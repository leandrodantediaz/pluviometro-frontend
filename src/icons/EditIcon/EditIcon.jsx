import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';

const EditIcon = ({strokeWidth = 1, ...props}) => (
  <SvgIcon {...props} fontSize="16">
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_603_3725)">
        <path
          d="M11.3334 1.99955C11.5085 1.82445 11.7163 1.68556 11.9451 1.5908C12.1739 1.49604 12.4191 1.44727 12.6667 1.44727C12.9143 1.44727 13.1595 1.49604 13.3883 1.5908C13.6171 1.68556 13.8249 1.82445 14 1.99955C14.1751 2.17465 14.314 2.38252 14.4088 2.61129C14.5036 2.84006 14.5523 3.08526 14.5523 3.33288C14.5523 3.58051 14.5036 3.8257 14.4088 4.05448C14.314 4.28325 14.1751 4.49112 14 4.66622L5.00004 13.6662L1.33337 14.6662L2.33337 10.9995L11.3334 1.99955Z"
          stroke="#212628"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_603_3725">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>

  </SvgIcon>
);

export default EditIcon;
