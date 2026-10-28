import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type City } from '../types/api';

export class CitiesApi {
  constructor(private readonly request: APIRequestContext) {
    void this.request;
  }

  async getAll(): Promise<City[]> {
    const response = await this.getAllRaw();
    return await response.json();
  }

  async getById(_id: number): Promise<City> {
    const response = await this.request.get(`/api/city/${_id}`);
    return await response.json();
  }

  async getAllRaw(): Promise<APIResponse> {
    return await this.request.get('/api/cities');
  }
}
