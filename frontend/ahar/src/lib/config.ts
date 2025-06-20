/**
 * Environment variables configuration
 * Access environment variables in a type-safe way
 */

export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
  },
  auth: {
    tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token',
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'refresh_token',
  },
} as const;

// Type-safe environment variables validation
function validateConfig() {
  const requiredEnvVars = [
    'VITE_API_BASE_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !import.meta.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}

// Validate environment variables when importing this file
validateConfig();

export default config;
