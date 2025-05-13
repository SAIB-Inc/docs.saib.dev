import React, { type ReactNode } from 'react';
import type { Props } from '@theme/Footer/Copyright';
import { Link, useTheme } from '@mui/material';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from 'react-router';

export default function FooterCopyright({ copyright }: Props): ReactNode {
    const location = useLocation();
    const theme = useTheme();
    const { colorMode } = useColorMode();
    
  return (
    <div className={`container flex ${location.pathname.startsWith("/docs") ? "justify-center" : "justify-between"}`}>
      <div
        className="footer__copyright text-[11px] md:text-base"
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
    </div>

  );
}
