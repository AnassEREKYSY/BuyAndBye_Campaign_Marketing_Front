export type ApiAuthResponse =
  | { data: { token: string; expires_in?: number | null; user?: unknown } }
  | { token: string; expires_in?: number | null; user?: unknown }