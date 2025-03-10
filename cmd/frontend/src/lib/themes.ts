// import { useEffect, useState } from 'react';
import { green, grey, orange, red } from '@mui/material/colors';
import { createTheme, Theme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette.d' {
  interface Palette {
    success: PaletteColor;
    sidebarLink: {
      [propName: string]: any;
    };
    [propName: string]: any;
  }
  interface PaletteOptions {
    success?: PaletteColorOptions;
    sidebarLink: {
      [propName: string]: any;
    };
    [propName: string]: any;
  }
}

const commonRules = {
  // @todo: Remove this once we have tested and fixed the theme for the new breakpoints.
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#4456a6',
    },
    secondary: {
      main: '#e91e63',
    },
    background: {
      paper: '#ffffff',
      default: '#fcfcfc',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: orange['500'],
    },
    success: {
      main: '#388e3c',
    },
    squareButton: {
      background: '#f5f5f5',
    },
    sidebarLink: {
      color: grey['900'],
      main: {
        selected: {
          color: '#fff',
          backgroundColor: grey['600'],
        },
        color: '#000',
      },
      selected: {
        color: '#4456A6',
        backgroundColor: 'transparent',
      },
      hover: {
        color: '#000',
        backgroundColor: grey['300'],
      },
    },
    clusterChooser: {
      button: {
        color: '#fff',
        background: '#000',

        hover: {
          background: '#605e5c',
        },
      },
    },
    sidebarButtonInLinkArea: {
      color: '#fff',
      primary: {
        background: '#605e5c',
      },
      hover: {
        background: '#3B3A39',
      },
    },
    home: {
      status: {
        error: red['800'],
        success: '#107C10',
        warning: orange['50'],
        unknown: grey['800'],
      },
    },
    sidebarBg: grey['100'],
    sidebarGroupBg: '#fff',
    resourceToolTip: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    normalEventBg: '#F0F0F0',
    chartStyles: {
      defaultFillColor: grey['300'],
      labelColor: '#000',
    },
    metadataBgColor: '#f3f2f1',
    headerStyle: {
      normal: {
        fontSize: '1.8rem',
        fontWeight: '700',
      },
      main: {
        fontSize: '1.87rem',
        fontWeight: '700',
      },
      subsection: {
        fontSize: '1.85rem',
        fontWeight: '700',
      },
      label: {
        fontSize: '1.6rem',
        paddingTop: '1rem',
      },
    },
    tables: {
      head: {
        background: '#faf9f8',
        color: '#242424',
        borderColor: 'rgba(0,0,0,0.12)',
      },
      body: {
        background: '#fff',
      },
    },
    notificationBorderColor: 'rgba(0,0,0,0.12)',
  },
  typography: {
    fontFamily: ['NotoSansKR', 'Overpass', 'sans-serif'].join(', '),
    h1: {
      fontWeight: 700,
      fontSize: '1.87rem',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@media (prefers-reduced-motion: reduce)': {
            '*': {
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
              scrollBehavior: 'auto !important',
            },
          },
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard' as 'filled' | 'outlined' | 'standard',
      },
    },

    MuiFormControl: {
      defaultProps: {
        variant: 'standard' as 'filled' | 'outlined' | 'standard',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard' as 'filled' | 'outlined' | 'standard',
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1.3em',
          color: '#fff',
          backgroundColor: '#000',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'medium' as 'medium' | 'large' | 'small' | undefined,
      },
      styleOverrides: {
        colorPrimary: {
          color: '#000',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0078D4',
        },
      },
      defaultProps: {
        underline: 'hover' as 'always' | 'hover' | 'none',
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
      '@media (min-width:600px)': 48,
    },
  },
};
const lightTheme = createTheme(commonRules);

const darkTheme = createTheme({
  ...commonRules,
  palette: {
    ...commonRules.palette,
    tables: {
      head: {
        background: '#000',
        color: '#aeaeae',
        borderColor: 'rgba(255,255,255,0.12)',
      },
      body: {
        background: '#1B1A19',
      },
    },
    primary: {
      contrastText: '#000',
      main: '#4B99EE',
    },
    squareButton: {
      background: '#424242',
    },
    primaryColor: '#fff',
    chartStyles: {
      defaultFillColor: 'rgba(20, 20, 20, 0.1)',
      fillColor: '#929191',
      labelColor: '#fff',
    },
    success: {
      light: green['800'],
      main: green['50'],
      ...green,
    },
    warning: {
      main: 'rgb(255 181 104)', // orange
      light: 'rgba(255, 152, 0, 0.15)',
      ...orange,
    },
    error: {
      main: red['800'],
      light: 'rgba(244, 67, 54, 0.2)',
    },
    home: {
      status: {
        error: '#E37D80',
        success: '#54B054',
        warning: '#FEEE66',
        unknown: '#D6D6D6',
      },
    },
    normalEventBg: '#333333',
    metadataBgColor: '#333',
    resourceToolTip: {
      color: 'rgba(255, 255, 255, 0.87)',
    },
    clusterChooser: {
      button: {
        color: '#fff',
        background: '#605e5c',

        hover: {
          background: '#3B3A39',
        },
      },
    },
    sidebarButtonInLinkArea: {
      color: '#fff',
      primary: {
        background: 'rgba(255, 255, 255, 0.16)',
      },
      hover: {
        background: 'rgba(255, 255, 255, 0.08)',
      },
    },
    sidebarLink: {
      color: '#fff',
      main: {
        selected: {
          color: '#fff',
          backgroundColor: 'rgba(255, 255, 255, 0.16)',
        },
        color: '#fff',
      },
      selected: {
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.16)',
      },
      hover: {
        color: '#000',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    sidebarBg: '#121212',
    sidebarGroupBg: '#121212',
    notificationBorderColor: 'rgba(255,255,255,0.12)',
    mode: 'dark',
    // type: 'dark',
    background: {
      default: '#121212',
      paper: '#121212',
    },
  },
  components: {
    ...commonRules.components,
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...commonRules.components.MuiTooltip.styleOverrides.tooltip,
          backgroundColor: '#000',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          colorPrimary: {
            backgroundColor: '#000',
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'medium' as 'medium' | 'large' | 'small' | undefined,
      },
      styleOverrides: {
        colorPrimary: {
          color: '#fff',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#6CB6F2',
        },
      },
      defaultProps: {
        underline: 'hover' as 'always' | 'hover' | 'none',
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          colorPrimary: {
            '&&.Mui-checked': {
              color: '#4b99ee',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          '&&.Mui-selected': {
            color: '#fff',
            borderBottomColor: '#fff',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          indicator: {
            backgroundColor: '#fff',
          },
        },
      },
    },
  },
});

export interface ThemesConf {
  [themeName: string]: Theme;
}

const themesConf: ThemesConf = {
  light: lightTheme,
  dark: darkTheme,
};

export default themesConf;

// export function usePrefersColorScheme() {
//   if (typeof window.matchMedia !== 'function') {
//     return 'light';
//   }

//   const mql = window.matchMedia('(prefers-color-scheme: dark)');
//   const [value, setValue] = useState(mql.matches);

//   useEffect(() => {
//     const handler = (x: MediaQueryListEvent | MediaQueryList) => setValue(x.matches);
//     mql.addListener(handler);
//     return () => mql.removeListener(handler);
//   }, []);

//   return value;
// }

type ThemeUnion = 'light' | 'dark';
/**
 * Hook gets theme based on user preference, and also OS/Browser preference.
 * @returns 'light' | 'dark' theme name
 */
export function getThemeName(): ThemeUnion {
  const themePreference: ThemeUnion = localStorage.theme;

  if (typeof window.matchMedia !== 'function') {
    return 'light';
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  let themeName: ThemeUnion = 'light';
  if (themePreference) {
    // A selected theme preference takes precedence.
    themeName = themePreference;
  } else {
    if (prefersLight) {
      themeName = 'light';
    } else if (prefersDark) {
      themeName = 'dark';
    }
  }
  if (!['light', 'dark'].includes(themeName)) {
    themeName = 'light';
  }

  return themeName;
}

export function setTheme(themeName: string) {
  localStorage.theme = themeName;
}
