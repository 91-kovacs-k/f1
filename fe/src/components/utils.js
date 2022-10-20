export const getTeams = async () => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const getTeam = async (key) => {
  if (key === "" || key === undefined || key === null) {
    return getTeams();
  }

  let data;

  if (!isNaN(+key)) {
    const response = await fetch(`http://localhost:4000/api/team/${+key}`, {
      method: "GET",
    });

    data = await response.json();
  } else {
    const response = await fetch(`http://localhost:4000/api/team/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "search", name: key, limit: 0 }),
    });

    data = await response.json();
  }
  return data;
};

export const deleteTeam = async (id) => {
  const response = await fetch(`http://localhost:4000/api/team/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

export const updateTeam = async (id, name) => {
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
  const data = await response.json();
  return data;
};

export const createTeam = async (teamName) => {
  const response = await fetch("http://localhost:4000/api/team", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: teamName }),
  });
  const data = await response.json();
  return data;
};

export const getPilots = async () => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "GET",
  });
  const data = await response.json();
  return data;
};

export const getPilot = async (key) => {
  if (key === "" || key === undefined || key === null) {
    return getPilots();
  }

  let data;

  if (!isNaN(+key)) {
    const response = await fetch(`http://localhost:4000/api/pilot/${+key}`, {
      method: "GET",
    });

    data = await response.json();
  } else {
    const response = await fetch(`http://localhost:4000/api/pilot/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "search", name: key, limit: 0 }),
    });

    data = await response.json();
  }
  return data;
};

export const deletePilot = async (id) => {
  const response = await fetch(`http://localhost:4000/api/pilot/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

export const updatePilot = async (pilotBody) => {
  const response = await fetch(
    `http://localhost:4000/api/pilot/${+JSON.parse(pilotBody).id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: pilotBody,
    }
  );
  const data = await response.json();
  return data;
};

export const createPilot = async (pilotBody) => {
  const response = await fetch("http://localhost:4000/api/pilot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: pilotBody,
  });
  const data = await response.json();
  return data;
};
