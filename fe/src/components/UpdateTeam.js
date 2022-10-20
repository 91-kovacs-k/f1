import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { updateTeam, getTeam } from "./utils";

export default function UpdateTeam() {
  const [formData, setFormData] = useState({
    teamName: "",
  });
  const [team, setTeam] = useState({
    id: 0,
    name: "",
  });
  const [response, setResponse] = useState("");
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    load(+id);
  }, []);

  const load = async (id) => {
    const data = await getTeam(+id);
    if (data.reason) {
      setResponse(`Error while loading team: ${data.reason}.`);
      return;
    }
    setTeam(data);
    setFormData({ teamName: data.name });
  };

  async function submit(event) {
    event.preventDefault();
    const data = await updateTeam(+id, formData.teamName.trimStart().trimEnd());
    if (data.reason) {
      setResponse(`Error while updating team: ${data.reason}.`);
      return;
    }
    setResponse(
      `Team successfully updated to '${formData.teamName
        .trimStart()
        .trimEnd()}'.  Redirecting...`
    );
    setTimeout(() => setRedirect(true), 2000);
  }

  function changeHandler(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  if (redirect) {
    return <Navigate to="/teams" />;
  } else {
    return (
      <div className="updateTeam">
        {response ? (
          <p class="response">{response}</p>
        ) : (
          <form>
            <input
              type="text"
              name="teamName"
              id="teamName"
              onChange={changeHandler}
              placeholder={team.name}
              value={formData.teamName}
            />
            <button onClick={submit}>Submit update</button>
          </form>
        )}
      </div>
    );
  }
}
