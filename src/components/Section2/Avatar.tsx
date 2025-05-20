import { ButtonBase, useTheme } from '@mui/material';
import { FC } from 'react';

interface AvatarButtonProps {
  datum: {
    link: string;
    src: string;
    alt: string;
  };
  index: number;
}

const AvatarButton: FC<AvatarButtonProps> = ({ datum, index }) => {
  const theme = useTheme();

  return (
    <ButtonBase
      id={datum.alt}
      LinkComponent="a"
      href={datum.link}
      target="_blank"
      sx={{
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        left: `-${index * 16}px`,
        borderRadius: '50%',
        padding: '4px',
      }}
    >
      <div
        style={{
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        className="size-9 sm:size-12 md:size-10"
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
};

export default AvatarButton;
