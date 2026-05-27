export function getMemberToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)member-token=([^;]*)/)
  return match ? match[1] : null
}

export function authedFetch(url: string, init?: RequestInit) {
  const token = getMemberToken()
  return fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      ...init?.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}
