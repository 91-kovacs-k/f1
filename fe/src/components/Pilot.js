import { useState, useEffect } from "react";
import { getPilots, getPilot, deletePilot } from "./utils";
import { Link } from "react-router-dom";

export default function Pilot() {
  const [pilots, setPilots] = useState([]);
  const [formData, setFormData] = useState({
    pilotSearch: "",
  });
  const [response, setResponse] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getPilots();
    if (data.reason) {
      setResponse(`Error while loading pilots: ${data.reason}`);
      setFormData({ teamSearch: "" });
      return;
    }
    setPilots(data);
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  pilots.sort((a, b) => {
    if ((a.team?.name || "") < (b.team?.name || "")) {
      return -1;
    }
    if ((a.team?.name || "") > (b.team?.name || "")) {
      return 1;
    }
    return 0;
  });

  return (
    <>
      <div className="row">
        <Link className="button" to="/createpilot">
          Add Pilot
        </Link>
        <div className="search">
          <form>
            <input
              type="text"
              name="pilotSearch"
              id="pilotSearch"
              value={formData.pilotSearch}
              placeholder="Pilot ID or Name"
              onChange={changeHandler}
            />
            <button
              onClick={async (event) => {
                event.preventDefault();
                const data = await getPilot(formData.pilotSearch);
                if (data.reason) {
                  setResponse(`Error while loading pilot: ${data.reason}`);
                } else if (Array.isArray(data)) {
                  setPilots(data);
                  setResponse("");
                } else {
                  setPilots([data]);
                  setResponse("");
                }
                setFormData({ pilotSearch: "" });
              }}
            >
              Get Pilot
            </button>
          </form>
        </div>
      </div>

      {response === "" ? (
        pilots.map((pilot) => {
          return (
            <div className="pilotItem">
              <span key={pilot.id}>
                {pilot.name}
                {pilot.id === 0 ? "" : `, Team: ${pilot.team?.name || "N/A"}`}
              </span>
              <Link className="button" to={`/pilot/${pilot.id}`}>
                Update
              </Link>
              <button
                className="button delete"
                onClick={async () => {
                  const data = await deletePilot(pilot.id);
                  if (data.reason) {
                    setResponse(`Error while deleting pilot: ${data.reason}`);
                  } else {
                    await load();
                  }
                }}
              >
                Delete
              </button>
            </div>
          );
        })
      ) : (
        <p className="response">{response}</p>
      )}
    </>
  );
}
