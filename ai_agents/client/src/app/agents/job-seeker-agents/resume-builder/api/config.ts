/**
 * API Configuration
 * Base URL and environment settings
 * 
 * ⚠️ SECURITY WARNING - DEVELOPMENT ONLY ⚠️
 * 
 * getMockUserId() returns a hardcoded user ID which is INSECURE.
 * This allows any user to impersonate another user by changing the ID.
 * 
 * REQUIRED BEFORE PRODUCTION:
 * 1. Remove getMockUserId() entirely
 * 2. Get user ID from authenticated session context
 * 3. Never accept userId from client - always from server session
 * 
 * See server/routes/SECURITY_WARNING.md for complete details.
 */

// Get the API base URL from environment or use default
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ⚠️ DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION ⚠️
// In production, userId comes from authenticated session (Auth.js)
export const getMockUserId = () => '1';
