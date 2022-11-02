import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getPilot, Pilot, updatePilot } from "./utils";

export default function UpdatePilot(): JSX.Element {
  const [formData, setFormData] = useState({
    pilotName: "",
    pilotTeam: "",
  });
  const [pilot, setPilot] = useState({} as Pilot);
  const [response, setResponse] = useState("");
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (id) {
      void load(id);
    }
  }, [id]);

  const load = async (id: string): Promise<void> => {
    const fetch = await getPilot(id);
    if (fetch.error) {
      setResponse(`Error while loading pilot: ${fetch.error.reason}.`);
      return;
    } else if (fetch.data) {
      setPilot(fetch.data[0]);
      setFormData({
        pilotName: fetch.data[0].name,
        pilotTeam: fetch.data[0].team?.name || "",
      });
    }
  };

  const submit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    if (!id) {
      return;
    }
    const pilotName = formData.pilotName.trimStart().trimEnd();
    const teamName = formData.pilotTeam.trimStart().trimEnd() || "";
    const body =
      teamName.toLowerCase() === "n/a" ||
      teamName.toLowerCase() === "na" ||
      teamName.toLowerCase() === ""
        ? JSON.stringify({
            id: +id,
            name: pilotName,
            team: null,
          })
        : JSON.stringify({
            id: +id,
            name: pilotName,
            team: { name: teamName },
          });
    const fetch = await updatePilot(body);
    if (fetch.error) {
      setResponse(`Error while updating pilot: ${fetch.error.reason}`);
    } else {
      setResponse(`Pilot successfully updated. Redirecting...`);
      setTimeout(() => setRedirect(true), 2000);
    }
  };

  function changeHandler(event: React.FormEvent<HTMLInputElement>): void {
    const { name, value } = event.currentTarget;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  if (redirect) {
    return <Navigate to="/pilots" />;
  } else {
    return (
      <div className="updatePilot">
        {response ? (
          <p className="response">{response}</p>
        ) : (
          <form>
            <div className="inputs">
              <input
                type="text"
                name="pilotName"
                id="pilotName"
                onChange={changeHandler}
                placeholder={pilot.name}
                value={formData.pilotName}
              />
              <input
                type="text"
                name="pilotTeam"
                id="pilotTeam"
                onChange={changeHandler}
                placeholder={pilot.team?.name || "N/A"}
                value={formData.pilotTeam}
              />
            </div>
            <button onClick={(event) => void submit(event)}>
              Submit update
            </button>
          </form>
        )}
      </div>
    );
  }
}
