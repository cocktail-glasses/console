import { forwardRef, useEffect, useState } from 'react';

import { Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { SxProps, Theme, useTheme } from '@mui/material/styles';

import { LightTooltip, TooltipIcon } from '@components/common/Tooltip';
import { Icon, IconProps } from '@iconify/react';
import { DateFormatOptions, localeDate, timeAgo } from '@lib/util';

export interface InfoLabelProps {
  name: string;
  value?: string | null;
}

export function InfoLabel(props: React.PropsWithChildren<InfoLabelProps>) {
  const { name, value = null } = props;

  return (
    <Grid container item spacing={2} justifyContent="flex-start" alignItems="flex-start">
      <Grid
        item
        xs
        sx={{
          textAlign: 'right',
          flex: '0 0 200px',
        }}
      >
        <NameLabel>{name}</NameLabel>{' '}
      </Grid>
      <Grid item xs>
        {value !== null ? <ValueLabel>{value}</ValueLabel> : props.children}
      </Grid>
    </Grid>
  );
}

export function NameLabel(props: React.PropsWithChildren<{}>) {
  return (
    <Typography
      sx={(theme: Theme) => ({
        color: theme.palette.text.secondary,
        fontSize: theme.typography.pxToRem(16),
        textAlign: 'right',
      })}
      component="span"
    >
      {props.children}
    </Typography>
  );
}

export function ValueLabel(props: React.PropsWithChildren<{}>) {
  return (
    <Typography
      sx={(theme: Theme) => ({
        color: theme.palette.text.primary,
        fontSize: theme.typography.pxToRem(16),
        wordBreak: 'break-word',
      })}
      component="span"
    >
      {props.children}
    </Typography>
  );
}

export interface StatusLabelProps {
  status: 'success' | 'warning' | 'error' | '';
  sx?: SxProps<Theme>;
  [otherProps: string]: any;
}

export const StatusLabel = forwardRef((props: StatusLabelProps) => {
  const { status, sx, className = '', children, ...other } = props;
  const theme = useTheme();

  // const statuses = ['success', 'warning', 'error'];

  const colorSet = {
    success: {
      borderColor: 'hsl(120, 75%, 87%)',
      backgroundColor: 'hsl(120, 80%, 98%)',
      color: 'hsl(120, 59%, 30%);',
    },

    warning: {
      borderColor: 'hsl(45, 75%, 87%)',
      backgroundColor: 'hsl(45, 80%, 98%)',
      color: 'hsl(45, 59%, 30%);',
    },

    error: {
      borderColor: 'hsl(0, 75%, 87%)',
      backgroundColor: 'hsl(0, 80%, 98%)',
      color: 'hsl(0, 59%, 30%);',
    },

    '': {
      borderColor: 'hsl(210, 16%, 82%)',
      backgroundColor: 'hsl(210, 16%, 97%)',
      color: 'hsl(210, 16%, 20%)',
    },
  };

  const darkColorSet = {
    success: {
      borderColor: 'hsl(120, 84%, 10%)',
      backgroundColor: 'hsl(120, 87%, 6%)',
      color: 'hsl(120, 61%, 77%)',
    },
    warning: {
      borderColor: 'hsl(45, 84%, 10%)',
      backgroundColor: 'hsl(45, 87%, 6%)',
      color: 'hsl(45, 61%, 77%)',
    },
    error: {
      borderColor: 'hsl(0, 84%, 10%)',
      backgroundColor: 'hsl(0, 87%, 6%)',
      color: 'hsl(0, 61%, 77%)',
    },
    '': {
      borderColor: 'hsl(210, 84%, 10%)',
      backgroundColor: 'hsl(210, 87%, 6%)',
      color: 'hsl(210, 61%, 77%)',
    },
  };

  // Assign to a status color if it exists.
  // const bgColor = statuses.includes(status) ? theme.palette[status].light : theme.palette.normalEventBg;
  // const color = statuses.includes(status) ? theme.palette[status].main : theme.palette.text.primary;
  // const color = theme.palette.text.primary;

  const chipColor = theme.palette.mode === 'light' ? colorSet[status] : darkColorSet[status];
  return (
    <Chip
      label={children}
      variant="outlined"
      sx={{
        ...chipColor,
        fontWeight: 'bold',
        ...sx,
      }}
      className={className}
      {...other}
    />
    // <Typography
    //   sx={{
    //     color: theme.palette.primary.contrastText,
    //     fontSize: theme.typography.pxToRem(14),
    //     paddingLeft: theme.spacing(1),
    //     paddingRight: theme.spacing(1),
    //     paddingTop: theme.spacing(0.5),
    //     paddingBottom: theme.spacing(0.5),
    //     display: 'inline-block',
    //     textAlign: 'center',
    //     alignItems: 'center',
    //     borderRadius: theme.spacing(2),
    //     ...sx,
    //   }}
    //   className={className}
    //   style={{
    //     backgroundColor: bgColor,
    //     color,
    //   }}
    //   component="span"
    //   {...other}
    // />
  );
});

export function makeStatusLabel(label: string, successStatusName: string) {
  return <StatusLabel status={label === successStatusName ? 'success' : 'error'}>{label}</StatusLabel>;
}

export interface HeaderLabelProps {
  label: string;
  value: string;
  tooltip?: string | null;
}

export function HeaderLabel(props: HeaderLabelProps) {
  const { value, label, tooltip } = props;

  return (
    <Grid container alignItems="center" direction="column">
      <Grid item>
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '1.2em',
            flexGrow: 1,
            fontWeight: 'bold',
          }}
          display="inline"
        >
          {label}
        </Typography>
        {!!tooltip && <TooltipIcon>{tooltip}</TooltipIcon>}
      </Grid>
      <Grid item container alignItems="center" justifyContent="center">
        <Grid item>
          <Typography
            sx={{
              fontSize: '3rem;',
            }}
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}

export interface HoverInfoLabelProps {
  label: React.ReactNode;
  hoverInfo?: React.ReactNode;
  labelProps?: TypographyProps;
  icon?: IconProps['icon'];
  iconProps?: Omit<IconProps, 'icon'>;
  iconPosition?: 'start' | 'end';
}

export function HoverInfoLabel(props: HoverInfoLabelProps) {
  const { label, hoverInfo, icon = null, iconProps = {}, labelProps, iconPosition = 'end' } = props;
  const labelFirst = iconPosition === 'end';

  return (
    <LightTooltip title={hoverInfo || ''}>
      <Typography
        sx={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
        }}
        {...labelProps}
      >
        {labelFirst && label}
        {hoverInfo && (
          <Icon
            icon={icon || 'mdi:information-outline'}
            width="1rem"
            height="1rem"
            style={{
              marginRight: '0.2rem',
              marginLeft: '0.2rem',
              alignSelf: 'center',
            }}
            {...iconProps}
          />
        )}
        {!labelFirst && label}
      </Typography>
    </LightTooltip>
  );
}

export interface DateLabelProps {
  date: number | string | Date;
  format?: DateFormatOptions;
  iconProps?: Omit<IconProps, 'icon'>;
}

export function DateLabel(props: DateLabelProps) {
  const { date, format = 'brief', iconProps = {} } = props;
  return (
    <HoverInfoLabel
      label={<TimeAgo date={date} format={format} />}
      hoverInfo={localeDate(date)}
      icon="mdi:calendar"
      iconProps={iconProps}
    />
  );
}

/**
 * Shows time passed since given date
 * Automatically refreshes
 */
function TimeAgo({ date, format }: { date: number | string | Date; format?: DateFormatOptions }) {
  const [formattedDate, setFormattedDate] = useState<string>(() => timeAgo(date, { format }));

  useEffect(() => {
    const id = setInterval(() => {
      const newFormattedDate = timeAgo(date, { format });
      setFormattedDate(newFormattedDate);
    }, 1_000);

    return () => clearInterval(id);
  }, []);

  return formattedDate;
}
