import { ButtonBase, useTheme } from '@mui/material';
import { themes } from 'prism-react-renderer';
import { forwardRef, ReactNode } from 'react';

export default function AvatarButton({ src, top, left, link, scale = 1 }):ReactNode {

    const theme = useTheme();

  return (
    <ButtonBase
      LinkComponent={'a'}      //Change to ExternalLink after button-states-and-links merge
      href={link}
      sx={{
        position: 'absolute',
        top,
        left,
        transform: `scale(${scale})`,
        borderRadius: '50%',
        width: '53.55px',
        height: '53.55px',
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <div
        style={{
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <img
          src={src}
          alt=""
          style={{
            width: '45.55px',
            height: '45.55px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
    </ButtonBase>
  );
}
