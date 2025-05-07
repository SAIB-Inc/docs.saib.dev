import React, { type ReactNode } from 'react';
import type { Props } from '@theme/Footer/Copyright';
import { Link } from '@mui/material';


export default function FooterCopyright({ copyright }: Props): ReactNode {
  return (
    <div className='container flex justify-between'>
      <div
        className="footer__copyright"
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
      <div className='flex gap-x-[31px] items-center'>
        <Link
          underline="none"
          sx={{
            color: 'white',
            fontSize: '12.71px',
            lineHeight: '17.794px',
            letterSpacing: '0.5084px',
            '&:visited': {
              color: 'white',
            },
            '&:hover': {
              color: 'white',
            },
          }}
          href="#"
        >
          EN
        </Link>
        <Link
          underline="none"
          sx={{
            color: 'white',
            fontSize: '12.71px',
            lineHeight: '17.794px',
            letterSpacing: '0.5084px',
            '&:visited': {
              color: 'white',
            },
            '&:hover': {
              color: 'white',
            },
          }}
          href="#"
        >
          SE
        </Link>
        <Link
          underline="none"
          sx={{
            color: 'white',
            fontSize: '12.71px',
            lineHeight: '17.794px',
            letterSpacing: '0.5084px',
            '&:visited': {
              color: 'white',
            },
            '&:hover': {
              color: 'white',
            },
          }}
          href="#"
        >
          DE
        </Link>
      </div>
    </div>

  );
}
