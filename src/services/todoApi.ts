import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
} from 'axios';
import { CreateTodoRequest, CreateTodoResponse } from '../models/dtos';

export default class TodoApi {
  private api: AxiosInstance;
  public constructor(baseUrl: string, config?: AxiosRequestConfig) {
    this.api = axios.create(config);
    this.api.interceptors.request.use(function (config) {
      config.baseURL = baseUrl;
      return config;
    });
  }

  public AppendHeader(key: string, value: string | string[]): void {
    this.api.interceptors.request.use(function (config) {
      config.headers[key] = value;
      return config;
    });
  }

  public static CreateCancelToken(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  public async CreateTodoAsync(
    request: CreateTodoRequest
  ): Promise<CreateTodoResponse | null> {
    try {
      let response = await this.api.post('todo', request);
      if (response.status !== 200) return null;
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
