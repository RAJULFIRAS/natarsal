// D:/natarsal/natarsal-frontend/src/config/api.ts

// ✅ Perbaiki base URL default ke port 3001
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";
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

export const getBaseUrl = (): string => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  return base.replace(/\/api$/, "");
};

// ✅ Helper untuk image URL
export const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return "/images/placeholder.png";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // ✅ Gunakan base URL dari environment
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:3001";

  if (imagePath.startsWith("/uploads/")) {
    return `${baseUrl}${imagePath}`;
  }

  if (imagePath.startsWith("/")) {
    return `${baseUrl}${imagePath}`;
  }

  return imagePath;
};

// ✅ Helper untuk fetch gambar dengan CORS
export const fetchImageWithCors = async (url: string): Promise<Blob> => {
  const response = await fetch(url, {
    mode: "cors",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  return response.blob();
};

async function fetchWithTimeout<T>(
  url: string,
  options: RequestInit = {},
  timeout: number = DEFAULT_TIMEOUT,
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // ✅ Cek apakah body adalah FormData
    const isFormData = options.body instanceof FormData;

    // ✅ Buat headers dengan tipe yang aman
    const headers: Record<string, string> = {
      ...((options.headers as Record<string, string>) || {}),
    };

    // ✅ Hanya set Content-Type jika BUKAN FormData
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // ✅ Jika FormData, hapus Content-Type (biar browser set sendiri)
    if (isFormData) {
      delete headers["Content-Type"];
    }

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers,
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
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // ✅ Auto-refresh token interceptor
  private async refreshTokenIfNeeded(): Promise<boolean> {
    // Jika sudah dalam proses refresh, tunggu hasilnya
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      console.log("No refresh token available");
      return false;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        console.log("🔄 Auto-refreshing token...");
        const response = await this.refreshToken(refreshToken);

        if (response.success && response.data?.token) {
          localStorage.setItem("token", response.data.token);
          console.log("✅ Token auto-refreshed successfully");
          return true;
        }

        console.log("❌ Auto-refresh failed:", response.error?.message);
        // Clear invalid tokens
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        return false;
      } catch (error) {
        console.error("❌ Auto-refresh error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        return false;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // ✅ Jika body adalah FormData, jangan set Content-Type
    const isFormData = options.body instanceof FormData;
    const headers: HeadersInit = {
      ...((options.headers as Record<string, string>) || {}),
    };

    // ✅ Hanya set Content-Type jika bukan FormData
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    // ✅ Jika body adalah FormData, hapus Content-Type biar browser set sendiri
    if (isFormData) {
      delete headers["Content-Type"];
    }

    try {
      return await fetchWithTimeout<T>(url, {
        ...options,
        headers,
      });
    } catch (error: any) {
      // ✅ Jika token expired (401) dan belum retry
      const isAuthError =
        error.message?.includes("Token expired") ||
        error.message?.includes("Unauthorized") ||
        error.message?.includes("Invalid token");

      if (
        isAuthError &&
        retryCount === 0 &&
        !endpoint.includes("/auth/login") &&
        !endpoint.includes("/auth/refresh") &&
        !endpoint.includes("/auth/register")
      ) {
        console.log("🔄 Token expired, attempting auto-refresh...");
        const refreshed = await this.refreshTokenIfNeeded();

        if (refreshed) {
          const newToken = localStorage.getItem("token");
          if (newToken) {
            const newOptions = {
              ...options,
              headers: {
                ...options.headers,
                Authorization: `Bearer ${newToken}`,
              },
            };
            console.log("🔄 Retrying request with new token...");
            return this.request(endpoint, newOptions, retryCount + 1);
          }
        }
      }
      throw error;
    }
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

  // ============================================================
  // TESTIMONIALS
  // ============================================================

  async getTestimonials(): Promise<ApiResponse<any[]>> {
    return this.request("/testimonials");
  }

  async createTestimonial(
    token: string,
    data: {
      name: string;
      role: string;
      content: string;
      image?: string;
      rating?: number;
      order?: number;
    },
  ): Promise<ApiResponse<any>> {
    return this.request("/testimonials", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(
    token: string,
    id: number,
    data: Partial<{
      name: string;
      role: string;
      content: string;
      image: string;
      rating: number;
      order: number;
      isActive: boolean;
    }>,
  ): Promise<ApiResponse<any>> {
    return this.request(`/testimonials/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(
    token: string,
    id: number,
  ): Promise<ApiResponse<any>> {
    return this.request(`/testimonials/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
export { API_BASE_URL };
