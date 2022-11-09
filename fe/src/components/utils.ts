export const enum ErrorType {
  NotFound,
  NoRecords,
  ServerError,
  AlreadyExists,
  ArgumentError,
  MultipleMatch,
  IdMismatch,
}

export interface BackendError extends Error {
  reason: string;
  name: string;
  type: ErrorType;
}

export interface Team {
  id: number;
  name: string;
}

export interface TeamResponse {
  data: Team | undefined;
  error: BackendError | undefined;
}

export interface TeamArrayResponse {
  data: Team[] | undefined;
  error: BackendError | undefined;
}

export const getTeams = async (): Promise<TeamArrayResponse> => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "GET",
    credentials: "include",
  });
  const ret: TeamArrayResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Team[];
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const getTeam = async (key: string): Promise<TeamArrayResponse> => {
  if (key === "") {
    return getTeams();
  }

  const ret: TeamArrayResponse = { data: undefined, error: undefined };

  if (!isNaN(+key)) {
    const response = await fetch(`http://localhost:4000/api/team/${+key}`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      ret.data = [await response.json()] as Team[];
    } else {
      ret.error = (await response.json()) as BackendError;
    }
  } else {
    const response = await fetch(`http://localhost:4000/api/team?name=${key}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      ret.data = (await response.json()) as Team[];
    } else {
      ret.error = (await response.json()) as BackendError;
    }
  }
  return ret;
};

export const deleteTeam = async (id: number): Promise<TeamResponse> => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const ret: TeamResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Team;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const updateTeam = async (
  id: number,
  name: string
): Promise<TeamResponse> => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: name,
    }),
  });
  const ret: TeamResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Team;
  } else {
    ret.error = (await response.json()) as BackendError;
  }

  return ret;
};

export const createTeam = async (teamName: string): Promise<TeamResponse> => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: teamName }),
  });
  const ret: TeamResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Team;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export interface Pilot {
  id: number;
  name: string;
  team?: {
    id: number;
    name: string;
  };
}

export interface PilotResponse {
  data: Pilot | undefined;
  error: BackendError | undefined;
}

export interface PilotArrayResponse {
  data: Pilot[] | undefined;
  error: BackendError | undefined;
}

export const getPilots = async (): Promise<PilotArrayResponse> => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "GET",
    credentials: "include",
  });
  const ret: PilotArrayResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot[];
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const getPilot = async (key: string): Promise<PilotArrayResponse> => {
  if (key === "") {
    return getPilots();
  }

  const ret: PilotArrayResponse = { data: undefined, error: undefined };

  if (!isNaN(+key)) {
    const response = await fetch(`http://localhost:4000/api/pilot/${+key}`, {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      ret.data = [await response.json()] as Pilot[];
    } else {
      ret.error = (await response.json()) as BackendError;
    }
  } else {
    const response = await fetch(
      `http://localhost:4000/api/pilot?name=${key}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      ret.data = (await response.json()) as Pilot[];
    } else {
      ret.error = (await response.json()) as BackendError;
    }
  }
  return ret;
};

export const deletePilot = async (id: number): Promise<PilotResponse> => {
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const ret: PilotResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const updatePilot = async (
  pilotBody: string
): Promise<PilotResponse> => {
  const id = +(JSON.parse(pilotBody) as Pilot).id;
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  const ret: PilotResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const createPilot = async (
  pilotBody: string
): Promise<PilotResponse> => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  const ret: PilotResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export interface User {
  name: string;
  password: string;
  id: number;
}

export interface UserResponse {
  data: User | undefined;
  error: BackendError | undefined;
}

export const register = async (userBody: string): Promise<UserResponse> => {
  const response = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: userBody,
  });
  const ret: UserResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as User;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const login = async (userBody: string): Promise<UserResponse> => {
  const response = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: userBody,
  });
  const ret: UserResponse = { data: undefined, error: undefined };
  if (response.ok) {
    ret.data = (await response.json()) as User;
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const logout = async (): Promise<object | BackendError> => {
  const response = await fetch("http://localhost:4000/api/auth/logout", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let ret: object | BackendError;
  if (response.ok) {
    ret = (await response.json()) as object;
  } else {
    ret = (await response.json()) as BackendError;
  }
  return ret;
};
