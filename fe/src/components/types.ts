export interface Team {
  id: number;
  name: string;
}

export interface Pilot {
  id: number;
  name: string;
  team?: {
    id: number;
    name: string;
  };
}

export interface User {
  name: string;
}

export interface BackendError {
  statusCode: number;
  message: string;
  error: string;
}

export interface BackendResponse {
  ok: boolean;
  error: BackendError;
}

export interface TeamResponse extends BackendResponse {
  data: Team | undefined;
}

export interface TeamArrayResponse extends BackendResponse {
  data: Team[] | undefined;
}

export interface PilotResponse extends BackendResponse {
  data: Pilot | undefined;
}

export interface PilotArrayResponse extends BackendResponse {
  data: Pilot[] | undefined;
}

export interface UserResponse extends BackendResponse {
  data: User | undefined;
}
