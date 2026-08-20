// D:/natarsal/natarsal-frontend/src/config/api.ts

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const DEFAULT_TIMEOUT = import.meta.env.PROD ? 10000 : 30000;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: { id: number; name: string; slug: string };
  image?: string;
  isAvailable: boolean;
  isRecommended?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ReservationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  guests: number;
  notes?: string;
}

export interface AuthData {
  name?: string;
  email: string;
  password: string;
}

async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: { message: "Request failed" },
      }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    return fetchWithTimeout<T>(url, options);
  }

  async health(): Promise<
    ApiResponse<{ status: string; environment: string }>
  > {
    return this.request("/health");
  }

  async getMenus(): Promise<ApiResponse<MenuItem[]>> {
    return this.request("/menu");
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request("/menu/categories");
  }

  async createReservation(data: ReservationData): Promise<
    ApiResponse<{
      id: number;
      reservationNumber: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      date: string;
      guests: number;
      status: string;
    }>
  > {
    return this.request("/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: AuthData): Promise<
    ApiResponse<{
      user: { id: number; name: string; email: string; role: string };
      token: string;
      refreshToken: string;
    }>
  > {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }): Promise<
    ApiResponse<{
      user: { id: number; name: string; email: string; role: string };
      token: string;
      refreshToken: string;
    }>
  > {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<ApiResponse<{ token: string }>> {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getMe(token: string): Promise<
    ApiResponse<{
      id: number;
      name: string;
      email: string;
      role: string;
    }>
  > {
    return this.request("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getReservations(
    token: string,
    page: number = 1,
    limit: number = 20,
    date?: string,
    status?: string,
    search?: string,
  ): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (date) params.append("date", date);
    if (status) params.append("status", status);
    if (search) params.append("search", search);

    return this.request(`/reservations?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getReservationById(
    token: string,
    id: number,
  ): Promise<ApiResponse<any>> {
    return this.request(`/reservations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateReservationStatus(
    token: string,
    id: number,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.request(`/reservations/${id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
  }

  async createMenu(
    token: string,
    data: FormData,
  ): Promise<ApiResponse<MenuItem>> {
    return this.request("/admin/menu", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
  }

  async updateMenu(
    token: string,
    id: number,
    data: FormData,
  ): Promise<ApiResponse<MenuItem>> {
    return this.request(`/admin/menu/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
  }

  async deleteMenu(
    token: string,
    id: number,
  ): Promise<ApiResponse<{ id: number }>> {
    return this.request(`/admin/menu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async exportReservations(
    token: string,
    params?: { from?: string; to?: string; status?: string },
  ): Promise<Blob> {
    const url = new URL(`${this.baseUrl}/export/reservations/export`);
    if (params?.from) url.searchParams.append("from", params.from);
    if (params?.to) url.searchParams.append("to", params.to);
    if (params?.status && params.status !== "all")
      url.searchParams.append("status", params.status);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Export failed");
    }

    return response.blob();
  }

  async checkReservationStatus(
    reservationNumber: string,
    email: string,
  ): Promise<
    ApiResponse<{
      reservationNumber: string;
      customerName: string;
      date: string;
      guests: number;
      status: string;
      notes: string | null;
    }>
  > {
    const params = new URLSearchParams({
      reservationNumber,
      email,
    });
    return this.request(`/public/reservations/check?${params.toString()}`);
  }

  async cancelReservation(
    token: string,
    id: number,
  ): Promise<ApiResponse<any>> {
    return this.request(`/reservations/${id}/cancel`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
export { API_BASE_URL };
