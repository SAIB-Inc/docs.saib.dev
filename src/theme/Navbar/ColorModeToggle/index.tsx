import React, { type ReactNode } from 'react';
import {useColorMode, useThemeConfig} from '@docusaurus/theme-common';
import type {Props} from '@theme/Navbar/ColorModeToggle';
import { IconButton, useTheme } from '@mui/material';
import ColorModeIcon from '@site/static/img/color_mode_logo';

export default function NavbarColorModeToggle({className}: Props): ReactNode {
  const theme = useTheme();
  const disabled = useThemeConfig().colorMode.disableSwitch;
  const {colorMode, setColorMode} = useColorMode();

  if (disabled) {
    return null;
  }

  const isDark = colorMode === 'dark';

  return (
    <IconButton
      className={className}
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      title="Toggle color mode"
      sx={{
        border: 1,
        borderColor: theme.palette.primary.contrastText,
        padding: '5px',
        opacity: '60%',
        '&:hover': {
          opacity: '100%',
          backgroundColor: 'transparent'
        },
      }}
    >
      <ColorModeIcon 
        sx={{
          color: theme.palette.primary.contrastText,
          fontSize: 20,
        }}
      /> 
    </IconButton>
  );
}
