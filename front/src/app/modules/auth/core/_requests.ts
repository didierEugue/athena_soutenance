import { login as apiLogin } from '../../../../services/api';
import { AuthModel } from './_models';

export const LOGIN_URL = '/login_check';

export function login(username: string, password: string): Promise<AuthModel> {
  return apiLogin(username, password);
}
