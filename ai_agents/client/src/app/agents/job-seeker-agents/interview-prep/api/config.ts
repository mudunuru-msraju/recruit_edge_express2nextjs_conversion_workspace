/**
 * API Configuration for Interview Prep
 * 
 * ⚠️ SECURITY WARNING - DEVELOPMENT ONLY ⚠️
 * 
 * getMockUserId() returns a hardcoded user ID which is INSECURE.
 * See server/routes/SECURITY_WARNING.md for complete details.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ⚠️ DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION ⚠️
export const getMockUserId = () => '1';
