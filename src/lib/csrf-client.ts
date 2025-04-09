let csrfToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;

  const response = await fetch('/api/csrf-token');
  if (!response.ok) {
    throw new Error('Failed to get CSRF token');
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error('No token returned from server');
  }
  csrfToken = data.token;
  return data.token;
}
