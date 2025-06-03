export const PLUGIN_NAME = 'prometheus';

/**
 * getPrometheusInterval returns the default timespan for the Prometheus metrics.
 * @param {string} cluster - The name of the cluster.
 * @returns {string} The default timespan for the Prometheus metrics.
 */
export function getPrometheusInterval(): string {
  return '24h';
}

export const ChartEnabledKinds = [
  'Pod',
  'Deployment',
  'StatefulSet',
  'DaemonSet',
  'ReplicaSet',
  'Job',
  'CronJob',
  'PersistentVolumeClaim',
];

/**
 * Creates a formatter function that formats timestamps based on the given interval.
 * The formatter maintains state to avoid rendering duplicate timestamps.
 *
 * @param {string} interval - The time interval to format for (e.g. '10m', '1h', '24h', 'week')
 * @returns {function(number): string} A formatter function that takes a timestamp and returns a formatted string
 *
 * @example
 * const formatter = createTickTimestampFormatter('24h');
 * formatter(1698321684); // Returns "10:30"
 * formatter(1698321744); // Returns "" (if same formatted time as previous)
 *
 * Formats:
 * - For intervals <= 48h: "HH:MM" (e.g. "14:30")
 * - For today/yesterday: "HH:00" (e.g. "14:00")
 * - For week/lastweek/7d/14d: "M/D" (e.g. "10/26")
 */
export function createTickTimestampFormatter(interval: string) {
  let prevRenderedTimestamp: string | null = null;

  return function (timestamp: number) {
    const date = new Date(timestamp * 1000);
    let format: string;

    // Determine format based on interval
    switch (interval) {
      case '10m':
      case '30m':
      case '1h':
      case '3h':
      case '6h':
      case '12h':
      case '24h':
      case '48h':
        format = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
        break;
      case 'today':
      case 'yesterday':
        format = `${date.getHours()}:00`;
        break;
      case 'week':
      case 'lastweek':
      case '7d':
      case '14d':
        format = `${date.getMonth() + 1}/${date.getDate()}`;
        break;
      default:
        format = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    // Check if the current timestamp is different from the previously rendered one
    const shouldRenderDate = format !== prevRenderedTimestamp;

    // Update the previous timestamp
    prevRenderedTimestamp = format;

    return shouldRenderDate ? format : '';
  };
}

/**
 * Processes raw Prometheus response data into a format suitable for charting.
 * @param {any} response - The raw response from Prometheus API containing time series data
 * @returns {Array<{timestamp: number, y: number}>} An array of data points with timestamps and values
 */
export function dataProcessor(response: any): { timestamp: number; y: number }[] {
  const data: { timestamp: number; y: number }[] = [];
  // convert the response to a JSON object
  response?.data?.result?.[0]?.values.forEach((element: any) => {
    // convert value to a number
    data.push({ timestamp: element[0], y: Number(element[1]) });
  });
  return data;
}

/**
 * Formats a number of bytes into a human-readable string with appropriate units.
 * @param {number} bytes - The number of bytes to format
 * @returns {string} A formatted string with the bytes value and appropriate unit (B, KB, MB, GB, or TB)
 * @example
 * formatBytes(1024) // Returns "1.00KB"
 * formatBytes(1234567) // Returns "1.18MB"
 */
export function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + units[i];
}

/**
 * Calculates the time range based on the given interval.
 * @param {string} interval - The time interval (e.g., '10m', '1h', '24h', 'week').
 * @returns {Object} An object containing the 'from' timestamp, 'to' timestamp, and 'step' in seconds.
 */
export function getTimeRange(interval: string): { from: number; to: number; step: number } {
  const now = Math.floor(Date.now() / 1000);
  const day = 86400; // seconds in a day

  switch (interval) {
    case '10m':
      return { from: now - 600, to: now, step: 15 }; // 15 seconds step
    case '30m':
      return { from: now - 1800, to: now, step: 30 }; // 30 seconds step
    case '1h':
      return { from: now - 3600, to: now, step: 60 }; // 1 minute step
    case '3h':
      return { from: now - 10800, to: now, step: 180 }; // 3 minutes step
    case '6h':
      return { from: now - 21600, to: now, step: 360 }; // 6 minutes step
    case '12h':
      return { from: now - 43200, to: now, step: 720 }; // 12 minutes step
    case '24h':
      return { from: now - day, to: now, step: 300 }; // 5 minutes step
    case '48h':
      return { from: now - 2 * day, to: now, step: 600 }; // 10 minutes step
    case 'today':
      return { from: now - (now % day), to: now, step: 300 }; // 5 minutes step
    case 'yesterday':
      return { from: now - (now % day) - day, to: now - (now % day), step: 300 }; // 5 minutes step
    case 'week':
      return { from: now - 7 * day, to: now, step: 3600 }; // 1 hour step
    case 'lastweek':
      return { from: now - 14 * day, to: now - 7 * day, step: 3600 }; // 1 hour step
    case '7d':
      return { from: now - 7 * day, to: now, step: 3600 }; // 1 hour step
    case '14d':
      return { from: now - 14 * day, to: now, step: 7200 }; // 2 hours step
    default:
      return { from: now - 600, to: now, step: 15 }; // Default to 10 minutes with 15 seconds step
  }
}
