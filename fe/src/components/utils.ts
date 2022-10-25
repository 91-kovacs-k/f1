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

export const getTeams = async (): Promise<Team[] | BackendError> => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "GET",
  });
  const data = (await response.json()) as Team[] | BackendError;
  return data;
};

export const getTeam = async (key: string): Promise<Team[] | BackendError> => {
  if (key === "") {
    return getTeams();
  }

  let data: Team[] | BackendError;

  if (!isNaN(+key)) {
    const response = await fetch(`http://localhost:4000/api/team/${+key}`, {
      method: "GET",
    });

    data = (await response.json()) as Team[] | BackendError;
  } else {
    const response = await fetch(`http://localhost:4000/api/team/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "search", name: key, limit: 0 }),
    });

    data = (await response.json()) as Team[] | BackendError;
  }
  return data;
};

export const deleteTeam = async (id: number): Promise<Team | BackendError> => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "DELETE",
  });
  const data = (await response.json()) as Team | BackendError;
  return data;
};

export const updateTeam = async (
  id: number,
  name: string
): Promise<Team | BackendError> => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: name,
    }),
  });
  const data = (await response.json()) as Team | BackendError;
  return data;
};

export const createTeam = async (
  teamName: string
): Promise<Team | BackendError> => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: teamName }),
  });
  const data = (await response.json()) as Team | BackendError;
  return data;
};

export interface Pilot {
  id: number;
  name: string;
  team?: {
    id: number;
    name: string;
  };
}

export const getPilots = async (): Promise<Pilot[] | BackendError> => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "GET",
  });
  const data = (await response.json()) as Pilot[] | BackendError;
  return data;
};

export const getPilot = async (
  key: string
): Promise<Pilot[] | BackendError> => {
  if (key === "") {
    return getPilots();
  }

  let data: Pilot[] | BackendError;

  if (!isNaN(+key)) {
    const response = await fetch(`http://localhost:4000/api/pilot/${+key}`, {
      method: "GET",
    });

    data = (await response.json()) as Pilot[] | BackendError;
  } else {
    const response = await fetch(`http://localhost:4000/api/pilot/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "search", name: key, limit: 0 }),
    });

    data = (await response.json()) as Pilot[] | BackendError;
  }
  return data;
};

export const deletePilot = async (
  id: number
): Promise<Pilot | BackendError> => {
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "DELETE",
  });
  const data = (await response.json()) as Pilot | BackendError;
  return data;
};

export const updatePilot = async (
  pilotBody: string
): Promise<Pilot | BackendError> => {
  const id = +(JSON.parse(pilotBody) as Pilot).id;
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  const data = (await response.json()) as Pilot | BackendError;
  return data;
};

export const createPilot = async (
  pilotBody: string
): Promise<Pilot | BackendError> => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  const data = (await response.json()) as Pilot | BackendError;
  return data;
};
