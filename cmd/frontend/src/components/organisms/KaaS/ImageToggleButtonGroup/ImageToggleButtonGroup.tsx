import { ReactElement } from 'react';

import { Box, ToggleButton, ToggleButtonGroup as ToggleButtonGroupBase } from '@mui/material';

import { map } from 'lodash';

import style from './ImageToggleButtonGroup.module.scss';

import clsx from 'clsx';

interface ButtonIcon extends Omit<React.ComponentPropsWithoutRef<typeof ToggleButton>, 'value'> {
  value: string;
  image: ReactElement | any;
}

interface ImageToggleButtonGroupProps extends React.ComponentPropsWithoutRef<typeof ToggleButtonGroupBase> {
  items: ButtonIcon[];
  exclusive?: boolean;
}

const ImageToggleButtonGroup = ({ items, exclusive = true, ...props }: ImageToggleButtonGroupProps) => {
  return (
    <ToggleButtonGroupBase {...props} exclusive={exclusive} className={clsx(style.imgToggleBtnGroup, props.className)}>
      {map(items, ({ value, image, ...props }) => (
        <ToggleButton {...props} value={value} className={clsx(style.imgToggleBtn, props.className)} key={value}>
          <Box className={style.image}>{image}</Box>
        </ToggleButton>
      ))}
    </ToggleButtonGroupBase>
  );
};

export default ImageToggleButtonGroup;
