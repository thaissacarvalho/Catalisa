import { randomBytes } from 'node:crypto';

export function generateUserCode(): string {
  const randomCode = randomBytes(16).toString('hex');

  return `USER_${randomCode}`;
}
