import axios from 'axios';
import { TodoItem } from 'domains/todo';

export interface ApiResponse {
  code: string;
  result?: any;
  status: string;
  message?: string;
}

export interface ApiReq {
  host: string;
  path: string;
  method: string;
  params?: object;
  headers?: object;
  body?: string;
}

export async function apiRequest(req: ApiReq): Promise<any> {
  let queryString;
  if (req.params) {
    queryString = new URLSearchParams({ ...req.params }).toString();
  }
  const url = queryString ? `${req.path}?${queryString}` : req.path;
  const abortController = new AbortController();
  const signal = abortController.signal;
  setTimeout(() => {
    abortController.abort();
  }, 3000);
  const response = await fetch(url, {
    method: req.method,
    headers: { 'Content-Type': 'application/json', ...req.headers },
    body: req.body,
    signal,
  });

  // axiosReq();
  if (response.status === 200) {
    const res: ApiResponse = await response.json();
    if (res.status === 'ok') {
      return Promise.resolve(res.result);
    }
    return Promise.reject(res.message);
  }
  return Promise.reject(response);
}

export function axiosReq() {
  axios.get('/user?ID=12345')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}
