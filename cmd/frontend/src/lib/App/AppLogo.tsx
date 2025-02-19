import { Component, ComponentType, isValidElement, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

import SvgIcon from '@mui/material/SvgIcon';
import { SxProps, Theme } from '@mui/material/styles';

// import LogoDark from '../../resources/icon-dark.svg?react';
// import LogoLight from '../../resources/icon-light.svg?react';
// import LogoWithTextDark from '../../resources/logo-dark.svg?react';
// import LogoWithTextLight from '../../resources/logo-light.svg?react';
import CocktailCloudLogo from '../../resources/cocktailcloud-logo.svg?react';
import CocktailCloud from '../../resources/cocktailcloud.svg?react';

import { EmptyContent } from '@components/common';
import ErrorBoundary from '@components/common/ErrorBoundary';
import { getThemeName } from '@lib/themes';
import { useTypedSelector } from 'redux/reducers/reducers';

export interface AppLogoProps {
  /** The size of the logo. 'small' for in mobile view, and 'large' for tablet and desktop sizes. By default the 'large' is used. */
  logoType?: 'small' | 'large';
  /** User selected theme. By default it checks which is is active. */
  themeName?: 'dark' | 'light';
  /** A class to use on your SVG. */
  className?: string;
  /** SxProps to use on your SVG. */
  sx?: SxProps<Theme>;
  [key: string]: any;
}

export type AppLogoType = ComponentType<AppLogoProps> | ReactElement | typeof Component | null;

function OriginalAppLogo(props: AppLogoProps) {
  const { sx, className, logoType, themeName } = props;
  const navigate = useNavigate();
  return (
    <SvgIcon
      sx={sx}
      className={className}
      component={
        logoType === 'large'
          ? themeName === 'dark'
            ? CocktailCloud
            : CocktailCloudLogo
          : themeName === 'dark'
            ? CocktailCloud
            : CocktailCloudLogo
      }
      viewBox={themeName === 'dark' ? '0 0 125 22' : '0 0 1111 196'}
      onClick={() => {
        navigate('/');
      }}
    />
  );
}

export function AppLogo(props: AppLogoProps) {
  const { logoType = 'large', themeName = getThemeName() } = props;
  return <OriginalAppLogo logoType={logoType} themeName={themeName} sx={{ height: '32px', width: 'auto' }} />;
}
