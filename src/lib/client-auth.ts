export function authedFetch(url: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    credentials: 'include',
  })
}
