import { useState } from "react";
import { createPilot } from "./utils";
import { Navigate } from "react-router-dom";

export default function CreatePilot() {
  const [formData, setFormData] = useState({
    pilotName: "",
    pilotTeam: "",
  });
  const [response, setResponse] = useState("");
  const [redirect, setRedirect] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (formData.pilotName === "") {
      return;
    }
    const pilot = formData.pilotName.trimStart().trimEnd();
    const team = formData.pilotTeam.trimStart().trimEnd();
    const body =
      team.toLowerCase() === "n/a" || team === "na" || team === ""
        ? JSON.stringify({ name: pilot })
        : JSON.stringify({ name: pilot, team: { name: team } });
    const data = await createPilot(body);
    if (data.reason) {
      setResponse(`Error while creating pilot: ${data.reason}`);
    } else {
      setResponse(`${formData.pilotName} successfully created. Redirecting...`);
      setTimeout(() => setRedirect(true), 2000);
    }
    setFormData({
      pilotName: "",
      pilotTeam: "",
    });
  }

  if (redirect) {
    return <Navigate to="/pilots" />;
  } else {
    return (
      <div className="createPilot">
        {response ? (
          <p className="response">{response}</p>
        ) : (
          <form>
            <div className="inputs">
              <input
                type="text"
                id="pilotName"
                name="pilotName"
                placeholder="Pilot Name"
                value={formData.pilotName}
                onChange={handleChange}
              />
              <input
                type="text"
                id="pilotTeam"
                name="pilotTeam"
                placeholder="Pilot's Team"
                value={formData.pilotTeam}
                onChange={handleChange}
              />
            </div>
            <button onClick={submit}>Create Pilot</button>
          </form>
        )}
      </div>
    );
  }
}
