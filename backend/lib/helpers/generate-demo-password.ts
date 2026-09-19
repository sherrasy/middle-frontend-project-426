import bcrypt from 'bcrypt';
import { DEMO_USER } from '../../lib/consts.js';
const SALT_ROUNDS = 10;

export async function generatePasswordHash() {
  return await bcrypt.hash(DEMO_USER.password, SALT_ROUNDS);
}
