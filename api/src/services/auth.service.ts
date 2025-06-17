import Container, { Service } from 'typedi';
import httpStatus from 'http-status';
import axios, { AxiosInstance } from 'axios';
import { HttpException } from '../utils/httpException';

@Service()
export class AuthService {
  private backendService: AxiosInstance;

  constructor() {
    this.backendService = axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async verifyApiKeys(apiKey: string, secretKey: string): Promise<any> {
    try {
      const response = await this.backendService.post('/verify-keys', {
        apiKey,
        secretKey,
      });

      if (response.status === httpStatus.OK) {
        return response.data;
      } else {
        throw new Error('Invalid API keys');
      }
    } catch (error) {
      console.error('Error verifying API keys:', error);
      throw new HttpException(error?.status, error?.message);
    }
  }
}
