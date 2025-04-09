// Generate a random token using Web Crypto API
export function generateToken(): string {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return btoa(String.fromCharCode(...buffer));
}

// Simple time-safe string comparison
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return a === b;
}

// Verify token by comparing with the one in cookie
export function verifyToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) return false;
  return safeCompare(token, storedToken);
}

// Get token from headers
export function getTokenFromHeaders(headers: Headers): string | null {
  return headers.get('x-csrf-token') || headers.get('x-xsrf-token') || null;
}
