export type WorkHome = "Hjemmearbejde" | "On-site" | "Delvist";

export interface ApiUser {
  id: number;
  firstname: string;
  lastname: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
}

export interface UserInput {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  phone?: string | number;
  address?: string;
  city?: string;
  zipcode?: string | number;
}

export interface OrganisationInput {
  title: string;
  description?: string;
  address?: string;
  zipcode?: string | number;
  city?: string;
  phone?: string | number;
  userId: number;
}

export interface JobListingInput {
  title: string;
  description: string;
  address: string;
  zipcode: string | number;
  city: string;
  workHome: WorkHome;
  regionId: number;
  userId: number;
  jobCategoryId: number;
  organisationId: number;
  workTypeId: number;
}

export interface JobListingFilters {
  search?: string;
  regionId?: number;
  jobCategoryId?: number;
  workTypeId?: number;
  workHome?: WorkHome;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

export interface ArticleInput {
  title: string;
  content: string;
}

export interface FavoriteInput {
  jobListingId: number;
}

export interface NewsletterSubscriberInput {
  email: string;
}

export interface NamedInput {
  name: string;
}

export interface WorkTypeInput {
  type: string;
}

export interface ApiErrorDetails {
  message: string;
  status: number;
  fieldErrors?: Record<string, string>;
  data?: unknown;
}
