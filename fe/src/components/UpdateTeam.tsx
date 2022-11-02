import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { updateTeam, getTeam, Team } from "./utils";

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
    const fetch = await getTeam(id);
    if (fetch.error) {
      setResponse(`Error while loading team: ${fetch.error.reason}.`);
      return;
    } else if (fetch.data) {
      setTeam(fetch.data[0]);
      setFormData({ teamName: fetch.data[0].name });
    }
  };

  async function submit(event: React.SyntheticEvent): Promise<void> {
    event.preventDefault();
    if (!id) {
      return;
    }
    const fetch = await updateTeam(
      +id,
      formData.teamName.trimStart().trimEnd()
    );
    if (fetch.error) {
      setResponse(`Error while updating team: ${fetch.error.reason}.`);
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
