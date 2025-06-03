/**
 * Fetches metrics data from Prometheus using the provided parameters.
 * @param {object} data - The parameters for fetching metrics.
 * @param {string} data.prefix - The namespace prefix.
 * @param {string} data.query - The Prometheus query string.
 * @param {number} data.from - The start time for the query (Unix timestamp).
 * @param {number} data.to - The end time for the query (Unix timestamp).
 * @param {number} data.step - The step size for the query (in seconds).
 * @returns {Promise<object>} - A promise that resolves to the fetched metrics data.
 * @throws {Error} - Throws an error if the request fails.
 */
export async function fetchMetrics(data: { query: string; from: number; to: number; step: number }): Promise<object> {
  const params = new URLSearchParams();
  if (data.from) {
    params.append('start', data.from.toString());
  }
  if (data.to) {
    params.append('end', data.to.toString());
  }
  if (data.step) {
    params.append('step', data.step.toString());
  }
  if (data.query) {
    params.append('query', data.query);
  }

  const url = `/select/0/prometheus/api/v1/query_range?${params.toString()}`;
  const response = await fetch(url);
  if (response.status === 200) {
    return response.json();
  } else {
    const error = new FetchMetricsError(response);
    return Promise.reject(error);
  }
}

export class FetchMetricsError extends Error {
  statusCode: number;
  message: string;

  constructor(response: { status: number; statusText: string }) {
    super();
    this.statusCode = response.status;
    this.message = response.statusText;
  }
}
