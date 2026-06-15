type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

type ApiResponse<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: string; status: number; details?: unknown };

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {};

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  clearDefaultHeaders() {
    this.defaultHeaders = {};
  }

  private isAbsoluteUrl(url: string) {
    return /^https?:\/\//i.test(url);
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    if (this.isAbsoluteUrl(this.baseUrl)) {
      const url = new URL(`${this.baseUrl}${path}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            url.searchParams.append(key, String(value));
          }
        });
      }
      return url.toString();
    }
    let url = `${this.baseUrl}${path}`;
    if (params) {
      const search = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          search.append(key, String(value));
        }
      });
      const qs = search.toString();
      if (qs) url += `${url.includes("?") ? "&" : "?"}${qs}`;
    }
    return url;
  }

  private async request<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        ...this.defaultHeaders,
        ...options.headers,
      };

      if (body && !(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(this.buildUrl(path, options.params), {
        method,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
        next: options.next,
        cache: options.cache,
      });

      if (response.status === 204) {
        return { ok: true, data: undefined as T, status: 204 };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          ok: false,
          error: data.message ?? "Erro desconhecido",
          status: response.status,
          details: data,
        };
      }

      return { ok: true, data: data as T, status: response.status };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "Erro de conexão",
        status: 0,
      };
    }
  }

  get<T>(path: string, options?: RequestOptions) {
    return this.request<T>("GET", path, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("POST", path, options, body);
  }

  patch<T>(path: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>("PATCH", path, options, body);
  }

  delete<T>(path: string, options?: RequestOptions) {
    return this.request<T>("DELETE", path, options);
  }
}

export const api = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? "https://cine-paca-api.onrender.com",
);

export const clientApi = new ApiClient("");

export type { ApiResponse };
