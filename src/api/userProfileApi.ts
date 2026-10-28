import { type APIRequestContext } from '@playwright/test';
import { type UserResponse, type UserUpdateProfile } from '../types/api';

export class UserProfileApi {
  constructor(private readonly request: APIRequestContext) {
    void this.request;
  }

  async getById(_accessToken: string, _userId: number): Promise<UserResponse> {
    const response = await this.request.get(`/api/user/${_userId}`, {
      headers: {
        Authorization: `Bearer ${_accessToken}`,
      },
    });
    return await response.json();
  }

  async updateUserProfile(
    _accessToken: string,
    _userId: number,
    _profile: UserUpdateProfile,
  ): Promise<string> {
    await this.request.put(`/api/user/${_userId}`, {
      headers: {
        Authorization: `Bearer ${_accessToken}`,
      },
      data: _profile,
    });
    return _profile.phone;
  }
}
