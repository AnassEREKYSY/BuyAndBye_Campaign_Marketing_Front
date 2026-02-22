export const env = {
  BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL as string,
  API_V1_BASE_URL: `${import.meta.env.VITE_BACKEND_BASE_URL as string}/api/v1`,
}