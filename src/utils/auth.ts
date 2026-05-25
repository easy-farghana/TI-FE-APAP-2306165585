import { toast } from 'vue-sonner';

/**
 * Sets a value in localStorage after serializing it to JSON.
 * @param key - The key under which the value will be stored.
 * @param value - The value to store, which will be serialized to JSON.
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Failed to set localStorage item "${key}":`, error);
  }
}


/**
 * Retrieves an item from localStorage after parsing it from JSON.
 * If the item is not found in localStorage, returns null.
 * If the item is not JSON (e.g. raw JWT), returns it as a string.
 * @template T - The type of the value to retrieve.
 * @param key - The key under which the value is stored.
 * @returns The retrieved value, or null if not found.
 */
export function getLocalStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  if (!item) return null;

  try {
    return JSON.parse(item);
  } catch {
    return item as unknown as T;
  }
}


/**
 * Removes an item from localStorage.
 * @param key - The key of the item to remove.
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove localStorage item "${key}":`, error);
  }
}

/**
 * Clears all items from localStorage.
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

/**
 * Retrieves the authentication token from localStorage.
 * @returns The auth token string or null if not found.
 */
export function getAuthToken(): string | null {
  return getLocalStorage<string>('token');
}

/**
 * Retrieves the current user from localStorage.
 * @returns The current user object or null if not found.
 */
export function getCurrentUserRole(): string | null {
  return getLocalStorage<string>('role');
}

/** * Handles authentication-related HTTP errors.
 * @param statusCode - The HTTP status code from the response.
 * @param router - The Vue Router instance for navigation.
 */
export async function handleAuthError(statusCode: number, router: any): Promise<void> {
  if (statusCode === 401) {
    clearLocalStorage();
    toast.error('Token expired, try logging in again');
    router.push('/login');
  } else if (statusCode === 403) {
    toast.error('Access forbidden');
    router.push('/');
  }
}