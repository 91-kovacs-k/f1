import { useState } from "react";
import { Navigate } from "react-router-dom";
import { BackendError, createPilot } from "./utils";

export default function CreatePilot(): JSX.Element {
  const [formData, setFormData] = useState({
    pilotName: "",
    pilotTeam: "",
  });
  const [response, setResponse] = useState("");
  const [redirect, setRedirect] = useState(false);

  function handleChange(event: React.FormEvent<HTMLInputElement>): void {
    const { name, value } = event.currentTarget;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function submit(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    if (formData.pilotName === "") {
      return;
    }
    const pilot = formData.pilotName.trimStart().trimEnd();
    const team = formData.pilotTeam.trimStart().trimEnd();
    const body =
      team.toLowerCase() === "n/a" ||
      team.toLowerCase() === "na" ||
      team.toLowerCase() === ""
        ? JSON.stringify({ name: pilot })
        : JSON.stringify({ name: pilot, team: { name: team } });
    const data = await createPilot(body);
    if ((data as BackendError).reason) {
      setResponse(
        `Error while creating pilot: ${(data as BackendError).reason}`
      );
    } else {
      setResponse(`${formData.pilotName} successfully created. Redirecting...`);
      setTimeout(() => setRedirect(true), 1500);
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
            <button onClick={(event) => void submit(event)}>
              Create Pilot
            </button>
          </form>
        )}
      </div>
    );
  }
}
