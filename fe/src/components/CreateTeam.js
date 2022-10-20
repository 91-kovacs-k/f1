import { useState } from "react";
import { Navigate } from "react-router-dom";
import { createTeam } from "./utils";

export default function CreateTeam() {
  const [formData, setFormData] = useState({
    teamName: "",
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
    if (formData.teamName === "") {
      return;
    }

    const data = await createTeam(formData.teamName.trimStart().trimEnd());

    if (data.reason) {
      setResponse(`Error while creating team: ${data.reason}`);
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
            <button onClick={submit}>Create Team</button>
          </form>
        )}
      </div>
    );
  }
}
