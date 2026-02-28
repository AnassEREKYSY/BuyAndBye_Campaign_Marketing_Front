import type { ApiUserProfilePayload } from './ApiUserProfilePayload'

export type ApiUserProfileResponse =
  | { data: ApiUserProfilePayload }
  | ApiUserProfilePayload

export function unwrapUserProfile(res: ApiUserProfileResponse): ApiUserProfilePayload {
  return (res as any)?.data?.id ? ((res as any).data as ApiUserProfilePayload) : (res as any as ApiUserProfilePayload)
}