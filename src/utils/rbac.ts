import { getLocalStorage, getAuthToken, getCurrentUserRole } from './auth';

export enum UserRole {
  ADMIN = 'SUPERADMIN',
  ACCOMMODATION_OWNER = 'ACCOMMODATION_OWNER',
  CUSTOMER = 'CUSTOMER',
  FLIGHT_AIRLINE = 'FLIGHT_AIRLINE',
  TOUR_PACKAGE = 'TOUR_PACKAGE_VENDOR',
  RENTAL_VENDOR = 'RENTAL_VENDOR',
  INSURANCE_PROVIDER = 'INSURANCE_PROVIDER'
}

/**
 * Checks if the user is authenticated.
 * @returns True if authenticated, false otherwise.
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return !!(token);
}

/**
 * Checks if the current user has admin role.
 * @returns True if the user is an admin, false otherwise.
 */
export function isAdmin(): boolean {
  const role = getCurrentUserRole();
  if (!role || typeof role !== 'string') return false;
  return String(role).toUpperCase() === UserRole.ADMIN;
}

/**
 * Checks if the current user has accommodation owner role.
 * @returns True if the user is an accommodation owner, false otherwise.
 */
export function isAccommodationOwner(): boolean {
  const role = getCurrentUserRole();
  if (!role || typeof role !== 'string') return false;
  return String(role).toUpperCase() === UserRole.ACCOMMODATION_OWNER;
}

/**
 * Checks if the current user has customer role.
 * @returns True if the user is a customer, false otherwise.
 */
export function isCustomer(): boolean {
  const role = getCurrentUserRole();
  console.log(role);
  if (!role || typeof role !== 'string') return false;
  console.log(String(role).toUpperCase() === UserRole.CUSTOMER);
  return String(role).toUpperCase() === UserRole.CUSTOMER;
}

/**
 * Checks if the current user is a part of any service provider (e.g. Flight Airline, Tour Package, Rental Vendor, Insurance Provider).
 * @returns True if the user is a part of any service provider, false otherwise.
 */
export function isPartOfService(): boolean {
  const role = getCurrentUserRole();
  if (!role || typeof role !== 'string') return false;
  return String(role).toUpperCase() === UserRole.FLIGHT_AIRLINE ||
    String(role).toUpperCase() === UserRole.TOUR_PACKAGE ||
    String(role).toUpperCase() === UserRole.RENTAL_VENDOR ||
    String(role).toUpperCase() === UserRole.INSURANCE_PROVIDER
}

