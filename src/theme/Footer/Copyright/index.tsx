import React, { type ReactNode } from 'react';
import type { Props } from '@theme/Footer/Copyright';
import { Link, useTheme } from '@mui/material';
import { useColorMode } from '@docusaurus/theme-common';

export default function FooterCopyright({ copyright }: Props): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    
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
            color: theme.palette.text.primary,
            fontSize: '12.71px',
            lineHeight: '17.794px',
            letterSpacing: '0.5084px',
            '&:visited': {
              color: theme.palette.text.primary,
            },
            '&:hover': {
              color: theme.palette.text.primary,
            },
          }}
          href="#"
        >
          EN
        </Link>
        <Link
          underline="none"
          sx={{
            color: theme.palette.text.primary,
            fontSize: '12.71px',
            lineHeight: '17.794px',
            letterSpacing: '0.5084px',
            '&:visited': {
              color: theme.palette.text.primary,
            },
            '&:hover': {
              color: theme.palette.text.primary,
            },
          }}
          href="#"
        >
          SE
        </Link>
        <Link
          underline="none"
          sx={{
            color: theme.palette.text.primary,
            fontSize: '12.71px',
            lineHeight: '17.794px',
            letterSpacing: '0.5084px',
            '&:visited': {
              color: theme.palette.text.primary,
            },
            '&:hover': {
              color: theme.palette.text.primary,
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
