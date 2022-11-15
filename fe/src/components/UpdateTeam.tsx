import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Team } from "./types";
import { updateTeam, getTeamById } from "./utils";

export default function UpdateTeam(): JSX.Element {
  const [formData, setFormData] = useState({
    teamName: "",
  });
  const [team, setTeam] = useState({} as Team);
  const [response, setResponse] = useState("");
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (id) {
      void load(id);
    }
  }, [id]);

  const load = async (id: string): Promise<void> => {
    const fetch = await getTeamById(id);
    if (!fetch.ok) {
      setResponse(`Error while loading team: ${fetch.error.message}.`);
      return;
    } else if (fetch.data) {
      setTeam(fetch.data);
      setFormData({ teamName: fetch.data.name });
    }
  };

  async function submit(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    if (!id) {
      return;
    }
    const fetch = await updateTeam(id, formData.teamName.trimStart().trimEnd());
    if (!fetch.ok) {
      setResponse(`Error while updating team: ${fetch.error.message}.`);
      return;
    }
    setResponse(
      `Team successfully updated to '${formData.teamName
        .trimStart()
        .trimEnd()}'.  Redirecting...`
    );
    setTimeout(() => setRedirect(true), 2000);
  }

  function changeHandler(event: React.FormEvent<HTMLInputElement>): void {
    const { name, value } = event.currentTarget;

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
          <p className="response">{response}</p>
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
            <button onClick={(event) => void submit(event)}>
              Submit update
            </button>
          </form>
        )}
      </div>
    );
  }
}
