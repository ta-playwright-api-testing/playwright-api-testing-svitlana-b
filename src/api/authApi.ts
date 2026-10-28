import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type SuccessLogin, type UserLogin } from '../types/api';

export class AuthApi {
  constructor(private readonly request: APIRequestContext) {
    void this.request;
  }

  async signIn(_credentials: UserLogin): Promise<SuccessLogin> {
    const response = await this.signInRaw(_credentials);
    return await response.json();
  }

  async signInRaw(_credentials: UserLogin): Promise<APIResponse> {
    return await this.request.post('/api/signin', {
      data: _credentials,
    });
  }
}
