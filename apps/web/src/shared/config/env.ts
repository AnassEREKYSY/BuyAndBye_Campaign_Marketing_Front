interface EnvConfig {
  API_BASE_URL: string
  BACKEND_BASE_URL: string
  APP_NAME: string
  APP_ENV: string
}

const getEnvVar = (key: string): string => {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env: EnvConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
  BACKEND_BASE_URL: getEnvVar('VITE_BACKEND_BASE_URL'),
  APP_NAME: getEnvVar('VITE_APP_NAME'),
  APP_ENV: getEnvVar('VITE_APP_ENV'),
}
