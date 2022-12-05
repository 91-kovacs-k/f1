import {
  BackendError,
  BackendResponse,
  Pilot,
  PilotArrayResponse,
  PilotResponse,
  Team,
  TeamArrayResponse,
  TeamResponse,
} from "./types";

export const getTeams = async (): Promise<TeamArrayResponse> => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "GET",
    credentials: "include",
  });
  const ret: TeamArrayResponse = {
    ok: response.ok,
    data: undefined,
    error: { statusCode: 0, message: "", error: "" },
  };
  if (response.ok) {
    ret.data = (await response.json()) as Team[];
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const getTeamById = async (key: string): Promise<TeamResponse> => {
  const response = await fetch(`http://localhost:4000/api/team/${key}`, {
    method: "GET",
    credentials: "include",
  });
  const ret: TeamResponse = {
    ok: response.ok,
    data: undefined,
    error: { statusCode: 0, message: "", error: "" },
  };
  if (response.ok) {
    ret.data = (await response.json()) as Team;
  } else {
    ret.error = (await response.json()) as BackendError;
  }

  return ret;
};

export const getTeamBySearchParam = async (
  key: string
): Promise<TeamArrayResponse> => {
  if (key === "") {
    return getTeams();
  }

  const response = await fetch(`http://localhost:4000/api/team?name=${key}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const ret: TeamArrayResponse = {
    ok: response.ok,
    data: undefined,
    error: { statusCode: 0, message: "", error: "" },
  };
  if (response.ok) {
    ret.data = (await response.json()) as Team[];
  } else {
    ret.error = (await response.json()) as BackendError;
  }

  return ret;
};

export const deleteTeam = async (id: number): Promise<BackendResponse> => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return { ok: response.ok } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const updateTeam = async (
  id: string,
  name: string
): Promise<BackendResponse> => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: name,
    }),
  });
  if (response.ok) {
    return { ok: response.ok } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const createTeam = async (
  teamName: string
): Promise<BackendResponse> => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: teamName }),
  });

  if (response.ok) {
    return {
      ok: response.ok,
    } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const getPilots = async (): Promise<PilotArrayResponse> => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "GET",
    credentials: "include",
  });
  const ret: PilotArrayResponse = {
    ok: response.ok,
    data: undefined,
    error: { statusCode: 0, message: "", error: "" },
  };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot[];
  } else {
    ret.error = (await response.json()) as BackendError;
  }
  return ret;
};

export const getPilotById = async (key: string): Promise<PilotResponse> => {
  const response = await fetch(`http://localhost:4000/api/pilot/${key}`, {
    method: "GET",
    credentials: "include",
  });
  const ret: PilotResponse = {
    ok: response.ok,
    data: undefined,
    error: { statusCode: 0, message: "", error: "" },
  };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot;
  } else {
    ret.error = (await response.json()) as BackendError;
  }

  return ret;
};

export const getPilotBySearchParam = async (
  key: string
): Promise<PilotArrayResponse> => {
  if (key === "") {
    return getPilots();
  }

  const response = await fetch(`http://localhost:4000/api/pilot?name=${key}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const ret: PilotArrayResponse = {
    ok: response.ok,
    data: undefined,
    error: { statusCode: 0, message: "", error: "" },
  };
  if (response.ok) {
    ret.data = (await response.json()) as Pilot[];
  } else {
    ret.error = (await response.json()) as BackendError;
  }

  return ret;
};

export const deletePilot = async (id: number): Promise<BackendResponse> => {
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return { ok: response.ok } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const updatePilot = async (
  id: string,
  pilotBody: string
): Promise<BackendResponse> => {
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  if (response.ok) {
    return { ok: response.ok } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const createPilot = async (
  pilotBody: string
): Promise<BackendResponse> => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  if (response.ok) {
    return { ok: response.ok } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const register = async (userBody: string): Promise<BackendResponse> => {
  const response = await fetch("http://localhost:4000/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: userBody,
  });
  if (response.ok) {
    return { ok: response.ok } as BackendResponse;
  } else {
    return { ok: response.ok, error: (await response.json()) as BackendError };
  }
};

export const login = async (userBody: string): Promise<boolean> => {
  const response: Response = await fetch(
    "http://localhost:4000/api/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: userBody,
    }
  );
  return response.ok;
};

export const logout = async (): Promise<boolean> => {
  const response = await fetch("http://localhost:4000/api/auth/logout", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.ok;
};
