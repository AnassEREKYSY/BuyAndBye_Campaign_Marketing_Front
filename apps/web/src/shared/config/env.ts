// Empty base URL = same origin. In production the front proxies /api/* to the backend (see vercel.json).
const backend = ((import.meta.env.VITE_BACKEND_BASE_URL as string | undefined) ?? '').replace(/\/$/, '')

export const env = {
  BACKEND_BASE_URL: backend,
  API_V1_BASE_URL: `${backend}/api/v1`,
}
