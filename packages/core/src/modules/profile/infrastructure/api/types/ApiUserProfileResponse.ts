import { ApiUserProfilePayload } from "./ApiUserProfilePayload";

export type ApiUserProfileResponse =
  | { data: ApiUserProfilePayload }
  | ApiUserProfilePayload