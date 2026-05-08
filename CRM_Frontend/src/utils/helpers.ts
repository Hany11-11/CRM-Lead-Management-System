import type { Lead } from "../types";

const LEADS_KEY = "crm_leads";

/**
 * Retrieves stored leads from localStorage
 * @returns Array of stored leads or empty array if not found or parse error
 */
export const getStoredLeads = (): Lead[] => {
  try {
    const stored = localStorage.getItem(LEADS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * Saves leads to localStorage
 * @param leads - Array of leads to store
 */
export const setStoredLeads = (leads: Lead[]): void => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

/**
 * Generates a unique ID using timestamp and random string
 * @returns Unique ID string
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Formats a number as Sri Lankan Rupee currency
 * @param value - Numeric value to format
 * @returns Formatted currency string (e.g., "Rs. 1,234")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formats a date string into readable date and time format
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "Jan 15, 2025, 2:30 PM")
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
};

/**
 * Formats a date as relative time (e.g., "Today", "2 days ago")
 * @param dateString - ISO date string to format
 * @returns Relative date string
 */
export const formatRelativeDate = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
};

/**
 * Formats a date as relative time with time component (e.g., "Today at 2:30 PM")
 * @param dateString - ISO date string to format
 * @returns Relative date string with time
 */
export const formatRelativeDateWithTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Yesterday at ${time}`;
  if (diffDays < 7) return `${diffDays} days ago at ${time}`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago at ${time}`;
  return formatDate(dateString);
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};
