import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
  CancelToken,
} from 'axios';
import {
  CreateTodoRequest,
  CreateTodoResponse,
  GeneralCUDResponse,
  GetTodoResponse,
  GetTodosResponse,
} from '../models/dtos';

export default class TodoApi {
  private api: AxiosInstance;
  public constructor(config?: AxiosRequestConfig) {
    this.api = axios.create(config);
    this.api.interceptors.request.use(function (config) {
      config.baseURL = process.env.REACT_APP_API_ROOT_URL as string;
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
      let response = await this.api.post('todos', request);
      if (response.status !== 200) return null;
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async DeleteTodoAsync(id: string): Promise<GeneralCUDResponse | null> {
    try {
      let response = await this.api.delete(`todos/${id}`);
      if (response.status !== 200) return null;
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async ToggleDoneAsync(id: string): Promise<GeneralCUDResponse | null> {
    try {
      let response = await this.api.patch(`todos/${id}/done`);
      if (response.status !== 200) return null;
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async GetTodoAsync(id: string): Promise<GetTodoResponse | null> {
    try {
      let response = await this.api.get(`todos/${id}`);
      if (response.status !== 200) return null;
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async GetTodosAsync(done?: boolean): Promise<GetTodosResponse | null> {
    try {
      let resource = 'todos';
      if (done !== undefined && done !== null)
        resource = resource.concat(`?done=${done}`);
      let response = await this.api.get(resource);
      if (response.status !== 200) return null;
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public UseToken(token: CancelToken): void {
    this.api.interceptors.request.use(function (config) {
      config.cancelToken = token;
      return config;
    });
  }

  public Cancel(cancelTokenSource: CancelTokenSource): void {
    cancelTokenSource.cancel();
  }
}
