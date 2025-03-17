import { MouseEvent, ReactElement } from 'react';

import { ToggleButton, ToggleButtonGroup as ToggleButtonGroupBase } from '@mui/material';

import { map } from 'lodash';

import style from './ImageToggleButtonGroup.module.scss';

interface ButtonIcon {
  value: string;
  image: ReactElement | any;
}

interface ImageToggleButtonGroupProps {
  value?: string;
  onChange?: (e: MouseEvent<HTMLElement>, v: any) => void;
  items: ButtonIcon[];
}

const ImageToggleButtonGroup = ({ value, onChange, items }: ImageToggleButtonGroupProps) => {
  return (
    <ToggleButtonGroupBase value={value} exclusive className={style.imgToggleBtnGroup} onChange={onChange}>
      {map(items, (item) => (
        <ToggleButton value={item.value} className={style.imgToggleBtn} key={item.value}>
          {item.image}
        </ToggleButton>
      ))}
    </ToggleButtonGroupBase>
  );
};

export default ImageToggleButtonGroup;
