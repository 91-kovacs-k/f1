import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { getPilot, updatePilot } from "./utils";

export default function UpdatePilot(params) {
  const [formData, setFormData] = useState({
    pilotName: "",
    pilotTeam: "",
  });
  const [pilot, setPilot] = useState({
    id: 0,
    name: "",
    team: {
      id: 0,
      name: "",
    },
  });
  const [response, setResponse] = useState("");
  const { id } = useParams();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    load(+id);
  }, [id]);

  const load = async (id) => {
    const data = await getPilot(+id);
    if (data.reason) {
      setResponse(`Error while loading pilot: ${data.reason}.`);
      return;
    }
    setPilot(data);
    setFormData({ pilotName: data.name, pilotTeam: data.team?.name });
  };

  const submit = async (event) => {
    event.preventDefault();
    const pilotName = formData.pilotName.trimStart().trimEnd();
    const teamName = formData.pilotTeam?.trimStart().trimEnd() || "";
    const body =
      teamName?.toLowerCase() === "n/a" || teamName === "na" || teamName === ""
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
    const data = await updatePilot(body);
    if (data.reason) {
      setResponse(`Error while updating pilot: ${data.reason}`);
    } else {
      setResponse(`Pilot successfully updated. Redirecting...`);
      setTimeout(() => setRedirect(true), 2000);
    }
  };

  function changeHandler(event) {
    const { name, value } = event.target;

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
            <button onClick={submit}>Submit update</button>
          </form>
        )}
      </div>
    );
  }
}
