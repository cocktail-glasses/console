import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';

import { PercentageCircle, PercentageCircleProps } from '@components/common/Chart';
import { TooltipIcon } from '@components/common/Tooltip';
import 'i18n/config';

export interface TileChartProps extends Omit<PercentageCircleProps, 'data'> {
  /** Tooltip to display when hovering over the info icon. This info icon is only shown if this property is passed. */
  infoTooltip?: string | null;
  /** Data to display for the chart. */
  data?: PercentageCircleProps['data'] | null;
}

export function TileChart(props: TileChartProps) {
  const { title, infoTooltip = '', legend, total, data, ...others } = props;

  return (
    <Paper
      sx={(theme: Theme) => ({
        background: theme.palette.squareButton.background,
        padding: theme.spacing(2),
        height: '100%',
        maxWidth: '300px',
        margin: '0 auto',
      })}
    >
      <Box
        display="flex"
        sx={(theme) => ({
          [theme.breakpoints.down('sm')]: {
            flexWrap: 'wrap',
          },
        })}
      >
        <Box flexGrow={1} width="100%">
          <Box>
            <Typography
              sx={(theme: Theme) => ({
                fontSize: theme.typography.pxToRem(16),
                display: 'inline',
                fontWeight: 600,
              })}
              gutterBottom
            >
              {title || ''}
            </Typography>
            {infoTooltip && <TooltipIcon>{infoTooltip}</TooltipIcon>}
          </Box>
          <Typography
            sx={(theme: Theme) => ({
              fontSize: theme.typography.pxToRem(16),
              display: 'inline',
              fontWeight: 400,
            })}
            gutterBottom
          >
            {legend || ''}
          </Typography>
        </Box>
        <Box>{!!data && <PercentageCircle data={data} total={total} size={140} thickness={11} {...others} />}</Box>
      </Box>
    </Paper>
  );
}

export default TileChart;
