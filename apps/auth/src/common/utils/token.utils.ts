import { randomInt } from 'crypto';

/**
 * Generate secure 6-digit code (100000 – 999999)
 */
export const generateSecureCode = (): number => {
  return randomInt(100_000, 999_999); // 6-digit
};

/**
 * 15 minutes from now
 */
export const getExpiresAt = (): Date => {
  return new Date(Date.now() + 15 * 60 * 1000);
};
