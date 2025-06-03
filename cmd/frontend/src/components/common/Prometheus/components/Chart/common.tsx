import { Paper } from '@mui/material';

import { formatBytes } from '../../util';

export type TooltipPropp = {
  active: boolean;
  payload: { name: any; value: any }[];
  label: number;
};

export function CustomTooltip({ active, payload, label }: TooltipPropp) {
  if (active && payload && payload.length) {
    const timestamp = new Date(label * 1000); // Convert epoch to milliseconds

    return (
      <Paper variant="outlined" sx={{ p: 0.5, opacity: 0.8 }}>
        <b>{`Date: ${timestamp.toLocaleString()}`}</b>
        {payload.map((data) => (
          <div>{`${data.name}: ${data.value}`}</div>
        ))}
      </Paper>
    );
  }

  return null;
}

export function CustomTooltipFormatBytes({ active, payload, label }: TooltipPropp) {
  if (active && payload && payload.length) {
    const timestamp = new Date(label * 1000); // Convert epoch to milliseconds

    return (
      <Paper variant="outlined" sx={{ p: 0.5, opacity: 0.8 }}>
        <b>{`Date: ${timestamp.toLocaleString()}`}</b>
        {payload.map((data) => (
          <div>{`${data.name}: ${formatBytes(data.value)}`}</div>
        ))}
      </Paper>
    );
  }

  return null;
}
