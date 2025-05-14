import { ButtonBase, useTheme } from '@mui/material';
import { themes } from 'prism-react-renderer';
import { forwardRef, ReactNode } from 'react';

export default function AvatarButton({ datum, index }):ReactNode {

    const theme = useTheme();

  return (
    <ButtonBase
        LinkComponent='a'
        href={datum.link}
        target='_blank'
        id={datum.name}
        sx={{
            backgroundColor: theme.palette.background.default,
            position: "relative",
            left: `-${index * 16}px`,
            borderRadius: "50%",
            padding: "4px"
        }}
    >
        <div
            style={{
            borderRadius: '50%',
            overflow: 'hidden',
            }}
            className='size-9 sm:size-12 md:size-10'
          >
            <img
            src={datum.src}
            alt={datum.alt}
            style={{
                objectFit: 'cover',
                objectPosition: 'center',
            }}
            />
        </div>
    </ButtonBase> 
  );
}
