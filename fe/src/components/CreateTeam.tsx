import { useState } from "react";
import { Navigate } from "react-router-dom";
import { BackendError, createTeam } from "./utils";

export default function CreateTeam(): JSX.Element {
  const [formData, setFormData] = useState({
    teamName: "",
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
    if (formData.teamName === "") {
      return;
    }

    const data = await createTeam(formData.teamName.trimStart().trimEnd());

    if ((data as BackendError).reason) {
      setResponse(
        `Error while creating team: ${(data as BackendError).reason}`
      );
    } else {
      setResponse(`${formData.teamName} successfully created. Redirecting...`);
      setTimeout(() => setRedirect(true), 2000);
    }
    setFormData({
      teamName: "",
    });
  }

  if (redirect) {
    return <Navigate to="/teams" />;
  } else {
    return (
      <div className="createTeam">
        {response ? (
          <p className="response">{response}</p>
        ) : (
          <form>
            <input
              type="text"
              id="teamName"
              name="teamName"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={handleChange}
            />
            <button onClick={(event) => void submit(event)}>Create Team</button>
          </form>
        )}
      </div>
    );
  }
}
