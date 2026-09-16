import { env } from "@/config/env";
import type { JobListingFilters, NewsletterSubscriberInput } from "@/services/api-types";

const ACCESS_TOKEN_COOKIE = "gratissimo_access_token";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Options = RequestInit & { auth?: boolean };

const getAccessToken = () => {
  if (typeof document === "undefined") return "";
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${ACCESS_TOKEN_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=") ?? "";
};

export const isAuthenticated = () => Boolean(getAccessToken());

export const getApiAssetUrl = (assetPath: unknown) => {
  if (typeof assetPath !== "string" || !assetPath) return "";
  return new URL(assetPath, `${env.apiBaseUrl}/`).toString();
};

export const logout = async () => {
  if (typeof document !== "undefined") {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; Max-Age=0; Path=/`;
  }
};

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const { auth = false, ...requestOptions } = options;
  const headers = new Headers(requestOptions.headers);
  const token = getAccessToken();

  if (requestOptions.body && typeof requestOptions.body !== "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (auth && token) headers.set("Authorization", `Bearer ${decodeURIComponent(token)}`);

  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(error.error ?? "Noget gik galt", response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

const get = <T>(path: string) => apiFetch<T>(path);

export const getJobListings = (filters: JobListingFilters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const query = params.toString();
  return get<unknown[]>(`/api/job-listings${query ? `?${query}` : ""}`);
};

export const getJobCategories = () => get<unknown[]>("/api/job-categories");
export const getRegions = () => get<unknown[]>("/api/regions");
export const getWorkTypes = () => get<unknown[]>("/api/workTypes");
export const getArticles = () => get<unknown[]>("/api/articles");
export const getTestimonies = () => get<unknown[]>("/api/testimony");

export const login = (username: string, password: string) =>
  apiFetch<{ accessToken: string }>("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

export const saveFavorite = (jobListingId: number) =>
  apiFetch<unknown>("/api/favorites", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ jobListingId }),
  });

export const subscribeToNewsletter = (data: NewsletterSubscriberInput) =>
  apiFetch<unknown>("/api/newsletter", {
    method: "POST",
    body: JSON.stringify(data),
  });
