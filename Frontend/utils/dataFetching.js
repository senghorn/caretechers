
export const fetcher = (url, token) => fetch(url, token).then((res) => res.json());