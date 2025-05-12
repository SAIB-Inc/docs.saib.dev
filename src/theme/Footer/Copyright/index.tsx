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
        className="footer__copyright text-[11px] md:text-base"
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
    </div>

  );
}
