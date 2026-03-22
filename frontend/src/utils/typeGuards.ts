export interface ApiUser {
  id: number | string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  organization_id?: string;
  organization_name?: string;
  modules?: string[];
  is_active?: boolean;
  date_joined?: string;
}

export interface ApiResponse<T> {
  data?: T;
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
}

export function isValidUser(data: unknown): data is ApiUser {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'email' in data
  );
}

export function isValidUserArray(data: unknown): data is ApiUser[] {
  return Array.isArray(data) && data.every(isValidUser);
}

export function isValidApiResponse<T>(data: unknown, validator: (item: unknown) => item is T): data is ApiResponse<T> {
  if (typeof data !== 'object' || data === null) return false;
  const response = data as Record<string, unknown>;
  return (
    Array.isArray(response.results) ||
    'data' in response ||
    'count' in response
  );
}

export function safeParseJSON<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && value > 0;
}
