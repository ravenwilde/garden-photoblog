import { generateToken, verifyToken, getTokenFromHeaders } from '@/lib/csrf';

describe('CSRF Utilities', () => {
  describe('generateToken', () => {
    it('should generate a non-empty string token', () => {
      const token = generateToken();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens on each call', () => {
      const token1 = generateToken();
      const token2 = generateToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should return true when tokens match', () => {
      const token = 'test-token';
      const result = verifyToken(token, token);
      expect(result).toBe(true);
    });

    it('should return false when tokens do not match', () => {
      const token1 = 'test-token-1';
      const token2 = 'test-token-2';
      const result = verifyToken(token1, token2);
      expect(result).toBe(false);
    });

    it('should return false when either token is empty', () => {
      expect(verifyToken('', 'test-token')).toBe(false);
      expect(verifyToken('test-token', '')).toBe(false);
      expect(verifyToken('', '')).toBe(false);
    });
  });

  describe('getTokenFromHeaders', () => {
    it('should get token from x-csrf-token header', () => {
      const headers = new Headers();
      headers.set('x-csrf-token', 'test-token');
      const token = getTokenFromHeaders(headers);
      expect(token).toBe('test-token');
    });

    it('should get token from x-xsrf-token header if x-csrf-token is not present', () => {
      const headers = new Headers();
      headers.set('x-xsrf-token', 'test-token');
      const token = getTokenFromHeaders(headers);
      expect(token).toBe('test-token');
    });

    it('should return null if no CSRF token headers are present', () => {
      const headers = new Headers();
      const token = getTokenFromHeaders(headers);
      expect(token).toBe(null);
    });
  });
});
